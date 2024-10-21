import { Client } from "@gradio/client";
import fetch from 'node-fetch';


export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { query } = req.body;
  
      const HUGGING_FACE_API_KEY = 'your-hugging-face-api-key'; // Replace this
  
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: query,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("API Response:", result); // Log the API response to inspect its format
  
        res.status(200).json(result); // Send the result back to the frontend
      } catch (error) {
        console.error("Error fetching Hugging Face model prediction:", error);
        res.status(500).json({ error: "Error fetching prediction." });
      }
    } else {
      res.status(405).json({ error: "Method not allowed. Use POST." });
    }
  }
  
