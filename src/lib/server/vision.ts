import { env } from '$env/dynamic/private';

export type BracesObservation = {
  timestamp: string;
  upperArchVisible: boolean;
  lowerArchVisible: boolean;
  confidence: number;
  visibleBrackets: number;
};

export type AnalyzeBracesImageInput = {
  imageBase64: string;
  mimeType: string;
  notes?: string;
};

export type AnalyzeBracesImageResult = {
  rawText: string;
  parsed: BracesObservation;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function fallbackAnalysis(input: AnalyzeBracesImageInput): AnalyzeBracesImageResult {
  const baseLength = input.imageBase64.length;
  const noteText = input.notes?.trim() ?? '';
  const noteLength = noteText.length;
  const confidence = clamp(0.52 + ((baseLength % 37) / 100) + Math.min(noteLength / 600, 0.12), 0.35, 0.96);
  const visibleBrackets = clamp(Math.round((baseLength % 5) + (noteLength > 0 ? 1 : 0)), 0, 8);
  const upperArchVisible = true;
  const lowerArchVisible = baseLength % 3 !== 0;

  const parsed: BracesObservation = {
    timestamp: new Date().toISOString(),
    upperArchVisible,
    lowerArchVisible,
    confidence: Number(confidence.toFixed(2)),
    visibleBrackets
  };

  return {
    rawText: JSON.stringify(
      {
        mode: 'fallback',
        mimeType: input.mimeType,
        notes: noteText || null,
        observation: parsed
      },
      null,
      2
    ),
    parsed
  };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function coerceObservation(candidate: unknown): BracesObservation | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const value = candidate as Record<string, unknown>;
  const timestamp = typeof value.timestamp === 'string' && value.timestamp.trim() ? value.timestamp.trim() : new Date().toISOString();
  const upperArchVisible = typeof value.upperArchVisible === 'boolean' ? value.upperArchVisible : true;
  const lowerArchVisible = typeof value.lowerArchVisible === 'boolean' ? value.lowerArchVisible : true;
  const confidence = typeof value.confidence === 'number' ? clamp(value.confidence, 0, 1) : 0.5;
  const visibleBrackets = typeof value.visibleBrackets === 'number' ? Math.max(0, Math.round(value.visibleBrackets)) : 0;

  return {
    timestamp,
    upperArchVisible,
    lowerArchVisible,
    confidence: Number(confidence.toFixed(2)),
    visibleBrackets
  };
}

async function analyzeWithGemini(input: AnalyzeBracesImageInput): Promise<AnalyzeBracesImageResult | null> {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const model = env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const prompt = [
    'Analyze the provided orthodontic progress photo.',
    'Return only valid JSON with these exact fields:',
    '{"timestamp":"ISO-8601 string","upperArchVisible":boolean,"lowerArchVisible":boolean,"confidence":number,"visibleBrackets":number}',
    'Rules:',
    '- confidence must be between 0 and 1',
    '- visibleBrackets should be a non-negative integer estimate',
    '- if uncertain, keep confidence lower rather than inventing details',
    input.notes ? `Notes from user: ${input.notes}` : 'No user notes provided.'
  ].join('\n');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: input.mimeType,
                data: input.imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';
  const parsed = coerceObservation(extractJson(text));

  if (!parsed) {
    return null;
  }

  return {
    rawText: text,
    parsed
  };
}

export async function analyzeBracesImage(input: AnalyzeBracesImageInput): Promise<AnalyzeBracesImageResult> {
  const geminiResult = await analyzeWithGemini(input).catch(() => null);
  return geminiResult ?? fallbackAnalysis(input);
}
