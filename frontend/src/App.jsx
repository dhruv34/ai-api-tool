import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [resp, setResp] = useState('');
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/')
      .then(response => {console.log(response.data); setResp(response.data)})
      .catch(error => console.error('Error:', error));
  }, []);

  return <div>Check the console for the API response. {resp}</div>;
};

export default App;