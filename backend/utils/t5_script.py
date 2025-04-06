# t5_script.py
import sys
import json

# Simulated generation for testing (replace with actual T5 model)
prompt = sys.argv[1]

quiz = [
    {
        "question": "In what year did the United States host the FIFA World Cup for the first time?",
        "options": ["1986", "1994", "2002", "2010"],
        "answer": "1994"
    },
    {
        "question": "Who won the FIFA World Cup in 2018?",
        "options": ["Germany", "Brazil", "France", "Argentina"],
        "answer": "France"
    }
]

print(json.dumps(quiz))  # Output the JSON to Node
