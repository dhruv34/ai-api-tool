from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
from anthropic import Anthropic


app = Flask(__name__)
CORS(app)

load_dotenv()
openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

anthropic_client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

@app.route('/openai', methods=['POST'])
def handle_openai_request():
    data = request.get_json()
    model_type = data.get('model_type')
    system_prompt = data.get('system_prompt')
    user_input = data.get('user_input')
    completion = openai_client.chat.completions.create(
        model=model_type,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    )
    print('resp: ', completion.choices[0].message.content)
    return completion.choices[0].message.content

@app.route('/anthropic', methods=['POST'])
def handle_anthropic_request():
    data = request.get_json()
    model_type = data.get('model_type')
    system_prompt = data.get('system_prompt')
    user_input = data.get('user_input')
    message = anthropic_client.messages.create(
        max_tokens=1024,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_input}
        ],
        model=model_type,
    )
    return message.content[0].text

if __name__ == '__main__':
    app.run(debug=True)
