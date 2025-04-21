from flask import Flask, request, jsonify
import requests
import openai
import os

app = Flask(__name__)
openai.api_key = "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"

NODE_BACKEND_URL = "http://localhost:5001"  # Use local IP if Flask runs on another machine

def fetch_and_concatenate_content(subject_id):
    try:
        url = f"{NODE_BACKEND_URL}/subject/{subject_id}"
        print(f"🌐 Requesting parsed files from Node.js: {url}")
        response = requests.get(url)

        print(f"🔁 Node.js responded with status: {response.status_code}")
        if response.status_code != 200:
            raise Exception(f"Failed to fetch files for subjectId: {subject_id}")

        files = response.json()
        print(f"📂 Received {len(files)} file(s)")

        combined = "\n\n".join(file.get("content", "") for file in files if file.get("content"))
        print(f"📜 Combined content length: {len(combined)}")

        if not combined:
            raise Exception("No extractable content found in subject resources.")
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
        data = request.get_json()
        print("📦 Raw request data:", data)

        subject_id = data.get("subjectId")
        print("🔍 Extracted subjectId:", subject_id)

        if not subject_id:
            return jsonify({"error": "Missing subjectId"}), 400

        content = fetch_and_concatenate_content(subject_id)
        quiz = generate_quiz_with_openai(content)
        print("🎉 Quiz generated successfully!")
        return jsonify({"quiz": quiz})

    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Flask app running at http://0.0.0.0:5002")
    app.run(host="0.0.0.0", port=5002, debug=True)
