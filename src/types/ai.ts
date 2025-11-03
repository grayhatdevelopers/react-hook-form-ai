/**
 * AI Provider Types
 */

// Renamed 'chrome' to 'chrome-ai' for clarity and consistency.
export type AIProviderType = 'chrome-ai' | 'openai' | 'custom' | 'browser';

// --- Individual Provider Configuration Interfaces ---
// These define the specific configurable options for each provider type.

export interface OpenAIConfig {
  apiKey: string;
  // Added optional 'apiUrl' for custom OpenAI-compatible endpoints.
  apiUrl?: string;
  model?: string;
  organization?: string;
}

export interface CustomProviderConfig {
  apiUrl?: string;
  headers?: Record<string, string>;
  model?: string;
  // Added hooks for custom client-side or server-side logic.
  suggestValue?: (prompt: string, options?: any) => Promise<string>;
  autofill?: (
    schema: Record<string, any>,
    data: Record<string, any>,
    options?: any
  ) => Promise<Record<string, any>>;
}

// Configuration for the built-in Chrome AI. Intentionally empty as it has no user-configurable options.
export interface ChromeAIConfig {}

export interface BrowserAIConfig {
  apiUrl: string;
  headers?: Record<string, string>;
  model?: string;
}

// --- Comprehensive Union Type for AI Provider Configurations ---
// This is the new primary type for defining a provider and its configuration.

// Common metadata applicable to any provider instance.
interface AIProviderMetadata {
  enabled?: boolean;
  priority?: number;
}

// A discriminated union that represents a fully configured AI provider.
// This structure is cleaner and more type-safe than the previous inheritance model.
export type AIProviderOption = AIProviderMetadata &
  (
    | { type: 'openai'; config: OpenAIConfig }
    | { type: 'custom'; config: CustomProviderConfig }
    | { type: 'chrome-ai'; config: ChromeAIConfig }
    | { type: 'browser'; config: BrowserAIConfig }
  );

// --- Existing types adapted to use the new structure ---

export interface AIExecutionOrder {
  providers: AIProviderType[];
  fallbackOnError?: boolean;
}

export interface AIFormContextValue {
  // Updated to use the new comprehensive AIProviderOption type.
  providers: AIProviderOption[];
  executionOrder: AIProviderType[];
  fallbackOnError: boolean;
  enabled: boolean;
  debounceMs: number;
  excludeFields: string[];
}

export interface AIResponse {
  suggestion: string;
  provider: AIProviderType;
  confidence?: number;
}