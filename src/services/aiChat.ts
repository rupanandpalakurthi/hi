export interface GroundedSearchResult {
  text: string;
  groundingChunks: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
}

export interface ChatMessageTurn {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

/**
 * Call Server-Side Search Grounding with gemini-3.5-flash
 */
export async function querySearchGroundedAI(
  prompt: string, 
  patientContext?: string
): Promise<GroundedSearchResult> {
  const response = await fetch('/api/gemini/grounded-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, patientContext }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to complete search-grounded inquiry');
  }

  return response.json();
}

/**
 * Call Server-Side Multi-turn Gemini Chat with selectable models
 */
export async function sendGeminiChatMessage(
  messages: ChatMessageTurn[],
  systemInstruction?: string,
  model: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite' = 'gemini-3.5-flash'
): Promise<{ text: string; model: string }> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemInstruction, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate chat response');
  }

  return response.json();
}

/**
 * Call Server-Side Audio Transcription with gemini-3.5-transcribe
 */
export async function transcribeAudioWithGemini(
  audioBase64: string,
  mimeType: string = 'audio/webm'
): Promise<string> {
  const response = await fetch('/api/gemini/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to transcribe audio');
  }

  const data = await response.json();
  return data.text || '';
}
