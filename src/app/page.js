"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Add error state to capture issues

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Reset any previous errors

    try {
      const response = await fetch('https://fakenewsapi-jqok.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),  // Send user input in request body
      });

      const data = await response.json();

      // Check if the response contains an error
      if (!response.ok || !data.prediction) {
        throw new Error('Failed to get prediction or invalid response');
      }

      setPrediction(data.prediction);  // Set the prediction result
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction. Please try again.');  // Set error message
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

        {/* Display the error message if any */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-lg font-medium text-red-500">Error: {error}</p>
          </div>
        )}

        {/* Display the prediction result if available */}
        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-lg font-medium">Prediction:</p>
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
