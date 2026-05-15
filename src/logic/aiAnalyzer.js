// src/logic/aiAnalyzer.js
/* import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Mover esta lógica a un Backend (Node.js) para proteger la API KEY
const genAI = new GoogleGenerativeAI("TU_API_KEY_AQUÍ");

export async function analizarLinkHardware(url) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Identify GPU model and TDP (Watts) from: ${url}. 
  Return ONLY JSON: {"name": "Model", "consumo": 000}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error en IA:", error);
    return null;
  }
}
*/