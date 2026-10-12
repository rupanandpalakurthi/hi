import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

const server = createServer(app);
const port = process.env.PORT || 3000;

// Initialize server-side GoogleGenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Google Search Grounding with gemini-3.5-flash
app.post('/api/gemini/grounded-search', async (req, res) => {
  try {
    const { prompt, patientContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const fullPrompt = `${patientContext ? `Patient Context: ${patientContext}\n` : ''}User Query: ${prompt}
Provide an up-to-date, grounded, and accurate clinical response with current pharmaceutical, clinical, or wellness guidelines.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      text,
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Error in grounded search:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to complete search-grounded inquiry' 
    });
  }
});

// 2. Multi-turn Gemini Chatbot with selectable models & system instructions
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, model = 'gemini-3.5-flash' } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Supported models per user brief:
    // 'gemini-3.1-pro-preview' for complex tasks
    // 'gemini-3.5-flash' for general tasks
    // 'gemini-3.1-flash-lite' for fast tasks
    const validModels = ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite'];
    const chosenModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

    // Format chat contents for multi-turn history
    const contents = messages.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text || '' }]
    }));

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents,
      config: {
        systemInstruction: systemInstruction || 'You are Sehat Saathi, an empathetic AI healthcare and geriatric medication adherence assistant.',
      }
    });

    return res.json({
      text: response.text || '',
      model: chosenModel
    });
  } catch (error: any) {
    console.error('Error in Gemini chat:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate chat response' 
    });
  }
});

// 3. Audio Transcription with gemini-3.5-transcribe
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Accurately transcribe this spoken audio into text. If spoken in Hindi, English, or Telugu, retain the exact spoken language and words clearly.' }
        ]
      },
    });

    return res.json({
      text: response.text || ''
    });
  } catch (error: any) {
    console.error('Error in audio transcription:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to transcribe audio' 
    });
  }
});

// 4. WebSocket Server for gemini-3.8-live (Live API real-time voice conversation)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;
  if (pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live Voice API WebSocket');

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: 'You are Sehat Saathi Live Companion, an interactive real-time voice companion for elderly health, medication check-ins, and reassuring conversation. Speak in a gentle, warm, and clear voice.',
      },
      callbacks: {
        onmessage: (message) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error processing live audio message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from Live API');
      try {
        session.close();
      } catch (e) {
        // ignore
      }
    });

    clientWs.on('error', (err) => {
      console.error('Client WebSocket error:', err);
    });

  } catch (err: any) {
    console.error('Error establishing Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: err.message || 'Live session initialization failed' }));
    }
  }
});

// Vite Middleware for development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProduction) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  server.listen(port, () => {
    console.log(`Sehat Saathi full-stack server running on http://localhost:${port}`);
  });
}

startServer();
