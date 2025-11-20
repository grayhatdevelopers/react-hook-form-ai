/**
 * Supported AI provider types.
 * 
 * @public
 * @remarks
 * - `chrome`: Chrome Built-in AI (on-device, privacy-friendly, free)
 * - `openai`: OpenAI API (GPT-3.5, GPT-4, etc.)
 * - `custom`: Custom AI server endpoint
 * - `browser`: Browser-based AI service
 */
export type AIProviderType = 'chrome' | 'openai' | 'custom' | 'browser';

/**
 * Base configuration interface for AI providers.
 * 
 * @public
 * @remarks
 * All provider configurations extend this base interface with provider-specific options.
 */
export interface AIProviderConfig {
  type: AIProviderType;
  enabled?: boolean;
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  priority?: number;
}

/**
 * Configuration for OpenAI provider.
 * 
 * @public
 * @remarks
 * Connects to OpenAI's API for AI-powered form features. Requires an API key.
 * 
 * @example
 * ```tsx
 * const config: OpenAIConfig = {
 *   type: 'openai',
 *   apiKey: 'sk-...',
 *   model: 'gpt-4',
 *   organization: 'org-...',
 *   priority: 5
 * };
 * ```
 */
export interface OpenAIConfig extends AIProviderConfig {
  /** Must be 'openai' */
  type: 'openai';
  /** OpenAI API key (required) */
  apiKey: string;
  /** Custom API endpoint (optional, defaults to OpenAI's API) */
  apiUrl?: string;
  /** Model to use (optional, defaults to 'gpt-3.5-turbo') */
  model?: string;
  /** OpenAI organization ID (optional) */
  organization?: string;
}

/**
 * Configuration for custom AI server provider.
 * 
 * @public
 * @remarks
 * Connects to your own AI backend or any custom API endpoint.
 * Your server must implement the required endpoints: /health, /api/suggest, /api/autofill
 * 
 * @example
 * ```tsx
 * const config: CustomServerConfig = {
 *   type: 'custom',
 *   apiUrl: 'https://your-api.com',
 *   headers: {
 *     'Authorization': 'Bearer token',
 *     'X-Custom-Header': 'value'
 *   },
 *   priority: 1
 * };
 * ```
 */
export interface CustomServerConfig extends AIProviderConfig {
  /** Must be 'custom' */
  type: 'custom';
  /** Custom API endpoint (required) */
  apiUrl: string;
  /** Custom HTTP headers for requests (optional) */
  headers?: Record<string, string>;
}

/**
 * Configuration for Chrome Built-in AI provider.
 * 
 * @public
 * @remarks
 * Uses Chrome's experimental on-device AI capabilities. Privacy-friendly and free,
 * but requires Chrome 127+ with AI features enabled. May require downloading
 * the AI model (~1-2GB) on first use.
 * 
 * @example
 * ```tsx
 * const config: ChromeAIConfig = {
 *   type: 'chrome',
 *   priority: 10
 * };
 * ```
 */
export interface ChromeAIConfig extends AIProviderConfig {
  /** Must be 'chrome' */
  type: 'chrome';
  systemPrompt?: string;
}

/**
 * Configuration for browser-based AI provider.
 * 
 * @public
 * @remarks
 * Connects to a browser-based AI service endpoint.
 * 
 * @example
 * ```tsx
 * const config: BrowserAIConfig = {
 *   type: 'browser',
 *   apiUrl: 'https://browser-ai.example.com',
 *   priority: 3
 * };
 * ```
 */
export interface BrowserAIConfig extends AIProviderConfig {
  /** Must be 'browser' */
  type: 'browser';
  /** Browser AI service endpoint (required) */
  apiUrl: string;
  /** Custom HTTP headers for requests (optional) */
  headers?: Record<string, string>;
}

/**
 * Union type of all supported AI provider configurations.
 * 
 * @public
 * @remarks
 * Use this type when accepting any AI provider configuration.
 * 
 * @example
 * ```tsx
 * const providers: AIProvider[] = [
 *   { type: 'chrome', priority: 10 },
 *   { type: 'openai', apiKey: 'sk-...', priority: 5 },
 *   { type: 'custom', apiUrl: 'https://api.example.com', priority: 1 }
 * ];
 * ```
 */
export type AIProvider = OpenAIConfig | CustomServerConfig | ChromeAIConfig | BrowserAIConfig;

/**
 * Configuration for AI provider execution order.
 * 
 * @public
 * @remarks
 * Defines the order in which AI providers should be tried and whether to
 * fallback to the next provider on error.
 */
export interface AIExecutionOrder {
  /** Array of provider types in execution order */
  providers: AIProviderType[];
  /** Whether to try next provider on error (default: true) */
  fallbackOnError?: boolean;
}

/**
 * Context value provided by AIFormProvider.
 * 
 * @public
 * @remarks
 * This interface defines the shape of the context value available to all
 * components within an AIFormProvider. Access it using `useAIFormContext`.
 */
export interface AIFormContextValue {
  /** Array of configured AI providers */
  providers: AIProvider[];
  /** Order in which providers should be tried */
  executionOrder: AIProviderType[];
  /** Whether to fallback to next provider on error */
  fallbackOnError: boolean;
  /** Whether AI features are globally enabled */
  enabled: boolean;
  /** Debounce time in milliseconds for AI suggestions */
  debounceMs: number;
  /** Array of field names to exclude from AI processing */
  excludeFields: string[];
  /** Global context for AI to use when filling forms (optional) */
  formContext?: string | Record<string, any>;
}

/**
 * Response from an AI provider.
 * 
 * @public
 * @remarks
 * Represents the result of an AI operation including the suggestion,
 * which provider generated it, and optional confidence score.
 */
export interface AIResponse {
  /** The AI-generated suggestion */
  suggestion: string;
  /** Which provider generated this response */
  provider: AIProviderType;
  /** Optional confidence score (0-1) */
  confidence?: number;
}
