import { GoogleGenAI, Type } from "@google/genai";
import { Article, Newsletter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchHRArticles = async (): Promise<Article[]> => {
  const searchPrompt = `Find exactly 15 of the latest news and articles (last 30 days) regarding HR and corporate trends in KSA, UAE, Qatar, South Africa, and Egypt. 
  Focus on:
  - Talent trends and workforce shifts in the Middle East and Africa (MEA).
  - Recent moves at MBB (McKinsey, BCG, Bain) and Big 4 (Deloitte, PwC, EY, KPMG) in these regions.
  - New C-suite appointments and labor law changes in the GCC, South Africa, and Egypt.
  
  List details for 15 distinct articles including title, source, publication date, short summary, and URL.`;

  try {
    const searchResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: searchPrompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    const formatPrompt = `Based on these results:
    ${searchResponse.text}

    Extract 15 distinct articles into a JSON list.
    Schema: title, source, url, date, snippet, category (Talent Trend, Layoffs, C-Suite, Acquisition, Labor Law).
    Ensure the JSON is valid.`;

    const formatResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: formatPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              url: { type: Type.STRING },
              date: { type: Type.STRING },
              snippet: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Talent Trend', 'Layoffs', 'C-Suite', 'Acquisition', 'Labor Law'] }
            },
            required: ['title', 'source', 'url', 'date', 'snippet', 'category']
          }
        }
      }
    });

    const articles = JSON.parse(formatResponse.text || '[]');
    return articles.map((a: any, index: number) => ({
      ...a,
      id: `article-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("Search failed:", e);
    throw new Error("Intelligence gathering failed. Check connection.");
  }
};

export const generateNewsletterContent = async (selectedArticles: Article[]): Promise<Newsletter> => {
  const context = selectedArticles.map(a => `Title: ${a.title}\nSource: ${a.source}\nSnippet: ${a.snippet}\nLink: ${a.url}`).join("\n\n---\n\n");

  const prompt = `As a Senior HR Lead at Accenture MEA (Middle East & Africa), synthesize these ${selectedArticles.length} articles into a professional newsletter.
  
  Articles:
  ${context}
  
  STRICT REQUIREMENTS:
  1. Newsletter Title: Must be exactly "MEA Talent Intelligence".
  2. For EACH Article in the output:
     - Title: Use the article headline.
     - Synopsis: Exactly 3 to 4 lines summarizing the core event.
     - Strategic Insights for Accenture: Exactly 3 lines (or 3 bullet points) describing the specific impact or action required for Accenture in the MEA region (KSA, UAE, Qatar, South Africa, Egypt).
  3. GeneratedDate: Must be exactly the current month and year (e.g., "January 2026").

  Structure the newsletter with a Title, Executive Intro, logical Sections grouping these articles, and a Conclusion.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING },
                  articles: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        source: { type: Type.STRING },
                        synopsis: { type: Type.STRING, description: "3-4 lines summary" },
                        strategicInsights: { type: Type.STRING, description: "Exactly 3 lines of insight for Accenture" }
                      },
                      required: ['title', 'url', 'source', 'synopsis', 'strategicInsights']
                    }
                  }
                },
                required: ['heading', 'content', 'articles']
              }
            },
            conclusion: { type: Type.STRING },
            generatedDate: { type: Type.STRING }
          },
          required: ['title', 'intro', 'sections', 'conclusion', 'generatedDate']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Synthesis failed:", e);
    throw new Error("AI Synthesis failed. Please try again.");
  }
};