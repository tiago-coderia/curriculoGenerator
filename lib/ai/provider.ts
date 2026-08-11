import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export interface AICompletionOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AICompletionOptions): Promise<string>;
  generateJSON<T>(prompt: string, options?: AICompletionOptions): Promise<T>;
}

export class AzureOpenAIProvider implements AIProvider {
  name = 'azure';
  private endpoint: string;
  private apiKey: string;

  constructor(apiKey?: string, endpoint?: string) {
    this.endpoint =
      endpoint ||
      process.env.AZURE_OPENAI_ENDPOINT ||
      'https://ineditta-agent-resource.cognitiveservices.azure.com/openai/deployments/gpt-5.2/chat/completions?api-version=2024-05-01-preview';
    this.apiKey = apiKey || process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY ou OPENAI_API_KEY não foi configurada no ambiente (.env).');
    }

    const messages = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: options?.temperature ?? 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Azure OpenAI Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async generateJSON<T>(prompt: string, options?: AICompletionOptions): Promise<T> {
    if (!this.apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY ou OPENAI_API_KEY não foi configurada no ambiente (.env).');
    }

    const messages = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: options?.temperature ?? 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Azure OpenAI Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (e) {
      console.error('Falha ao converter resposta da Azure OpenAI em JSON:', content, e);
      throw new Error('A resposta do provedor Azure OpenAI não é um JSON válido.');
    }
  }
}

export class GoogleProvider implements AIProvider {
  name = 'google';
  private client: GoogleGenerativeAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY não foi configurada no ambiente (.env).');
    }
    this.client = new GoogleGenerativeAI(key);
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: options?.systemPrompt,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async generateJSON<T>(prompt: string, options?: AICompletionOptions): Promise<T> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: options?.systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.error('Falha ao converter resposta da IA em JSON:', text, e);
      throw new Error('A resposta do provedor de IA não é um JSON válido.');
    }
  }
}

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY não foi configurada no ambiente (.env).');
    }
    this.client = new OpenAI({ apiKey: key });
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.2,
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateJSON<T>(prompt: string, options?: AICompletionOptions): Promise<T> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: 'json_object' },
      temperature: options?.temperature ?? 0.1,
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      return JSON.parse(content) as T;
    } catch (e) {
      console.error('Falha ao converter resposta da OpenAI em JSON:', content, e);
      throw new Error('A resposta do provedor OpenAI não é um JSON válido.');
    }
  }
}

export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'azure').toLowerCase();

  if (providerType === 'openai') {
    return new OpenAIProvider();
  } else if (providerType === 'google' || providerType === 'gemini') {
    return new GoogleProvider();
  } else {
    // Default to Azure OpenAI Foundry deployment (gpt-5.2)
    return new AzureOpenAIProvider();
  }
}
