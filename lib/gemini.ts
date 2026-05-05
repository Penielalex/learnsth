import { GoogleGenerativeAI } from "@google/generative-ai";

// add api key here
const API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export interface TopicWithResources {
  title: string;
  resources: { title: string; url: string }[];
}

export interface LearningPathResult {
  category: string;
  topics: TopicWithResources[];
}

export async function generateLearningTopics(goalTitle: string, hoursPerDay: number): Promise<LearningPathResult | null> {
  if (!API_KEY) {
    console.error("Gemini API Key is missing");
    return null;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    I want to learn ${goalTitle}. I can spend ${hoursPerDay} hours per day learning.
    Create a list of 5-8 bite-sized topics that I can learn each day.
    For each topic, provide exactly 3 high-quality learning resources (official docs, MDN, YouTube tutorials, etc.).
    Also, categorize this learning goal into a single broad category (e.g. "Programming", "Design", "Business", "Language").
    Format the response as a JSON object:
    {
      "category": "Broad Subject Area",
      "topics": [
        {
          "title": "Topic Title",
          "resources": [
            { "title": "Resource Title", "url": "https://resource-url.com" }
          ]
        }
      ]
    }
    Provide ONLY the JSON object without any markdown formatting or extra text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check for safety blocks or empty responses
    if (!response.candidates || response.candidates.length === 0) {
      console.error("[GEMINI_AI_ERROR] No candidates returned. This might be due to safety filters or an invalid prompt.");
      return null;
    }

    const text = response.text();
    if (!text) {
      console.error("[GEMINI_AI_ERROR] Empty response text.");
      return null;
    }

    try {
      // Clean potential markdown formatting
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr) as LearningPathResult;
    } catch (parseError) {
      console.error("[GEMINI_PARSING_ERROR] Failed to parse AI response as JSON:", text);
      return null;
    }
  } catch (error: any) {
    // Handle API/SDK Errors
    if (error.status) {
      const status = error.status;
      const message = error.message || "Unknown error";
      
      if (status === 429 || status === 503) {
        console.error(`[GEMINI_API_ERROR] High demand or quota exceeded (${status}).`);
        throw new Error("HIGH_DEMAND");
      } else if (status === 404) {
        console.error(`[GEMINI_API_ERROR] Model not found (404).`);
      } else if (status === 401 || status === 403) {
        console.error(`[GEMINI_API_ERROR] Authentication failed (${status}). Check your API key.`);
      } else {
        console.error(`[GEMINI_API_ERROR] Request failed with status ${status}: ${message}`);
      }
    } else {
      const msg = (error.message || error).toString().toLowerCase();
      if (msg.includes("503") || msg.includes("429") || msg.includes("quota") || msg.includes("overloaded")) {
        console.error(`[GEMINI_API_ERROR] High demand inferred from error message.`);
        throw new Error("HIGH_DEMAND");
      }
      console.error("[GEMINI_UNKNOWN_ERROR] An unexpected error occurred:", error.message || error);
    }
    return null;
  }
}

export async function generateCategoryForTopic(topicTitle: string): Promise<string | null> {
  if (!API_KEY) {
    console.error("Gemini API Key is missing");
    return null;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    I am creating a note with the topic title: "${topicTitle}".
    What is the most accurate broad category for this topic? (e.g. Programming, Mathematics, Business, Design, Health, Productivity, History).
    Format the response strictly as a JSON object:
    {
      "category": "Broad Category string here"
    }
    Provide ONLY the JSON object without any markdown formatting or extra text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response.candidates || response.candidates.length === 0) return null;

    const text = response.text();
    if (!text) return null;

    try {
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonStr) as { category: string };
      return parsed.category || "Uncategorized";
    } catch (parseError) {
      console.error("[GEMINI_PARSING_ERROR] Failed to parse AI category response:", text);
      return "Uncategorized";
    }
  } catch (error: any) {
    const status = error.status;
    if (status === 429 || status === 503) {
      throw new Error("HIGH_DEMAND");
    }
    const msg = (error.message || error).toString().toLowerCase();
    if (msg.includes("503") || msg.includes("429") || msg.includes("quota") || msg.includes("overloaded")) {
      throw new Error("HIGH_DEMAND");
    }
    console.error("[GEMINI_UNKNOWN_ERROR] generateCategoryForTopic failed:", error.message || error);
    return "Uncategorized";
  }
}
