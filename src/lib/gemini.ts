import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getResolutionSuggestion(category: string, description: string | null): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI co-pilot for a budget hotel front desk in India. 
A guest has submitted a complaint. Please provide 1 or 2 very short, actionable suggestions for the front desk staff on how to resolve this. 
Keep it under 20 words total. Be practical and direct. You can use English or a mix of simple plain Hindi/English.
DO NOT use complicated jargon or formatting.

Complaint Category: ${category}
Guest Description: ${description || 'None provided'}

Suggestion:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Please assign a staff member to check the room immediately.";
  }
}
