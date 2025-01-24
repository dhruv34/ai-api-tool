from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
from anthropic import Anthropic


app = Flask(__name__)
CORS(app)

# Load API keys from .env file
load_dotenv()
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"),)


# Make a request to an OpenAI API based on model type, system prompt, and user input
@app.route('/openai', methods=['POST'])
def handle_openai_request():                
    data = request.get_json()
    if not data.get('model_type') or not data.get('system_prompt') or not data.get('user_input'):
        return jsonify({"error": "Missing required fields: model_type, system_prompt, or user_input"}), 400

    # Build a chat history if inputs and responses are passed in:
    input_history = data.get('input_history', [])
    response_history = data.get('response_history', [])
    messages = [{"role": "system", "content": data.get('system_prompt')}]   # Begin with the system command
    for user_input, response in zip(input_history, response_history):       # Add past chat messages
        messages.append({"role": "user", "content": user_input})
        messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": data.get('user_input')})    # Add the new user input

    completion = openai_client.chat.completions.create(
        model=data.get('model_type'),
        messages=messages
    )
    return jsonify({"response": completion.choices[0].message.content})


# Make a request to an Anthropic API based on model type, system prompt, and user input
@app.route('/anthropic', methods=['POST'])
def handle_anthropic_request():             
    data = request.get_json()
    if not data.get('model_type') or not data.get('system_prompt') or not data.get('user_input'):
        return jsonify({"error": "Missing required fields: model_type, system_prompt, or user_input"}), 400
    
    # Build a chat history if inputs and responses are passed in:
    input_history = data.get('input_history', [])
    response_history = data.get('response_history', [])
    messages = []
    for user_input, response in zip(input_history, response_history):       # Add past chat messages
        messages.append({"role": "user", "content": user_input})
        messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": data.get('user_input')})    # Add the new user input

    message = anthropic_client.messages.create(
        max_tokens=1024,
        system=data.get('system_prompt'),
        messages=messages,
        model=data.get('model_type'),
    )
    return jsonify({"response": message.content[0].text})


if __name__ == '__main__':
    app.run(debug=True)
