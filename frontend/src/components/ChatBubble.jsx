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
  
  // Normalize all bullet point formats to use "- "
  let formatted = response
    .replace(/•/g, '-')  // Replace • with -
    .replace(/\*/g, '-')  // Replace * with -
    .replace(/\n\s*-/g, '\n-')  // Remove spaces after newlines before bullets
    .replace(/-\s+/g, '- ')  // Ensure single space after bullet
    .replace(/\n{3,}/g, '\n\n');  // Remove multiple consecutive newlines
  
  // Split into lines and process each line
  const lines = formatted.split('\n');
  const result = [];
  
  for (const line of lines) {
    let currentLine = line.trim();
    
    // Skip empty lines
    if (!currentLine) {
      result.push('');
      continue;
    }
    
    // If line starts with a bullet point
    if (currentLine.startsWith('-')) {
      // Check if multiple bullet points are on the same line
      const bulletPoints = currentLine.split(/(?<=\S)-\s+/);
      
      if (bulletPoints.length > 1) {
        // Add the first bullet point
        result.push(`- ${bulletPoints[0].replace(/^-\s*/, '')}`);
        
        // Add remaining bullet points on new lines
        for (let i = 1; i < bulletPoints.length; i++) {
          result.push(`- ${bulletPoints[i].trim()}`);
        }
      } else {
        // Single bullet point on this line
        result.push(`- ${currentLine.replace(/^-\s*/, '').trim()}`);
      }
    } else {
      // If no bullet point, add one
      result.push(`- ${currentLine}`);
    }
  }
  
  // Join lines and ensure no consecutive empty lines
  return result.join('\n').replace(/\n{3,}/g, '\n\n');
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
        console.log([aiService] Using RAG backend at ${RAG_API_URL});
        const response = await axios.post(RAG_API_URL, {
          question: message,
        });
        const ragResponse = response.data?.response || response.data?.answer || response.data;
        return formatBulletPoints(ragResponse);
      } catch (ragError) {
        if (ragError.code === 'ECONNREFUSED') {
          console.error([aiService] RAG API connection refused at ${RAG_API_URL}. Is the RAG server running?);
        } else {
          console.error('[aiService] Error calling RAG API:', ragError.message);
        }
        // Fallback instead of throwing to avoid 500s
        return formatBulletPoints(You said: ${message});
      }
    }

    // 🔹 Default: Gemini (graceful fallback if not configured)
          if (!geminiApiKey) {
        console.warn("[aiService] Gemini API key not configured. Responding with fallback echo.");
        return formatBulletPoints(You said: ${message});
      }

    // Lazy-load Gemini SDK and initialize model if needed
    if (!model) {
      try {

        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
              } catch (sdkError) {
          console.warn("[aiService] Failed to load @google/generative-ai. Falling back to echo.", sdkError?.message);
          return formatBulletPoints(You said: ${message});
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
          lastMsg.parts[0].text += \n${msg.content};
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

    const result = await chat.sendMessage(formattedMessage);
    const geminiResponse = result.response.text();
    return formatBulletPoints(geminiResponse);

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
    return formatBulletPoints(You said: ${message});
  }
}