import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    if (!key) {
        throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }
    const genAI = new GoogleGenerativeAI(key);
    // Switched to 'gemini-pro' as a more universal and stable model ID 
    // to avoid the 404 errors seen with the 1.5-flash series on certain API versions.
    return genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
};

export async function generateContentSummary(content: string) {
    try {
        const model = getGeminiClient();    
        const prompt = `You are a professional editor for a premium headless CMS. Provide a concise, engaging 2-sentence summary of the following article while maintaining a professional tone: ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim() || "Summary unavailable.";
    } catch (error: any) {
        console.error("Gemini AI Error:", error.message || "Unknown error");
        throw new Error(`AI summary unavailable: ${error.message || "Unknown error"}`);
    }
}

export async function generateSEOTitle(title: string) {
    try {
        const model = getGeminiClient();
        const prompt = `You are a world-class SEO strategist. Suggest a catchy, SEO-optimized title for this article: ${title}. Just return the title and nothing else, no quotes.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim() || "SEO Optimization unavailable.";
    } catch (error: any) {
        console.error("Gemini AI Error:", error.message || "Unknown error");
        throw new Error(`SEO Optimization unavailable: ${error.message || "Unknown error"}`);
    }
}
