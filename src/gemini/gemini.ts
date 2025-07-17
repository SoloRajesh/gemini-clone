import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyBPgtF4jue2Hy_9tvOiPyUgd39iQewWpMk";

const GeminiChat = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      config: {
        thinkingConfig: { thinkingBudget: -1 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "text/plain",
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let fullText = "";
    for await (const chunk of response) {
      fullText += chunk.text || "";
    }

    return fullText;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return "Something went wrong.";
  }
};

export default GeminiChat;
