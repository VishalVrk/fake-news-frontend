"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://fakenewsapi-jqok.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Send the user's input as 'text'
      });

      const data = await response.json();

      // Log the response to see if it contains valid data
      console.log("API response:", data);

      // Check if the prediction field exists in the response and process it
      if (data && data.prediction && data.prediction[1]) {
        const predictionArray = data.prediction[1]; // Extract nested array

        // Split the prediction text into Prediction and Justification
        const fullText = predictionArray[0][1].text; // e.g., Prediction and justification text
        const [predictionText, justificationText] = fullText.split('Justification:');

        // Set the extracted prediction and justification in the state
        setPrediction({
          predictionText: predictionText.trim(), // Clean and trim the prediction part
          justificationText: justificationText.trim(), // Clean and trim the justification part
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-semibold text-center mb-6">Fake News Detection</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter text to analyze"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Detect Fake News'}
          </button>
        </form>

        {/* Display error if any */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-lg font-medium text-red-500">Error: {error}</p>
          </div>
        )}

        {/* Display prediction if available */}
        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-lg font-medium">Prediction:</p>
            <p>{prediction.predictionText}</p> {/* Display prediction */}

            <p className="mt-2 text-lg font-medium">Justification:</p>
            <p>{prediction.justificationText}</p> {/* Display justification */}
          </div>
        )}
      </div>
    </div>
  );
}
