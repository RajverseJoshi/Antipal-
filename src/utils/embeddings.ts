import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize the Google Gen AI SDK
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates vector embeddings for a given text using the Google Gen AI SDK.
 * 
 * @param text The input string to embed.
 * @returns A promise that resolves to the raw number array representing the embedding.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  
  const result = await model.embedContent(text);
  
  return result.embedding.values;
}
