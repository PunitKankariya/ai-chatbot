import axios from "axios";

// Support both env var names
const RAG_API_URL = process.env.RAG_API_URL || "http://localhost:8000/generate";
let model = null;

/**
 * Get AI response from either Gemini or RAG
 * @param {string} message - user message
 * @param {Array} history - chat history
 * @param {boolean} useRag - if true, call RAG model instead of Gemini
 */
export async function getAIResponse(message, history = [], useRag = false) {
  console.log('[aiService] getAIResponse called with:', { message, historyLength: history.length, useRag });
  try {
    // Resolve keys at call time to avoid timing issues with dotenv
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (useRag) {
      try {
        console.log(`[aiService] Using RAG backend at ${RAG_API_URL}`);
        const response = await axios.post(RAG_API_URL, {
          question: message,
        });
        return response.data?.response || response.data?.answer || response.data;
      } catch (ragError) {
        if (ragError.code === 'ECONNREFUSED') {
          console.error(`[aiService] RAG API connection refused at ${RAG_API_URL}. Is the RAG server running?`);
        } else {
          console.error('[aiService] Error calling RAG API:', ragError.message);
        }
        // Fallback instead of throwing to avoid 500s
        return `You said: ${message}`;
      }
    }

    // 🔹 Default: Gemini (graceful fallback if not configured)
    if (!geminiApiKey) {
      console.warn("[aiService] Gemini API key not configured. Responding with fallback echo.");
      return `You said: ${message}`;
    }

    // Lazy-load Gemini SDK and initialize model if needed
    if (!model) {
      try {
w
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      } catch (sdkError) {
        console.warn("[aiService] Failed to load @google/generative-ai. Falling back to echo.", sdkError?.message);
        return `You said: ${message}`;
      }
    }
    console.log("[aiService] Using Gemini model: gemini-1.5-flash");
    const cleanHistory = (history) => {
      if (!history || history.length === 0) return [];

      const cleaned = [];
      let lastRole = null;

      // Gemini requires history to start with a user message.
      const startIndex = history.findIndex(msg => msg.role === 'user');

      // If no user message is found, or history is empty, return empty.
      if (startIndex === -1) return [];

      // Start processing from the first user message.
      for (let i = startIndex; i < history.length; i++) {
        const msg = history[i];
        const currentRole = msg.role === "user" ? "user" : "model";
        if (currentRole === lastRole) {
          // Merge with the previous message
          const lastMsg = cleaned[cleaned.length - 1];
          lastMsg.parts[0].text += `\n${msg.content}`;
        } else {
          // Add a new message
          cleaned.push({
            role: currentRole,
            parts: [{ text: msg.content }],
          });
          lastRole = currentRole;
        }
      }
      return cleaned;
    };

    const formattedHistory = cleanHistory(history);

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    return result.response.text();

  } catch (error) {
    console.error('[aiService] Error details:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data,
      status: error?.response?.status,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        data: error?.config?.data
      }
    });
    // Final safety net: never throw to the controller; return fallback
    return `You said: ${message}`;
  }
}
