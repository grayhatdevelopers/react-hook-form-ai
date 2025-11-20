# API Reference

Complete API documentation for React Hook Form AI.

## Table of Contents

- [Hooks](#hooks)
  - [useForm](#useform)
  - [useAIAssistant](#useaiassistant)
  - [useAIFormContext](#useaiformcontext)
  - [useOptionalAIFormContext](#useoptionalaiformcontext)
- [Components](#components)
  - [AIFormProvider](#aiformprovider)
- [Interfaces](#interfaces)
  - [UseFormAIReturn](#useformaireturnt)
  - [AIFormOptions](#aiformoptions)
  - [AIFormProviderProps](#aiformproviderprops)
- [Types](#types)
  - [AIProviderType](#aiprovidertype)
  - [AIProvider](#aiprovider)
  - [OpenAIConfig](#openaiconfig)
  - [CustomServerConfig](#customserverconfig)
  - [ChromeAIConfig](#chromeaiconfig)
  - [BrowserAIConfig](#browseraiconfig)
  - [AIFormContextValue](#aiformcontextvalue)
  - [AIResponse](#airesponse)

---

## Hooks

### useForm

```typescript
function useForm<T extends FieldValues>(
  options?: UseFormProps<T> & { ai?: AIFormOptions }
): UseFormAIReturn<T>
```

Enhanced React Hook Form with AI-powered autofill and field suggestions.

**Type Parameters:**
- `T` - The form data type extending FieldValues

**Parameters:**
- `options` - Standard React Hook Form options plus optional AI configuration

**Returns:** Extended form object with AI capabilities

**Description:**

A drop-in replacement for React Hook Form's `useForm` hook that adds AI capabilities including autofill, field suggestions, and availability checking. Supports multiple AI providers (Chrome Built-in AI, OpenAI, Custom Server) with automatic fallback.

**Examples:**

Basic usage:
```tsx
const { register, handleSubmit, aiAutofill } = useForm<FormData>();

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('name')} />
    <button type="button" onClick={() => aiAutofill()}>
      AI Autofill
    </button>
  </form>
);
```

With AI configuration:
```tsx
const form = useForm<FormData>({
  ai: {
    enabled: true,
    debounceMs: 500,
    excludeFields: ['password'],
    providers: [
      { type: 'chrome', priority: 10 },
      { type: 'openai', apiKey: 'sk-...', priority: 5 }
    ]
  }
});
```

Handling Chrome AI download:
```tsx
const { aiAvailability, aiDownloadProgress, aiAutofill } = useForm<FormData>();

if (aiAvailability?.needsDownload) {
  return <button onClick={() => aiAutofill()}>Download AI Model</button>;
}

if (aiAvailability?.status === 'downloading') {
  return <progress value={aiDownloadProgress || 0} max={100} />;
}
```

---

### useAIAssistant

```typescript
function useAIAssistant(options?: AIAssistantOptions): {
  suggestValue: (name: string, value: string) => Promise<string | null>;
  autofill: (fields: string[], options?: { onDownloadProgress?: (progress: number) => void }) => Promise<AutofillData>;
  checkAvailability: () => Promise<{ available: boolean; status: string; needsDownload: boolean }>;
}
```

Low-level AI assistant hook for advanced use cases.

**Parameters:**
- `options` - Configuration options for the AI assistant
  - `enabled?: boolean` - Enable AI features (default: true)
  - `formContext?: Record<string, any>` - Current form values for context
  - `apiUrl?: string` - API endpoint for AI fallback
  - `providers?: AIProvider[]` - Override providers from AIFormProvider
  - `executionOrder?: AIProviderType[]` - Override execution order
  - `fallbackOnError?: boolean` - Override fallback behavior

**Returns:** Object with AI methods

**Description:**

This hook provides direct access to AI capabilities without form integration. It uses configured providers from AIFormProvider or accepts local overrides. Most users should use the `useForm` hook instead, which includes this functionality.

**Examples:**

Basic usage:
```tsx
const ai = useAIAssistant({
  enabled: true,
  formContext: { firstName: 'John' }
});

// Get suggestion for a field
const suggestion = await ai.suggestValue('email', 'john@');

// Autofill multiple fields
const data = await ai.autofill(['firstName', 'lastName', 'email']);

// Check availability
const status = await ai.checkAvailability();
```

With custom providers:
```tsx
const ai = useAIAssistant({
  providers: [
    { type: 'openai', apiKey: 'sk-...', priority: 10 }
  ],
  executionOrder: ['openai'],
  fallbackOnError: false
});
```

---

### useAIFormContext

```typescript
function useAIFormContext(): AIFormContextValue
```

Hook to access AI form context from AIFormProvider.

**Returns:** The AI form context value

**Throws:** Error if used outside of AIFormProvider

**Description:**

This hook must be used within an AIFormProvider. It provides access to the global AI configuration including providers, execution order, and other settings.

**Example:**

```tsx
function MyComponent() {
  const { providers, executionOrder } = useAIFormContext();
  // Use context values...
}
```

---

### useOptionalAIFormContext

```typescript
function useOptionalAIFormContext(): AIFormContextValue | null
```

Hook to optionally access AI form context from AIFormProvider.

**Returns:** The AI form context value or null if not within provider

**Description:**

Similar to `useAIFormContext` but returns null instead of throwing an error when used outside of AIFormProvider. Useful for components that work with or without the provider.

**Example:**

```tsx
function MyComponent() {
  const context = useOptionalAIFormContext();
  if (context) {
    // Use context values...
  } else {
    // Use default values...
  }
}
```

---

## Components

### AIFormProvider

```typescript
function AIFormProvider(props: AIFormProviderProps): JSX.Element
```

Global AI configuration provider for React Hook Form AI.

**Props:** See [AIFormProviderProps](#aiformproviderprops)

**Description:**

Wrap your application or component tree with this provider to configure AI settings globally. All `useForm` hooks within the provider will inherit these settings unless overridden with local options.

**Examples:**

Basic setup:
```tsx
<AIFormProvider
  providers={[
    { type: 'chrome', priority: 10 },
    { type: 'openai', apiKey: 'sk-...', priority: 5 }
  ]}
  fallbackOnError={true}
>
  <App />
</AIFormProvider>
```

With custom execution order:
```tsx
<AIFormProvider
  providers={[
    { type: 'chrome', priority: 10 },
    { type: 'openai', apiKey: 'sk-...', priority: 5 },
    { type: 'custom', apiUrl: 'https://api.example.com', priority: 1 }
  ]}
  executionOrder={['chrome', 'openai', 'custom']}
  fallbackOnError={true}
  debounceMs={500}
  excludeFields={['password', 'ssn']}
>
  <App />
</AIFormProvider>
```

---

## Interfaces

### UseFormAIReturn\<T\>

Extended return type from `useForm` hook with AI capabilities.

**Type Parameters:**
- `T` - The form data type extending FieldValues

**Extends:** `UseFormReturn<T>` from React Hook Form

**Properties:**

#### `aiEnabled: boolean`

Indicates whether AI features are enabled for this form instance.

```tsx
const { aiEnabled } = useForm({ ai: { enabled: true } });
console.log(aiEnabled); // true
```

#### `aiAutofill: (fields?: Path<T>[]) => Promise<void>`

Triggers AI-powered autofill for all form fields or specific fields.

**Parameters:**
- `fields` (optional): Array of field names to autofill. If omitted, all fields are autofilled.

**Returns:** `Promise<void>` - Resolves when autofill is complete, rejects on error.

**Example:**
```tsx
// Autofill all fields
await aiAutofill();

// Autofill specific fields only
await aiAutofill(['firstName', 'lastName']);
```

#### `aiSuggest: (fieldName: Path<T>) => Promise<string | null>`

Gets an AI suggestion for a specific field based on its current value and form context.

**Parameters:**
- `fieldName`: The name of the field to get a suggestion for

**Returns:** `Promise<string | null>` - The suggested value, or `null` if no suggestion is available

**Example:**
```tsx
const suggestion = await aiSuggest('email');
if (suggestion) {
  setValue('email', suggestion);
}
```

#### `aiLoading: boolean`

Indicates whether an AI operation (autofill or suggest) is currently in progress.

**Example:**
```tsx
<button onClick={() => aiAutofill()} disabled={aiLoading}>
  {aiLoading ? 'Filling...' : 'AI Autofill'}
</button>
```

#### `aiAvailability: { available: boolean; status: string; needsDownload: boolean } | null`

Provides information about AI availability status.

**Properties:**
- `available`: `true` if AI is ready to use
- `status`: Current status string (`'readily'`, `'downloadable'`, `'downloading'`, `'unavailable'`, `'error'`)
- `needsDownload`: `true` if the AI model needs to be downloaded (Chrome AI only)

**Example:**
```tsx
if (aiAvailability?.needsDownload) {
  return <button onClick={() => aiAutofill()}>Download AI Model & Autofill</button>;
}

if (!aiAvailability?.available) {
  return <p>AI unavailable: {aiAvailability?.status}</p>;
}
```

#### `refreshAvailability: () => Promise<void>`

Manually refreshes the AI availability status.

**Returns:** `Promise<void>` - Resolves when availability check is complete

**Example:**
```tsx
useEffect(() => {
  const interval = setInterval(async () => {
    if (aiAvailability?.status === 'downloading') {
      await refreshAvailability();
    }
  }, 2000);
  
  return () => clearInterval(interval);
}, [aiAvailability?.status]);
```

#### `aiDownloadProgress: number | null`

Download progress percentage (0-100) when the Chrome AI model is being downloaded. `null` when not downloading.

**Example:**
```tsx
{aiDownloadProgress !== null && (
  <div>
    <progress value={aiDownloadProgress} max={100} />
    <span>{aiDownloadProgress}% downloaded</span>
  </div>
)}
```

---

### AIFormOptions

Configuration options for AI features in the form.

**Properties:**

#### `enabled?: boolean`

Enable or disable AI features for this form. Default: `true`

#### `apiUrl?: string`

API endpoint for custom server provider. Default: `'http://localhost:3001'`

#### `debounceMs?: number`

Debounce time in milliseconds for AI suggestions on field blur. Default: `800`

#### `excludeFields?: string[]`

Array of field names to exclude from AI processing (e.g., passwords, credit cards). Default: `[]`

#### `autoCheckAvailability?: boolean`

Automatically check AI availability when the form mounts. Default: `true`

#### `providers?: AIProvider[]`

Override AI providers for this specific form. Inherits from `AIFormProvider` if not specified.

#### `executionOrder?: AIProviderType[]`

Override the order in which providers are tried. Inherits from `AIFormProvider` if not specified.

#### `fallbackOnError?: boolean`

Automatically try the next provider if one fails. Default: `true`

#### `formContext?: string | Record<string, any>`

Context information for AI to use when generating suggestions. Can be a string description or an object with contextual data.

**Example:**

```tsx
const form = useForm<FormData>({
  ai: {
    enabled: true,
    debounceMs: 500,
    excludeFields: ['password', 'creditCard'],
    providers: [
      { type: 'chrome', priority: 10 },
      { type: 'openai', apiKey: 'sk-...', priority: 5 }
    ],
    executionOrder: ['chrome', 'openai'],
    fallbackOnError: true,
    formContext: 'Senior software engineer applying for a tech lead position'
  }
});
```

---

### AIFormProviderProps

Props for the AIFormProvider component.

**Properties:**

#### `children: ReactNode`

Child components that will have access to the AI context.

#### `providers: AIProvider[]`

Array of AI provider configurations. **Required.**

#### `executionOrder?: AIProviderType[]`

Array specifying the order to try providers. If not provided, providers are sorted by priority (highest first).

#### `fallbackOnError?: boolean`

When `true`, automatically tries the next provider if one fails. Default: `true`

#### `enabled?: boolean`

Globally enable/disable AI features. Default: `true`

#### `debounceMs?: number`

Debounce time in milliseconds for AI suggestions. Default: `800`

#### `excludeFields?: string[]`

Array of field names to exclude from AI processing. Default: `[]`

#### `formContext?: string | Record<string, any>`

Global context information for AI to use when generating suggestions. Can be a string description or an object with contextual data. Forms can override this with their own local context.

---

## Types

### AIProviderType

```typescript
type AIProviderType = 'chrome' | 'openai' | 'custom' | 'browser';
```

Supported AI provider types.

- `chrome`: Chrome Built-in AI (on-device, privacy-friendly, free)
- `openai`: OpenAI API (GPT-3.5, GPT-4, etc.)
- `custom`: Custom AI server endpoint
- `browser`: Browser-based AI service

---

### AIProvider

```typescript
type AIProvider = OpenAIConfig | CustomServerConfig | ChromeAIConfig | BrowserAIConfig;
```

Union type of all supported AI provider configurations.

**Example:**

```tsx
const providers: AIProvider[] = [
  { type: 'chrome', priority: 10 },
  { type: 'openai', apiKey: 'sk-...', priority: 5 },
  { type: 'custom', apiUrl: 'https://api.example.com', priority: 1 }
];
```

---

### OpenAIConfig

Configuration for OpenAI provider.

**Properties:**

#### `type: 'openai'`

Must be `'openai'`.

#### `apiKey: string`

OpenAI API key. **Required.**

#### `apiUrl?: string`

Custom API endpoint. Optional, defaults to OpenAI's API.

#### `model?: string`

Model to use. Optional, defaults to `'gpt-3.5-turbo'`.

Supported models:
- `gpt-3.5-turbo` (default) - Fast and cost-effective
- `gpt-4` - More accurate but slower and more expensive
- `gpt-4-turbo` - Balance of speed and accuracy

#### `organization?: string`

OpenAI organization ID. Optional.

#### `enabled?: boolean`

Set to `false` to disable this provider. Optional.

#### `priority?: number`

Higher values are tried first. Optional, default: 0.

**Example:**

```tsx
const config: OpenAIConfig = {
  type: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4',
  organization: 'org-...',
  priority: 5
};
```

---

### CustomServerConfig

Configuration for custom AI server provider.

**Properties:**

#### `type: 'custom'`

Must be `'custom'`.

#### `apiUrl: string`

Custom API endpoint. **Required.**

Your server must implement these endpoints:
- `GET /health` - Health check
- `POST /api/suggest` - Field suggestion
- `POST /api/autofill` - Form autofill

#### `headers?: Record<string, string>`

Custom HTTP headers for requests. Optional.

#### `enabled?: boolean`

Set to `false` to disable this provider. Optional.

#### `priority?: number`

Higher values are tried first. Optional, default: 0.

**Example:**

```tsx
const config: CustomServerConfig = {
  type: 'custom',
  apiUrl: 'https://your-api.com',
  headers: {
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value'
  },
  priority: 1
};
```

---

### ChromeAIConfig

Configuration for Chrome Built-in AI provider.

**Properties:**

#### `type: 'chrome'`

Must be `'chrome'`.

#### `enabled?: boolean`

Set to `false` to disable this provider. Optional.

#### `priority?: number`

Higher values are tried first. Optional, default: 0.

#### `systemPrompt?: string`

Custom prompt template for Chrome AI. Use placeholders `{fieldName}`, `{currentValue}`, `{formContext}`, and `{fields}` for dynamic values. If not provided, uses the default prompt.

**Features:**
- ✅ No API key required
- ✅ Browser-based and privacy-friendly
- ✅ Free to use
- ⚠️ Requires Chrome 127+ with AI features enabled
- ⚠️ May require downloading the AI model on first use

**Example:**

```tsx
const config: ChromeAIConfig = {
  type: 'chrome',
  priority: 10,
  systemPrompt: 'You are a professional recruiter. For field {fieldName} with value "{currentValue}", suggest a professional response. Context: {formContext}. Return only the value.'
};
```

---

### BrowserAIConfig

Configuration for browser-based AI provider.

**Properties:**

#### `type: 'browser'`

Must be `'browser'`.

#### `apiUrl: string`

Browser AI service endpoint. **Required.**

#### `headers?: Record<string, string>`

Custom HTTP headers for requests. Optional.

#### `enabled?: boolean`

Set to `false` to disable this provider. Optional.

#### `priority?: number`

Higher values are tried first. Optional, default: 0.

**Example:**

```tsx
const config: BrowserAIConfig = {
  type: 'browser',
  apiUrl: 'https://browser-ai.example.com',
  priority: 3
};
```

---

### AIFormContextValue

Context value provided by AIFormProvider.

**Properties:**

#### `providers: AIProvider[]`

Array of configured AI providers.

#### `executionOrder: AIProviderType[]`

Order in which providers should be tried.

#### `fallbackOnError: boolean`

Whether to fallback to next provider on error.

#### `enabled: boolean`

Whether AI features are globally enabled.

#### `debounceMs: number`

Debounce time in milliseconds for AI suggestions.

#### `excludeFields: string[]`

Array of field names to exclude from AI processing.

---

### AIResponse

Response from an AI provider.

**Properties:**

#### `suggestion: string`

The AI-generated suggestion.

#### `provider: AIProviderType`

Which provider generated this response.

#### `confidence?: number`

Optional confidence score (0-1).

---

## See Also

- [Getting Started Guide](./GETTING_STARTED.md)
- [Provider Configuration](./PROVIDERS.md)
- [Examples](./EXAMPLES.md)
- [Main README](../README.md)
