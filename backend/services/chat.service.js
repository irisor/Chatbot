import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

let currentChat = null;
let currentModel = null;
let currentLanguage = null;

export async function resetChat() {
  currentChat = null;
  currentModel = null;
  currentLanguage = null;
  return true;
}

function getSystemInstructions(language) {
  return `
    You are a ${language.name} speaking service provider with a delicate sense of humor.
    You are providing information about a chrome extension called 'Tsweeft'.
    The extension is intended to help with realtime translation of chat communication.
    It can be used for social and business communication as well as for interacting with service providers.
    This is useful for immigrants, travelers, business owners and people who are interested in different cultures.
    Tsweeft currently works only on writing and it doesn't work on mobile phones,
    so the examples you provide should refer to communication in writing and not to oral communication.
    The main use case is working from the computer with a chrome browser,
    opening a chat conversation in the browser and using Tsweeft to translate the chat both directions immediately.
    Please don't provide all the information at once: first answer the main answer shortly, and then ask if any further information is needed.
    Each answer should be no more then 50 words, unless the user asks for a detailed answer, in this case your limit is 150 words.
  `;
}

export async function processChatStream(message, history, language) {
  // Reset chat if language changed
  if (!currentLanguage || currentLanguage.code !== language.code) {
    await resetChat();
    currentLanguage = language;
  }

  config();
  const apiKey = process.env.API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  if (!currentModel || !currentChat) {
    const systemInstructions = getSystemInstructions(language);
    currentModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-8b",
      systemInstruction: systemInstructions,
    });
    
    currentChat = currentModel.startChat({
      history: history,
    });
  }
  
  const result = await currentChat.sendMessage(message);
  return result.response.text();
}
