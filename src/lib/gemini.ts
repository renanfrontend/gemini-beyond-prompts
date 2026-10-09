import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Please provide API key.');
  }
  // O gemini-1.5-pro foi desligado pelo Google em setembro de 2025.
  return genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
};

export const generateEmbedding = async (text: string) => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized');
  }
  
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
};