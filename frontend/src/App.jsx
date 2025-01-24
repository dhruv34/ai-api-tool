import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [resp, setResp] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('openai');
  const [model, setModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userInput, setUserInput] = useState('');

  const openaiModels = ['gpt-4o', 'chatgpt-4o-latest', 'gpt-4o-mini', 'o1', 'o1-mini', 'o1-preview', 'gpt-4o-realtime-preview', 'gpt-4o-mini-realtime-preview', 'gpt-4o-audio-preview'];
  const anthropicModels = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];

  function submit() {
    const requestData = {
      model_type: model,
      system_prompt: systemPrompt,
      user_input: userInput,
    };

    axios.post('http://127.0.0.1:5000/' + type, requestData)
      .then(response => {
        console.log('frontend resp: ', response.data);
        setResp(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to fetch response from the API');
      });
  };

  return (
    <div>

      <button onClick={() => setType('openai')} style={type == 'openai' ? styles.selected : styles.unselected}>OpenAI</button>
      <button onClick={() => setType('anthropic')}  style={type == 'anthropic' ? styles.selected : styles.unselected}>Anthropic</button>

      <div>
        {type === 'openai' &&
          openaiModels.map((m, index) => (
            <button 
              key={index} 
              onClick={() => setModel(m)} 
              style={model === m ? styles.selected : styles.unselected}>
              {m}
            </button>
          ))
        }
        {type === 'anthropic' &&
          anthropicModels.map((m, index) => (
            <button 
              key={index} 
              onClick={() => setModel(m)} 
              style={model === m ? styles.selected : styles.unselected}>
              {m}
            </button>
          ))
        }
      </div>
      <label> Enter System prompt:
        <input onChange={(e) => setSystemPrompt(e.target.value)}/>
      </label>
      <label> Enter User Input:
        <input onChange={(e) => setUserInput(e.target.value)}/>
      </label>
      <button onClick={submit}>Submit</button>
      <p>{resp}</p>
    </div>
  );
};

export default App;

const styles = {
  selected: {
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: '2px solid #0056b3',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  unselected: {
    backgroundColor: '#F8F9FA',
    color: '#000000',
    border: '2px solid #CCCCCC',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'normal',
  },
};

