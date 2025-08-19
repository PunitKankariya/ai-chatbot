export async function getAIResponse(message, conversationHistory = []) {
  try {
    // If you have an OpenAI API key, use real LLM
    if (process.env.OPENAI_API_KEY) {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ];

      const resp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      });

      return resp.choices[0].message.content;
    }

    // If no API key → fallback dummy LLM
    const responses = [
      "That’s interesting!",
      "Good point, let’s explore that.",
      "Hmm, I see what you mean.",
      "Tell me more about that."
    ];
    const random = responses[Math.floor(Math.random() * responses.length)];
    return `${random} (You said: "${message}")`;

  } catch (err) {
    console.error("AI Service Error:", err);
    throw new Error("Failed to get AI response");
  }
}
