import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

export async function processChatStream(message, history) {
  config();
  const apiKey = process.env.API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-8b" ,
    systemInstruction: "You are a Spanish speaking funny service provider",
  });
  const chat = model.startChat({
    history: history,
  });
  const result = await chat.sendMessage(message);

  return result.response.text();
}
