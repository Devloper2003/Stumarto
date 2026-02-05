
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getProductEnhancement(productName: string, category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 short, catchy selling points for a school-related product named "${productName}" in the "${category}" category.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "High quality, affordable, and perfect for school students!";
  }
}

export async function getSmartCategory(description: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this description: "${description}", suggest the best school category from: Uniform, Books, Bags, Shoes, Stationery.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text).category;
  } catch (error) {
    return "Stationery";
  }
}
