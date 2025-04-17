from flask import Flask, request, jsonify
from transformers import pipeline
import torch
import nltk
import random
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
import spacy
import re
import random
# Setup
nltk.download("wordnet")
lemmatizer = WordNetLemmatizer()
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)

# Load T5 model
print("🔄 Loading T5 model: valhalla/t5-base-qg-hl")
question_generator = pipeline(
    "text2text-generation",
    model="valhalla/t5-base-qg-hl",
    tokenizer="valhalla/t5-base-qg-hl",
    device=0 if torch.cuda.is_available() else -1
)

# Extract main keyword using spaCy
def extract_main_keyword(text):
    doc = nlp(text)
    print("\n🧾 Parsed Document:")
    for token in doc:
        print(f"{token.text:<15} | POS: {token.pos_:<10} | DEP: {token.dep_}")
    
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and token.is_alpha:
            return token.text.lower()
    return text.split()[0]

# Generate distractors using WordNet
def get_distractors(content, answer):

    # Extract all words 3+ letters (including shorter ones like 'RAM', 'CPU')
    words = list(set(re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())))

    # Remove the answer and duplicates
    words = [w for w in words if w != answer.lower() and w not in answer.lower()]

    # Handle case when there are not enough
    if len(words) < 3:
        # fallback to most common short tech words
        fallback = ["memory", "system", "data", "code", "power", "signal", "file", "thread"]
        words = list(set(words + fallback))

    # Ensure at least 3 distractors
    if len(words) >= 3:
        return random.sample(words, 3)
    else:
        return ["randomA", "randomB", "randomC"]


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    try:
        data = request.get_json()
        content = data.get('content', '').strip()

        if not content:
            return jsonify({"error": "Content is required"}), 400

        # Discard first 100 tokens, use up to token 612
        tokens = question_generator.tokenizer.encode(content, truncation=False)
        if len(tokens) > 100:
            print(f"✂️ Slicing tokens from 100 to 612 (original length: {len(tokens)})")
            tokens = tokens[2000:3700]
            content = question_generator.tokenizer.decode(tokens, skip_special_tokens=True)
        else:
            print("⚠️ Less than 100 tokens in input. Using full text.")

        # Extract keyword
        keyword = extract_main_keyword(content)
        highlighted_content = content.replace(keyword, f"<hl>{keyword}</hl>")
        prompt = f"generate question: {highlighted_content}"

        results = question_generator(
            prompt,
            max_length=64,
            num_return_sequences=3,
            num_beams=4,
            early_stopping=True
        )

        quiz = []
        for item in results:
            question_text = item['generated_text'].strip()

            distractors = get_distractors(keyword, content)
            all_options = [keyword] + distractors
            random.shuffle(all_options)
            correct_index = all_options.index(keyword)
            correct_letter = chr(65 + correct_index)

            options = [f"{chr(65+i)}. {opt}" for i, opt in enumerate(all_options)]

            quiz.append({
                "question": question_text,
                "options": options,
                "answer": correct_letter
            })

        return jsonify({"quiz": quiz})

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)