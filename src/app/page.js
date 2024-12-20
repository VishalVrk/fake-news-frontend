"use client";
import { useState } from "react";
import { Search, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function Home() {
  const [text, setText] = useState(""); // For the input text
  const [suggestions, setSuggestions] = useState([]); // For the suggestions
  const [prediction, setPrediction] = useState(null); // For the prediction result
  const [loading, setLoading] = useState(false); // For the loading state
  const [error, setError] = useState(null); // For errors
  const [apiKey, setApiKey] = useState(""); // For OpenAI API Key
  const [apiKeySubmitted, setApiKeySubmitted] = useState(false); // For API Key submission

  // Fetch suggestions from the server
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch("https://fakenewsapi-jqok.onrender.com/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions || []);
      } else {
        setSuggestions([]);
        console.error("Error fetching suggestions:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Handle input changes and fetch suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);
    fetchSuggestions(value); // Trigger suggestions fetch
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setText(suggestion); // Set the input to the clicked suggestion
    setSuggestions([]); // Clear suggestions
  };

  // Handle API Key submission
  const handleApiKeySubmit = async (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      alert("Please enter a valid API key.");
      return;
    }

    try {
      const response = await fetch("https://fakenewsapi-jqok.onrender.com/update-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Notify user
        setApiKeySubmitted(true); // Mark API Key as submitted
      } else {
        console.error("Error updating API key:", data.error || "Unknown error");
        alert("Error updating API key. Please try again.");
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      alert("Error updating API key. Please try again.");
    }
  };

  // Handle prediction submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://fakenewsapi-jqok.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text}), // Include the API Key in the payload
      });

      const data = await response.json();

      if (response.ok && data.prediction) {
        const predictionArray = data.prediction[1];
        const fullText = predictionArray[0][1].text;
        const [predictionText, justificationText] = fullText.split("Justification:");
        setPrediction({
          predictionText: predictionText.trim(),
          justificationText: justificationText.trim(),
        });
      } else {
        throw new Error(data.error || "Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch prediction. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Fake News Detection
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* API Key Input */}
            {!apiKeySubmitted && (
              <form onSubmit={handleApiKeySubmit} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="text"
                    className="w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
                    placeholder="Enter your OpenAI API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Submit API Key
                </button>
              </form>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
                    placeholder="Enter news text or headline..."
                    value={text}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Analyze Text</>
                )}
              </button>
            </form>

            {/* Error Handling */}
            {error && (
              <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Prediction Output */}
            {prediction && (
              <div className="space-y-4 mt-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Analysis Result</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Prediction</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{prediction.predictionText}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Justification</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{prediction.justificationText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
