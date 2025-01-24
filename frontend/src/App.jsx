import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatLog from './ChatLog';
import HistoryBar from './HistoryBar';

const App = () => {
  
  const [error, setError] = useState('');
  const [type, setType] = useState('openai');             // openai or anthropic
  const [model, setModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [pastResponses, setPastResponses] = useState([]); // log of past responses received in a chat
  const [pastInputs, setPastInputs] = useState([]);       // log of past inputs sent in a chat
  const [userInput, setUserInput] = useState('');         // current input
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);             // history of all prior chats

  const openaiModels = ['gpt-4o', 'chatgpt-4o-latest', 'gpt-4o-mini', 'o1', 'o1-mini', 'o1-preview', 'gpt-4o-realtime-preview', 'gpt-4o-mini-realtime-preview', 'gpt-4o-audio-preview'];
  const anthropicModels = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];

  function submit() {
    console.log(systemPrompt, userInput)
    setError('');
    if (!model || (type == 'openai' && !openaiModels.includes(model)) || (type == 'anthropic' && !anthropicModels.includes(model))) {     // if model not selected or invalid model
      setError('Please select a model.'); 
      return;
    }
    if (!systemPrompt) {
      setError('Please enter a system prompt.'); 
      return;
    }
    if (!userInput) {
      setError('Please enter a user input.'); 
      return;
    }
    setLoading(true);
    // Data to send to the backend
    const requestData = {
      model_type: model,
      system_prompt: systemPrompt,
      user_input: userInput,
      input_history: pastInputs,
      response_history: pastResponses,
    };
    axios.post('http://127.0.0.1:5000/' + type, requestData)
      .then(response => {
        // On a successful request, update chat history
        setPastResponses([...pastResponses, response.data.response]);
        setPastInputs([...pastInputs, userInput]);
      })
      .catch(error => {
        if (error.response) {
          setError(`API Error: ${error.response.data.message || 'An error occurred'}`);
        } else if (error.request) {
          setError('Network Error: Unable to connect to the API');
        } else {
          setError(`Error: ${error.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function newChat() {
    setHistory([{ type, model, systemPrompt, pastInputs, pastResponses}, ...history]);   // Save chat information to history
    setError('');           // Clear all chat information for new chat
    setSystemPrompt('');
    setUserInput('');
    setPastInputs([]);
    setPastResponses([]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.typeContainer}>
          <button onClick={() => setType('openai')} style={type === 'openai' ? styles.selected : styles.unselected}>OpenAI</button>
          <button onClick={() => setType('anthropic')} style={type === 'anthropic' ? styles.selected : styles.unselected}>Anthropic</button>
        </div>
        <div style={styles.modelContainer}>
          {(type === 'openai' ? openaiModels : anthropicModels).map((m, index) => (
            <button key={index} onClick={() => setModel(m)} style={model === m ? styles.selected : styles.unselected}>
              {m}
            </button>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label} >System Prompt:</label>
          <input style={styles.input} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
          <ChatLog pastInputs={pastInputs} pastResponses={pastResponses}/>
          {loading && <p style={{ color: '#555', fontStyle: 'italic' }}>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}
          <label style={styles.label}>User Input:</label>
          <input style={styles.input} value={userInput} onChange={(e) => setUserInput(e.target.value)} />
        </div>
        <button style={styles.submitButton} onClick={submit}>Submit</button>
        <button style={styles.submitButton} onClick={newChat}>New Chat</button>
      </div>
      <HistoryBar history={history} setType={setType} setModel={setModel} setSystemPrompt={setSystemPrompt} setPastInputs={setPastInputs} setPastResponses={setPastResponses}/>
    </div>
  );
};

export default App;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1200px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '20px',
  },
  formContainer: {
    width: '80%',
  },
  typeContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0px 30px 0px',
  },
  modelContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    margin: '20px 0',
  },
  inputContainer: {
    margin: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  submitButton: {
    backgroundColor: '#00BFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'block',
    margin: '10px auto',
  },
  selected: {
    backgroundColor: '#007BFF',
    border: '2px solid #0056b3',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  unselected: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
    border: '2px solid #CCCCCC',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontWeight: 'normal',
  },
  response: {
    marginTop: '20px',
    color: '#28a745',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '20px',
    color: '#dc3545',
    fontWeight: 'bold',
  },
};