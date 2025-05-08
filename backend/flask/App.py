from flask import Flask, request, jsonify, session
import requests
import openai
import os
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

# 🔐 OpenAI API Key
openai.api_key = "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"

# 🔗 Node.js backend URL (MongoDB + Express)
NODE_BACKEND_URL = "http://192.168.1.56:5005"


# 📚 Fetch and combine all file contents for a chapter
def fetch_and_concatenate_content(chapter_id):
    try:
        url = f"{NODE_BACKEND_URL}/api/files/{chapter_id}/files"
        print(f"🌐 Requesting parsed files from: {url}")
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch chapter content: {response.text}")

        files = response.json()
        combined = "\n\n".join(file.get("content", "") for file in files if file.get("content"))

        if not combined:
            raise Exception("No extractable content found.")

        return combined
    except Exception as e:
        print(f"❌ Error fetching content: {e}")
        raise


# 🧠 Generate quiz from content using GPT-4
def generate_quiz_with_openai(content):
    try:
        prompt = f"""
Generate 5 multiple-choice questions from the content below.
Each question must have 4 shuffled options (A–D) and exactly one correct answer.

Return JSON in this format:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A"
  }},
  ...
]

Content:
\"\"\"
{content}
\"\"\"
"""
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{ "role": "user", "content": prompt }],
            temperature=0.7
        )
        return eval(response.choices[0].message.content.strip())
    except Exception as e:
        print(f"❌ OpenAI error: {e}")
        raise


# 💾 Save quiz to Node.js backend
def save_quiz_to_backend(chapter_id, quiz):
    try:
        url = f"{NODE_BACKEND_URL}/api/quizzes/{chapter_id}"

        formatted_questions = [
            {
                "questionText": q["question"],
                "options": q["options"],
                "correctAnswer": next(opt for opt in q["options"] if opt.startswith(q["answer"] + "."))  # Match label
            }
            for q in quiz
        ]

        payload = {
            "title": "Auto-generated Quiz",
            "questions": formatted_questions
        }

        response = requests.post(url, json=payload)

        if response.status_code != 201:
            raise Exception(f"Failed to save quiz: {response.text}")

        return response.json()
    except Exception as e:
        print(f"❌ Error saving quiz: {e}")
        raise


# 📥 POST /generate-quiz
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    try:
        data = request.get_json(force=True)
        chapter_id = data.get("chapterId")

        if not chapter_id:
            return jsonify({ "error": "Missing chapterId" }), 400

        print("🔍 Generating quiz for chapter:", chapter_id)
        content = fetch_and_concatenate_content(chapter_id)
        quiz = generate_quiz_with_openai(content)
        saved_quiz = save_quiz_to_backend(chapter_id, quiz)

        return jsonify({ "quiz": quiz, "saved": saved_quiz })
    except Exception as e:
        print(f"💥 Error in /generate-quiz:", e)
        return jsonify({ "error": str(e) }), 500


# 💬 GPT-powered Chatbot
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({ "error": "Message is required" }), 400

        history = session.get("chat_history", [])
        history.append({ "role": "user", "content": user_message })

        messages = [{ "role": "system", "content": "You are a helpful student assistant." }] + history

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip()
        history.append({ "role": "assistant", "content": reply })
        session["chat_history"] = history[-10:]

        return jsonify({ "reply": reply })

    except Exception as e:
        print("❌ Chat error:", e)
        return jsonify({ "error": str(e) }), 500


if __name__ == "__main__":
    print("🚀 Flask backend running at http://0.0.0.0:5002")
    app.run(host="0.0.0.0", port=5002, debug=True)
