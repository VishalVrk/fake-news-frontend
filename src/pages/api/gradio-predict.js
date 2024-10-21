import { Client } from "@gradio/client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body; // Get user input from the frontend

    try {
      // Connect to the Gradio model
      const client = await Client.connect("Qwen/Qwen2.5");

      // Modify the system session first
      await client.predict("/modify_system_session", {
        system: `Given an input (whether it's a link or a question), verify its accuracy using available online resources. Determine if the information is true or false. Provide the output in the following format:

        Prediction: A one-line statement confirming if the information is true or false with a percentage of certainty.
        Justification: A brief paragraph (under 1000 characters) explaining the reasoning behind the prediction.`,
      });

      // Call the model to get the prediction based on user input
      const result = await client.predict("/model_chat_1", {
        query, // This is the user input
        history: [], // Keeping history empty for now
        system: `Given an input (whether it's a link or a question), verify its accuracy using available online resources. Determine if the information is true or false. Provide the output in the following format:

        Prediction: A one-line statement confirming if the information is true or false with a percentage of certainty.
        Justification: A brief paragraph (under 1000 characters) explaining the reasoning behind the prediction.`,
        radio: "72B", // The radio value provided
      });

      // Send the prediction back to the frontend
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching Gradio model prediction:", error);
      res.status(500).json({ error: "Error fetching prediction." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
