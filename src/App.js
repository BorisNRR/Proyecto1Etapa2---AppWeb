import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

function App() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [retrainData, setRetrainData] = useState('');
  const [retrainMetrics, setRetrainMetrics] = useState(null);
  const [error, setError] = useState('');

  // Handle input for prediction
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle input for re-training data
  const handleRetrainInputChange = (e) => {
    setRetrainData(e.target.value);
  };

  // Submit text for prediction (first endpoint)
  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/', {
        "Textos_espanol": inputText
      });
      setPredictions(response.data);
      setError('');
    } catch (err) {
      setError('Error making prediction');
      console.error(err);
    }
  };

  // Submit re-training data (second endpoint)
  const handleRetrainSubmit = async (e) => {
    e.preventDefault();
    // Parse the re-training data as JSON
    let retrainInstances;
    try {
      retrainInstances = JSON.parse(retrainData);
    } catch (err) {
      setError('Invalid JSON format for re-training data');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/retrain/', retrainInstances);
      setRetrainMetrics(response.data);
      setError('');
    } catch (err) {
      setError('Error re-training the model');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Prediction & Re-training App</h1>
        
        {/* Prediction Section */}
        <section className="section">
          <h2>Prediction</h2>
          <form onSubmit={handlePredictSubmit}>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text for prediction"
              rows="4"
              cols="50"
              className="text-input"
            />
            <button type="submit" className="btn">Predict</button>
          </form>

          {error && <p className="error">{error}</p>}

          {predictions.length > 0 && (
            <div>
              <h3>Predictions</h3>
              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index}>
                    Prediction: {prediction.prediction}, Probability: {prediction.probability.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Re-training Section */}
        <section className="section">
          <h2>Re-train Model</h2>
          <form onSubmit={handleRetrainSubmit}>
            <textarea
              value={retrainData}
              onChange={handleRetrainInputChange}
              placeholder='Enter JSON array with data for re-training, e.g. [{"Textos_espanol": "texto", "sdg": 3}, ...]'
              rows="6"
              cols="60"
              className="text-input"
            />
            <button type="submit" className="btn">Re-train</button>
          </form>

          {error && <p className="error">{error}</p>}

          {retrainMetrics && (
            <div>
              <h3>Re-training Metrics</h3>
              <p>Precision: {retrainMetrics.precision}</p>
              <p>Recall: {retrainMetrics.recall}</p>
              <p>F1-score: {retrainMetrics.f1_score}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
