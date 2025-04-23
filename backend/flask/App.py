from flask import Flask, request, jsonify
import requests
import openai
import os

app = Flask(__name__)
openai.api_key = "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"

# 🔧 Update to use local IP if Node.js is running on a different machine
NODE_BACKEND_URL = "http://192.168.100.7:5001"  # Replace with actual IP if needed

def fetch_and_concatenate_content(chapter_id):
    try:
        url = f"{NODE_BACKEND_URL}/api/files/{chapter_id}/files"
        print(f"🌐 Requesting parsed files from Node.js: {url}")
        response = requests.get(url)

        print(f"🔁 Node.js responded with status: {response.status_code}")
        if response.status_code != 200:
            raise Exception(f"Failed to fetch files for chapterId: {chapter_id}")

        files = response.json()
        print(f"📂 Received {len(files)} file(s)")

        combined = "\n\n".join(file.get("content", "") for file in files if file.get("content"))
        print(f"📜 Combined content length: {len(combined)}")

        if not combined:
            raise Exception("No extractable content found in chapter resources.")
        return combined
    except Exception as e:
        print(f"❌ Error fetching content: {e}")
        raise

def generate_quiz_with_openai(content):
    try:
        print("🧠 Sending content to OpenAI...")
        prompt = f"""
Generate 3 multiple-choice questions from the content below.
Each question must have 4 options (A–D) and exactly one correct answer.

Content:
\"\"\"
{content}
\"\"\"

Respond in JSON like:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A"
  }},
  ...
]
"""
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        result = response.choices[0].message.content.strip()
        print("✅ OpenAI returned:", result[:200], "...")
        return eval(result)
    except Exception as e:
        print(f"❌ OpenAI error: {e}")
        raise

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    try:
        print("📩 POST /generate-quiz called")
        data = request.get_json(force=True)
        print("📦 Raw request data:", data)

        chapter_id = data.get("chapterId")
        print("🔍 Extracted chapterId:", chapter_id)

        if not chapter_id:
            return jsonify({"error": "Missing chapterId"}), 400

        content = fetch_and_concatenate_content(chapter_id)
        quiz = generate_quiz_with_openai(content)
        print("🎉 Quiz generated successfully!")
        return jsonify({"quiz": quiz})

    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        print("💬 Incoming message:", user_message)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use gpt-4 if needed
            messages=[
                {"role": "system", "content": "You are a helpful student assistant."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip()
        print("🤖 GPT Reply:", reply)
        return jsonify({ "reply": reply })

    except Exception as e:
        print("❌ Chat error:", e)
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    print("🚀 Flask app running at http://0.0.0.0:5002")
    app.run(host="0.0.0.0", port=5002, debug=True)
