
// This service should only call Google GenAI from a trusted server environment.
// Avoid constructing the client at module-evaluation time so the frontend bundle
// doesn't attempt to initialize the SDK (which requires an API key).

export async function getProductEnhancement(productName: string, category: string) {
  // If running in the browser or no API key is present, return a safe fallback.
  if (typeof window !== 'undefined' || !process.env.API_KEY) {
    return 'High quality, affordable, and perfect for school students!';
  }

  try {
    const pkg = '@' + 'google' + '/genai';
    const { GoogleGenAI } = await import(pkg);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 short, catchy selling points for a school-related product named "${productName}" in the "${category}" category.`,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'High quality, affordable, and perfect for school students!';
  }
}

export async function getSmartCategory(description: string) {
  if (typeof window !== 'undefined' || !process.env.API_KEY) {
    return 'Stationery';
  }

  try {
    const pkg = '@' + 'google' + '/genai';
    const { GoogleGenAI, Type } = await import(pkg);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this description: "${description}", suggest the best school category from: Uniform, Books, Bags, Shoes, Stationery.`,
      config: {
        responseMimeType: 'application/json',
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
    console.error('Gemini Error:', error);
    return 'Stationery';
  }
}
