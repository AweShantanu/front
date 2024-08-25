import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!Array.isArray(parsedInput.data)) {
        throw new Error('Input should contain a data array.');
      }

      const res = await axios.post('https://your-backend-url/bfhl', parsedInput);
      setResponse(res.data);
    } catch (err) {
      // Enhanced error handling
      console.error('Axios error:', err);

      if (err.response) {
        // Server responded with a status code outside the 2xx range
        console.log('Response data:', err.response.data);
        console.log('Response status:', err.response.status);
        console.log('Response headers:', err.response.headers);
        setError(`API Error: ${err.response.data.error || 'An error occurred'} (Status Code: ${err.response.status})`);
      } else if (err.request) {
        // Request was made but no response was received
        console.log('Request data:', err.request);
        setError('No response received from the server. Please check the network or server status.');
      } else {
        // Other errors (e.g., setting up the request)
        console.log('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }

      setResponse(null);
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div className="response">
        {selectedOptions.includes('Alphabets') && response.alphabets.length > 0 && (
          <div>
            <strong>Alphabets:</strong> {response.alphabets.join(', ')}
          </div>
        )}
        {selectedOptions.includes('Numbers') && response.numbers.length > 0 && (
          <div>
            <strong>Numbers:</strong> {response.numbers.join(', ')}
          </div>
        )}
        {selectedOptions.includes('Highest lowercase alphabet') && response.highest_lowercase_alphabet.length > 0 && (
          <div>
            <strong>Highest Lowercase Alphabet:</strong> {response.highest_lowercase_alphabet.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Processor</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          JSON Input:
          <textarea value={jsonInput} onChange={handleInputChange} rows="5" cols="50" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <>
          <label>
            Select Data to Display:
            <select multiple={true} value={selectedOptions} onChange={handleOptionChange}>
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
          </label>
          <div>{renderResponse()}</div>
        </>
      )}
    </div>
  );
};

export default App;
