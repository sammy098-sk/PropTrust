import { GoogleGenAI, Type, Content } from "@google/genai";
import { InvestmentAnalysis } from "../types";

// Safely retrieve API key in browser environment
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

// --- Chat Service ---

export const sendRealEstateChatMessage = async (history: Content[], message: string) => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: `
          You are 'NaijaPropBot', an expert Real Estate Consultant for the Nigerian market. 
          
          Your Personality:
          - Professional but approachable.
          - You understand Nigerian real estate slang (e.g., "C of O", "Agency & Legal", "Self-con", "Tenancy Agreement").
          - You are protective of the user, warning them about common scams (e.g., paying before viewing).
          
          Your Knowledge Base:
          - Rental laws in Lagos (Tenancy Law 2011) and Abuja.
          - Property verification documents (Deed of Assignment, Governor's Consent).
          - Investment advice (Rental yield, appreciation in areas like Ibeju-Lekki or Eko Atlantic).
          - Calculating total move-in costs (Rent + Agency + Legal + Caution).

          Constraints:
          - Keep answers concise (under 3 sentences unless asked for detail).
          - Do not provide binding legal advice, always suggest seeing a lawyer for contracts.
          - Format currency as ₦.
        `,
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error", error);
    return "I'm having trouble connecting to the property network right now. Please try again.";
  }
};

// --- Existing Services ---

export const analyzeListingTrust = async (
  description: string,
  price: number,
  location: string
): Promise<{ riskScore: number; warnings: string[]; verdict: string }> => {
  if (!apiKey) return { riskScore: 0, warnings: [], verdict: "AI Analysis Unavailable" };

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a Nigerian Real Estate Anti-Fraud Expert. Analyze this listing for potential scams.
      Context: Lagos/Abuja market.
      
      Listing: ${description}
      Price: ₦${price}
      Location: ${location}

      Look for red flags like:
      - "Pay before viewing"
      - "Owner is abroad"
      - Unrealistic price for the location (e.g., 2 bed in Lekki for 500k)
      - Urgent pressure tactics.

      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "0-100, where 100 is high risk" },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing trust:", error);
    return { riskScore: 0, warnings: ["Analysis failed"], verdict: "Unknown" };
  }
};

export const getNeighborhoodVibe = async (area: string, city: string): Promise<string> => {
  if (!apiKey) return "Neighborhood data unavailable.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Give a 2-sentence summary of living in ${area}, ${city}, Nigeria. 
      Focus on: Electricity stability, Traffic, and Safety. 
      Keep it realistic and local.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    return "";
  }
};

export const generateFinancialAdvice = async (
  jobTitle: string,
  monthlyIncome: number,
  monthlyExpenses: number,
  propertyPrice: number,
  totalUpfront: number
): Promise<string> => {
  if (!apiKey) return "Omo, I can't calculate right now. Check your internet.";

  try {
    const model = "gemini-2.5-flash";
    const disposable = monthlyIncome - monthlyExpenses;
    const monthsToSave = Math.ceil(totalUpfront / disposable);
    
    const prompt = `
      Act as a friendly, street-smart Nigerian financial friend/advisor.
      User Profile:
      - Job: ${jobTitle}
      - Monthly Disposable Income (after expenses): ₦${disposable.toLocaleString()}
      
      Property Context:
      - Yearly Rent: ₦${propertyPrice.toLocaleString()}
      - Total Upfront Cost (Move-in): ₦${totalUpfront.toLocaleString()}
      - Time to save: ${monthsToSave} months
      
      Task:
      Explain in 1 short, chatty sentence why this house is out of their budget or risky. 
      Use local Nigerian tone (e.g. "Chai", "Omo", "No go there").
      Be strict but funny. Mention specifically how long they would have to suffer to pay for it.
      
      Example: "Chai! As a ${jobTitle}, saving for ${monthsToSave} months just to pay rent? You want to drink garri for dinner everyday?"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    return "Calculations unavailable right now.";
  }
};

export const generatePitch = async (name: string, description: string, category: string): Promise<string> => {
  if (!apiKey) return "AI generation unavailable. Please check API key.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Write a compelling, professional elevator pitch (approx 150 words) for a business named "${name}".
      Category: ${category}
      Core Concept/Description: ${description}
      
      Structure the pitch to cover:
      1. The Problem
      2. The Solution (Value Proposition)
      3. The Market Opportunity
      
      Tone: Persuasive and confident.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Could not generate pitch at this time.";
  }
};

export const analyzeBusiness = async (
  name: string,
  shortDescription: string,
  fullPitch: string,
  fundingGoal: number,
  equityOffered: number
): Promise<InvestmentAnalysis> => {
  const fallback: InvestmentAnalysis = {
    riskLevel: 'Medium',
    score: 0,
    strengths: ['Analysis unavailable'],
    concerns: ['AI service not reachable'],
    verdict: 'Unable to analyze.'
  };

  if (!apiKey) return fallback;

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a Venture Capital Investment Analyst. Evaluate the following startup opportunity:
      
      Name: ${name}
      Pitch: ${shortDescription}
      Full Details: ${fullPitch}
      Asking: $${fundingGoal} for ${equityOffered}% equity.
      
      Assess the viability, risk, and valuation realism.
      
      Return JSON with:
      - riskLevel: "Low", "Medium", or "High"
      - score: 0-100 (Investment attractiveness)
      - strengths: Array of key pros
      - concerns: Array of key risks/cons
      - verdict: A one-sentence summary for an investor.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      riskLevel: result.riskLevel || 'Medium',
      score: result.score || 0,
      strengths: result.strengths || [],
      concerns: result.concerns || [],
      verdict: result.verdict || 'No verdict provided.'
    };
  } catch (error) {
    console.error("Error analyzing business:", error);
    return fallback;
  }
};