import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Fix: Per coding guidelines, the API key must be obtained exclusively from `process.env.API_KEY`
// and used directly when initializing the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash";

const systemInstruction = `You are a helpful and friendly expert on blood donation.
Answer the user's questions clearly, concisely, and in French.
Provide safe and accurate information.
Format your answers with markdown for better readability. For example, use lists for steps or bullet points.`;


// Fix: Correctly type the history parameter to match the ChatMessage interface.
export async function* askDonationExpertStream(history: ChatMessage[], newMessage: string) {
  try {
    const chat = ai.chats.create({
      model: model,
      config: { systemInstruction },
      history,
    });
    
    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    yield "Désolé, une erreur est survenue. Veuillez réessayer plus tard.";
  }
}
