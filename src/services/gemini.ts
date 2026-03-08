import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client lazily, return null if no valid key is set (to enable Mock mode)
const getGeminiClient = () => {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('Dummy')) {
    return null; // Trigger demo fallback
  }
  return new GoogleGenerativeAI(apiKey);
};

export const analyzeCropDisease = async (base64Image: string | null, description: string = ""): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    
    if (!genAI) {
      // Demo Mock Fallback
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `### MOCK AI DIAGNOSIS
**Note:** *This is a demonstration response because no valid Gemini API key was provided.*

* **Identified Field/Crop:** Likely a local staple crop based on regional data.
* **Detected Issue:** ${description ? 'Symptoms match: ' + description : 'Generic Leaf Blight / Fungal Infection'}.
* **Severity:** **Medium**

**Recommended Actions:**
*   **Action 1:** Apply localized Neem-based biopesticide immediately.
*   **Action 2:** Ensure proper drainage in the field to prevent moisture accumulation.
*   **Action 3:** Isolate affected plants if possible and monitor neighboring crops.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let prompt = `You are an expert plant pathologist and agronomist working for AgroSync, an Indian agritech platform.`;
    if (base64Image) prompt += `\nAnalyze this crop image.`;
    if (description) prompt += `\nThe farmer has provided this description of the symptoms: "${description}"`;
    prompt += `\nIdentify:
    1. The likely crop.
    2. Any visible diseases, pests, or nutrient deficiencies.
    3. The severity level (Low, Medium, High).
    4. Provide exactly 3 actionable, low-cost remedies or treatment steps using locally available Indian resources if possible.
    Format your response cleanly using markdown bullets. Be concise and authoritative but simple enough for a farmer to understand.`;

    const contentParts: any[] = [prompt];

    if (base64Image) {
      const mimeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      contentParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType
        }
      });
    }

    const result = await model.generateContent(contentParts);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    throw new Error(error.message || "Failed to analyze image with Gemini.");
  }
};

export const matchGovernmentSchemes = async (farmerProfile: any): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    if (!genAI) {
       await new Promise(resolve => setTimeout(resolve, 1500));
       return `### MOCK AI SCHEME MATCHES
**Note:** *Demo data due to missing API key.*

* **PM-Kisan Samman Nidhi**: ₹6,000 per year income support.
  * *Step 1*: Visit nearest CSC center with Aadhaar.
  * *Step 2*: Register on pmkisan.gov.in portal.
* **Soil Health Card Scheme**: Free soil testing.
  * *Step*: Contact local KVK or agriculture department for soil sample collection.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert in Indian Agricultural Government Schemes (both Central and State level).
    Based on the following farmer profile:
    State: ${farmerProfile.state || 'Maharashtra'}
    Land Size: ${farmerProfile.landSize || '2'} acres (Small/Marginal)
    Crop Focus: ${farmerProfile.cropFocus || 'Wheat, Soybean, Onion'}
    Gender: ${farmerProfile.gender || 'Male'}
    Category: ${farmerProfile.category || 'General'}
    
    Output the top 3 most relevant active government welfare schemes, subsidies, or direct benefit transfers (like PM-KISAN, crop insurance, etc) they are eligible for.
    For each scheme, provide:
    1. Scheme Name
    2. Exact Benefit amount/percentage
    3. Maximum 2 simple steps on how they can apply locally.
    Use clear markdown formatting. Be highly empathetic and encouraging.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Scheme Error:", error);
    throw new Error(error.message || "Failed to fetch AI scheme recommendations.");
  }
};

export const forecastMarketPrices = async (crop: string, currentMarketData: string): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    if (!genAI) {
       await new Promise(resolve => setTimeout(resolve, 1500));
       return `**Note: Demo AI Analysis (No API Key).**
       Based on simulated trends, ${crop} prices are fluctuating. A surge in local mandi arrivals is expected next week which may lower prices slightly. 
       **RECOMMENDATION: ${Math.random() > 0.5 ? 'HOLD' : 'SELL NOW'}**`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert agricultural economist advising an Indian farmer.
    Crop Focus: ${crop}
    Current Local Mandi Data Context: ${currentMarketData}
    
    Analyze the current market data context provided regarding ${crop}. Considering seasonal supply/demand trends in India, write a 3-sentence predictive analysis on whether the price will go up or down in the next 3 weeks.
    End with a clear, bold "RECOMMENDATION: HOLD" or "RECOMMENDATION: SELL NOW". Make it extremely easy to read.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Price Error:", error);
    throw new Error(error.message || "Failed to analyze price forecast.");
  }
};
