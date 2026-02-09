
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDiagnosticSummary = async (deviceLogs: string, telemetry: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following postomat (parcel locker) logs and telemetry. 
      Identify potential hardware issues or maintenance needs. 
      Summarize in 3 bullet points in Russian.
      Logs: ${deviceLogs}
      Telemetry: ${telemetry}`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Не удалось получить AI-аналитику.";
  }
};
