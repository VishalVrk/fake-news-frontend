"use client"
import { useState } from 'react';
import { Client } from "@gradio/client";  // Import the Gradio client

export default function Home() {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to connect and predict using the Hugging Face Gradio API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connect to the Hugging Face model
      const client = await Client.connect("Qwen/Qwen2.5");  // Model name provided in the API code
      
      // Send the query and system prompt to the model
      const result = await client.predict("/model_chat_1", {
        query: text,  // The input from the user (query)
        history: [],  // History is kept empty
        system: `Given an input (whether it's a link or a question), verify its accuracy using available online resources. Determine if the information is true or false. Provide the output in the following format:

        Prediction: A one-line statement confirming if the information is true or false with a percentage of certainty.
        Justification: A brief paragraph (under 1000 characters) explaining the reasoning behind the prediction.`,
        radio: "72B",  // Example radio value, ensure it's a valid input
      });
      
      // Set the prediction result (use the format that matches the returned data)
      setPrediction(result.data);
    } catch (error) {
      console.error('Error:', error);
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
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Detect Fake News'}
          </button>
        </form>
        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-lg font-medium">Prediction:</p>
            <p>{prediction.Prediction}</p>
            <p className="mt-2"><strong>Justification:</strong> {prediction.Justification}</p>
          </div>
        )}
      </div>
    </div>
  );
}
