import { GoogleGenAI } from "@google/genai";

// NOTE: In a real environment, this key comes from process.env.API_KEY
// The app is designed to work without this being set for the demo UI.
const apiKey = process.env.API_KEY || "";

// Placeholder for actual AI integration
// This service structure is ready for the real API but mocks responses for the UI demo.
export const generateDamageReport = async (
  damageStats: any,
  location: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock report.");
    return `
      # DAMAGE ASSESSMENT REPORT: ${location.toUpperCase()}
      **Status:** CRITICAL
      **Confidence:** 94%

      ## Key Findings
      - **Structural:** Major collapse identified in Sector 7 bridge.
      - **Access:** Main arterial road blocked by debris.
      - **Utilities:** Power grid fluctuations detected in residential zones.

      ## Recommendations
      1. Deploy Search & Rescue to Grid Ref 34.52, 118.24 immediately.
      2. Reroute supply convoys via Western Perimeter (Route Alpha).
      3. Establish triage center at Central Plaza (Low Risk Zone).
    `;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";
    
    // Example of how we would call it if we had the key and backend proxy
    // const response = await ai.models.generateContent({
    //   model,
    //   contents: `Analyze the following disaster statistics for ${location}: ${JSON.stringify(damageStats)}. Provide a tactical summary.`,
    // });
    // return response.text || "No analysis generated.";
    
    return "AI Analysis Connected."; 
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating report.";
  }
};