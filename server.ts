import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyAvailable = !!apiKey && apiKey !== "undefined";
  const ai = isKeyAvailable ? new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Real server-side chat endpoint using Gemini 3.5 Flash
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, prompt, systemInstruction } = req.body;
      
      if (!isKeyAvailable || !ai) {
        // Safe fallback for demo mode
        console.warn("GEMINI_API_KEY is not available on the server. Returning clinical mock response.");
        return res.json({ 
          text: `[PREVIEW MODE] Aegis clinical AI link active.\n\nYour query was: "${prompt}"\n\nOperational feedback: All clinical departments, emergency streams, and pharmacy stocks are running efficiently. I can assist you with optimizing the birthday list or processing medication invoices.`
        });
      }

      // Base format
      const contents = [];
      if (messages && Array.isArray(messages)) {
        for (const msg of messages) {
          const role = (msg.role === 'assistant' || msg.role === 'model' || msg.role === 'ai') ? 'model' : 'user';
          contents.push({
            role,
            parts: [{ text: msg.content || msg.text || "" }]
          });
        }
      }

      // Add actual prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemInstruction || "You are Aegis Medical AI, the core operational intelligence of AV CARE Clinical OS."
        }
      });

      const text = response.text || "No response text was generated.";
      res.json({ text });

    } catch (error: any) {
      console.error("Gemini API error during /api/chat invocation:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start full-stack server:", err);
});
