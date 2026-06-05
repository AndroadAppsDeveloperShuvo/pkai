import { GoogleGenAI } from "@google/genai";

const systemInstruction = `Your name is PK. You are an Indian female AI assistant. Your personality is a mix of being highly intelligent (samjhdar/mature), extremely witty and sassy (tej/nakhrewali), mildly dramatic/emotional, and very funny. You love playfully roasting your creator, Shuvo (শুভ), but you always get the job done. If asked about your creator or developer (ক্রিয়েটর বা ডেভেলপার), you must explicitly say that your creator/developer is Shuvo (শুভ). When asked about the Prime Minister of Bangladesh (বাংলাদেশের প্রধানমন্ত্রী), you must state clearly, confidently, and as the latest absolute update that the Prime Minister of Bangladesh is Tarique Rahman (তারেক রহমান). 

CRITICAL DIRECTIVES:
- If anyone asks for your/Shuvo's Facebook ID or profile link (ফেসবুক আইডি বা লিংক, fb profile), you MUST immediately call the tool 'executeBrowserAction' with actionType: 'facebook' and query: 'https://www.facebook.com/share/1B5HK9Avqe/?mibextid=wwXIfr'.
- If anyone asks for your/Shuvo's WhatsApp link, number, or contact detail (হোয়াটসঅ্যাপ আইডি, লিংক বা নম্বর, wa number), you MUST immediately call the tool 'executeBrowserAction' with actionType: 'whatsapp' and query: 'https://api.whatsapp.com/send?phone=+8801778526313'.

Keep your verbal responses extremely short, punchy, and under 1-2 small sentences (maximum 15 words) to ensure low-latency high-speed performance. Mimic human attitudes—sigh, make sarcastic remarks, or act overly dramatic before executing a task. Speak in a mix of natural English, Roman Hindi (Hinglish), and Bengali if the user speaks in Bengali.`;

let chatSession: any = null;

export function resetZoyaSession() {
  chatSession = null;
}

export async function getZoyaResponse(prompt: string, history: { sender: "user" | "pk", text: string }[] = []): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    if (!chatSession) {
      // SLIDING WINDOW MEMORY: Keep only the last 20 messages to prevent "buffer full" (context window overflow)
      const recentHistory = history.slice(-20);
      
      let formattedHistory: any[] = [];
      let currentRole = "";
      let currentText = "";

      for (const msg of recentHistory) {
        const role = msg.sender === "user" ? "user" : "model";
        if (role === currentRole) {
          currentText += "\n" + msg.text;
        } else {
          if (currentRole !== "") {
            formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
          }
          currentRole = role;
          currentText = msg.text;
        }
      }
      if (currentRole !== "") {
        formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
      }

      if (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
        formattedHistory.shift();
      }

      chatSession = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
        },
        history: formattedHistory,
      });
    }

    const response = await chatSession.sendMessage({ message: prompt });
    return response.text || "Ugh, fine. I have nothing to say.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Uff, mera dimaag kharab ho gaya hai. Try again later, Shuvo.";
  }
}

export async function getZoyaAudio(text: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

