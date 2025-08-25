import axios from "axios";

// Support both env var names
const RAG_API_URL = process.env.RAG_API_URL || "http://127.0.0.1:8000/generate";
let model = null;

/**
 * Ensure response is properly formatted with bullet points
 * @param {string} response - AI response text
 * @returns {string} - Formatted response with bullet points
 */
function formatBulletPoints(response) {
  if (!response) return response;
  
  // If already has bullet points, return as is
  if (response.includes("- ") || response.includes("• ")) {
    return response;
  }
  
  // Split by sentences and convert to bullet points
  const sentences = response.split(/[.!?]+/).filter(sentence => sentence.trim().length > 10);
  if (sentences.length > 1) {
    return sentences.map(sentence => `- ${sentence.trim()}`).join('\n');
  }
  
  // If only one sentence or short text, return as is
  return response;
}

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
        const ragResponse = response.data?.response || response.data?.answer || response.data;
        return formatBulletPoints(ragResponse);
      } catch (ragError) {
        if (ragError.code === 'ECONNREFUSED') {
          console.error(`[aiService] RAG API connection refused at ${RAG_API_URL}. Is the RAG server running?`);
        } else {
          console.error('[aiService] Error calling RAG API:', ragError.message);
        }
        // Fallback instead of throwing to avoid 500s
        return formatBulletPoints(`You said: ${message}`);
      }
    }

    // 🔹 Default: Gemini (graceful fallback if not configured)
          if (!geminiApiKey) {
        console.warn("[aiService] Gemini API key not configured. Responding with fallback echo.");
        return formatBulletPoints(`You said: ${message}`);
      }

    // Lazy-load Gemini SDK and initialize model if needed
    if (!model) {
      try {
        console.log("[aiService] Initializing Gemini model...");
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        
        // Initialize the model with the correct name
        try {
          model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          });
          console.log("[aiService] Successfully initialized Gemini model: gemini-1.5-flash");
        } catch (modelError) {
          console.error("[aiService] Failed to initialize model:", modelError.message);
          throw modelError; // Re-throw to be caught by outer catch
        }
      } catch (sdkError) {
        console.warn("[aiService] Failed to load @google/generative-ai. Falling back to echo.", sdkError?.message);
        return formatBulletPoints(`You said: ${message}`);
      }
    }
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

    // Add detailed bullet point formatting instruction for non-RAG responses
    const formattedMessage = `Please provide a clear and concise response to the following query. 
    Format your response using bullet points (start each point with '- '). 
    Keep each point brief and focused on a single idea. 
    Ensure there is a blank line between each bullet point for better readability.
    
    Query: ${message}`;

    try {
      const result = await chat.sendMessage(formattedMessage);
      const geminiResponse = result.response.text();
      return formatBulletPoints(geminiResponse);
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        console.warn('[aiService] Quota exceeded, falling back to echo response');
        return formatBulletPoints("I'm currently experiencing high demand. Please try again later or check your API quota.\n\nYou asked: " + message);
      }
      throw error; // Re-throw other errors to be caught by the outer catch
    }

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
    return formatBulletPoints(`You said: ${message}`);
  }
} 