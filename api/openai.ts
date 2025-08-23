import axios from "axios"

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const { prompt, schema } = req.body || {}
  if (!prompt || !schema) {
    res.status(400).json({ error: "Missing prompt or schema" })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" })
    return
  }

  try {
    const body = {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.5,
      stop: ['"""'],
      functions: [{ name: "set-json", parameters: schema }],
      function_call: { name: "set-json" },
    }

    const response = await axios.post("https://api.openai.com/v1/chat/completions", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })

    res.status(200).json(response.data)
  } catch (err: any) {
    const status = err?.response?.status || 500
    const data = err?.response?.data || { error: "OpenAI request failed" }
    res.status(status).json(data)
  }
}
