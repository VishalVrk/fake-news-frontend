import fetch from 'node-fetch';  // Use node-fetch for making HTTP requests in Node.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;  // Capture user input (query) from the request body

    try {
      // Define the custom system prompt
      const customPrompt = `Given an input (whether it's a link or a question), verify its accuracy using available online resources. 
      Determine if the information is true or false. Provide the output in the following format:

      Prediction: A one-line statement confirming if the information is true or false with a percentage of certainty.
      Justification: A brief paragraph (under 1000 characters) explaining the reasoning behind the prediction.`;

      // Step 1: Modify the system session
      const systemSessionResponse = await fetch('https://qwen-qwen2-5.hf.space/run/modify_system_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [customPrompt],  // Send the custom system prompt to modify the session
        }),
      });

      if (!systemSessionResponse.ok) {
        throw new Error(`Failed to modify system session: ${systemSessionResponse.status}`);
      }

      console.log("System session modified successfully.");

      // Step 2: Generate prediction using the modified system session
      const modelChatResponse = await fetch('https://qwen-qwen2-5.hf.space/run/model_chat_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [query],  // Send the user query
          history: [],  // Set history as an empty array
          system: customPrompt,  // Send the same system prompt for context
          radio: "72B",  // The radio value (if applicable)
        }),
      });

      if (!modelChatResponse.ok) {
        throw new Error(`Failed to fetch prediction: ${modelChatResponse.status}`);
      }

      const result = await modelChatResponse.json();  // Parse the JSON response from the Space
      console.log("Hugging Face Space API Response:", result);  // Log the result for debugging

      // Send the result back to the frontend
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching Hugging Face Space prediction:", error);
      res.status(500).json({ error: "Error fetching prediction." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed. Use POST." });
  }
}
