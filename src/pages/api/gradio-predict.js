import { Client } from "@gradio/client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    try {
      // Connect to the Gradio model (Hugging Face)
      const client = await Client.connect("Qwen/Qwen2.5");
      
      // Call the predict method with the query and system prompt
      const result = await client.predict("/model_chat_1", {
        query,  // Pass the query from the frontend
        history: [],
        system: `Given an input (whether it's a link or a question), verify its accuracy using available online resources. Determine if the information is true or false. Provide the output in the following format:

        Prediction: A one-line statement confirming if the information is true or false with a percentage of certainty.
        Justification: A brief paragraph (under 1000 characters) explaining the reasoning behind the prediction.`,
        radio: "72B",  // Example radio value
      });
      
      // Return the result back to the frontend
      res.status(200).json(result.data);
    } catch (error) {
      console.error("Error fetching Gradio client prediction:", error);
      res.status(500).json({ error: "Error fetching prediction." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed, use POST" });
  }
}
