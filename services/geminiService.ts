
import { GoogleGenAI, Type } from "@google/genai";
import { META_TITLE_MAX_LENGTH, META_DESCRIPTION_MAX_LENGTH } from '../constants';
import { Suggestions } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMetaSuggestions = async (title: string, description: string): Promise<Suggestions> => {
    const prompt = `
        Analyze the following meta title and meta description for SEO best practices, focusing on length and engagement.
        Current Meta Title: "${title}" (Length: ${title.length})
        Current Meta Description: "${description}" (Length: ${description.length})

        The optimal meta title length is under ${META_TITLE_MAX_LENGTH} characters.
        The optimal meta description length is under ${META_DESCRIPTION_MAX_LENGTH} characters.

        Based on this, please provide:
        1. A brief analysis of the current title and description, highlighting what's good and what could be improved.
        2. An optimized meta title that is concise, engaging, and within the character limit.
        3. An optimized meta description that is compelling, informative, and within the character limit.

        Return the response as a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.STRING,
                            description: "Brief analysis of the provided meta title and description."
                        },
                        optimizedTitle: {
                            type: Type.STRING,
                            description: `An optimized meta title under ${META_TITLE_MAX_LENGTH} characters.`
                        },
                        optimizedDescription: {
                            type: Type.STRING,
                            description: `An optimized meta description under ${META_DESCRIPTION_MAX_LENGTH} characters.`
                        }
                    },
                    required: ["analysis", "optimizedTitle", "optimizedDescription"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const suggestions: Suggestions = JSON.parse(jsonText);
        
        return suggestions;

    } catch (error) {
        console.error("Error fetching suggestions from Gemini API:", error);
        throw new Error("Failed to generate suggestions. Please check the console for more details.");
    }
};
