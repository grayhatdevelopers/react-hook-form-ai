import type {
  AIResponse,
  OpenAIProviderConfig,
  CustomProviderConfig,
} from './types/ai';

type AutofillData = Record<string, string>;

// Chrome Built-in AI types
declare global {
  interface LanguageModelConstructor {
    availability(): Promise<'readily' | 'downloadable' | 'downloading' | 'unavailable'>;
    create(options?: {
      temperature?: number;
      topK?: number;
      signal?: AbortSignal;
      monitor?: (monitor: DownloadMonitor) => void;
      initialPrompts?: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }>;
    }): Promise<LanguageModelSession>;
  }

  interface DownloadMonitor {
    addEventListener(
      type: 'downloadprogress',
      listener: (event: { loaded: number }) => void
    ): void;
  }

  interface LanguageModelSession {
    prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
    destroy(): void;
  }
}

interface AIProviderExecutor {
  suggestValue(
    fieldName: string,
    currentValue: string,
    formContext: Record<string, any>
  ): Promise<AIResponse | null>;

  autofill(
    fields: string[],
    formContext: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<AutofillData | null>;

  checkAvailability(): Promise<{
    available: boolean;
    status: string;
    needsDownload: boolean;
  }>;
}

/**
 * Chrome Built-in AI Provider
 */
class ChromeAIProvider implements AIProviderExecutor {
  async checkAvailability() {
    if (typeof window === 'undefined' || typeof (window as any).LanguageModel === 'undefined') {
      return { available: false, status: 'unavailable', needsDownload: false };
    }

    try {
      const availability = await (window as any).LanguageModel.availability();
      return {
        available: availability !== 'unavailable',
        status: availability,
        needsDownload: availability === 'downloadable',
      };
    } catch {
      return { available: false, status: 'error', needsDownload: false };
    }
  }

  async suggestValue(
    fieldName: string,
    currentValue: string,
    formContext: Record<string, any>
  ): Promise<AIResponse | null> {
    try {
      const prompt = `You are assisting with form completion. The user is filling out a field named "${fieldName}".

Current value: "${currentValue}"
Form context: ${JSON.stringify(formContext, null, 2)}

Based on the field name, current value, and form context, suggest an improved, corrected, or realistic completion for this field.

Rules:
- Respond with ONLY the suggested value
- No explanations or additional text
- If the current value is already good, return it as-is
- Make sure the suggestion is appropriate for the field name

Suggested value:`;

      const session = await (window as any).LanguageModel.create();
      const result = await session.prompt(prompt);
      session.destroy();

      const cleaned = result.trim().replace(/^["']|["']$/g, '');
      return { suggestion: cleaned, provider: 'chrome-ai' }; // Updated provider key
    } catch (err) {
      console.error('Chrome AI error:', err);
      return null;
    }
  }

  async autofill(
    fields: string[],
    formContext: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<AutofillData | null> {
    try {
      const prompt = `You are an intelligent form assistant. Generate realistic example values for a form.

Form fields: ${fields.join(', ')}
Context: ${JSON.stringify(formContext, null, 2)}

Generate realistic, appropriate values for each field based on the field names and context.
Output ONLY a valid JSON object with these exact field names as keys.

Example format:
{"name": "Alice Johnson", "email": "alice@example.com", "age": "29"}

JSON object:`;

      const session = await (window as any).LanguageModel.create({
        monitor(m: any) {
          m.addEventListener('downloadprogress', (e: { loaded: number }) => {
            onProgress?.(e.loaded * 100);
          });
        },
      });

      const result = await session.prompt(prompt);
      session.destroy();

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (err) {
      console.error('Chrome AI autofill error:', err);
      return null;
    }
  }
}

/**
 * OpenAI Provider
 */
class OpenAIProvider implements AIProviderExecutor {
  constructor(private config: OpenAIProviderConfig) {}

  async checkAvailability() {
    return {
      available: !!this.config.apiKey,
      status: this.config.apiKey ? 'ready' : 'missing-api-key',
      needsDownload: false,
    };
  }

  async suggestValue(
    fieldName: string,
    currentValue: string,
    formContext: Record<string, any>
  ): Promise<AIResponse | null> {
    try {
      const apiUrl = this.config.apiUrl || 'https://api.openai.com/v1/chat/completions';
      const model = this.config.model || 'gpt-3.5-turbo';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          ...(this.config.organization && { 'OpenAI-Organization': this.config.organization }),
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a form completion assistant. Provide only the suggested value, no explanations.',
            },
            {
              role: 'user',
              content: `Field: ${fieldName}\nCurrent value: ${currentValue}\nContext: ${JSON.stringify(formContext)}\n\nSuggest an improved value:`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const suggestion = data.choices?.[0]?.message?.content?.trim();

      return suggestion ? { suggestion, provider: 'openai' } : null;
    } catch (err) {
      console.error('OpenAI error:', err);
      return null;
    }
  }

  async autofill(
    fields: string[],
    formContext: Record<string, any>
  ): Promise<AutofillData | null> {
    try {
      const apiUrl = this.config.apiUrl || 'https://api.openai.com/v1/chat/completions';
      const model = this.config.model || 'gpt-3.5-turbo';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          ...(this.config.organization && { 'OpenAI-Organization': this.config.organization }),
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a form autofill assistant. Return only valid JSON with field values.',
            },
            {
              role: 'user',
              content: `Generate realistic values for these form fields: ${fields.join(', ')}\nContext: ${JSON.stringify(formContext)}\n\nReturn JSON only:`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      return null;
    } catch (err) {
      console.error('OpenAI autofill error:', err);
      return null;
    }
  }
}

/**
 * Custom Provider
 */
class CustomProvider implements AIProviderExecutor {
  constructor(private config: CustomProviderConfig) {}

  async checkAvailability() {
    const available = typeof this.config.onCall === 'function';
    return {
      available,
      status: available ? 'ready' : 'missing-oncall-function',
      needsDownload: false,
    };
  }

  async suggestValue(
    fieldName: string,
    currentValue: string,
    formContext: Record<string, any>
  ): Promise<AIResponse | null> {
    if (!this.config.onCall) return null;
    try {
      const result = await this.config.onCall({
        operation: 'suggest',
        fieldName,
        currentValue,
        formContext,
      });
      if (typeof result === 'string') {
        return { suggestion: result, provider: 'custom' };
      }
      console.error('Custom provider onCall for "suggest" must return a string.');
      return null;
    } catch (err) {
      console.error('Custom AI provider error (suggestValue):', err);
      return null;
    }
  }

  async autofill(
    fields: string[],
    formContext: Record<string, any>
  ): Promise<AutofillData | null> {
    if (!this.config.onCall) return null;
    try {
      const result = await this.config.onCall({
        operation: 'autofill',
        fields,
        formContext,
      });
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return result as AutofillData;
      }
      console.error('Custom provider onCall for "autofill" must return an object.');
      return null;
    } catch (err) {
      console.error('Custom AI provider error (autofill):', err);
      return null;
    }
  }
}