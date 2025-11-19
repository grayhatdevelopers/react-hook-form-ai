# Provider Configuration

Detailed guide for configuring AI providers in React Hook Form AI.

## Overview

React Hook Form AI supports multiple AI providers with automatic fallback. You can configure providers globally using `AIFormProvider` or locally per form using the `useForm` hook.

## Chrome Built-in AI

Chrome's experimental on-device AI. Privacy-friendly and free, but requires Chrome 127+ with AI features enabled.

### Configuration

```tsx
{
  type: 'chrome',
  priority: 10,  // Optional: higher priority = tried first
  systemPrompt: 'Custom prompt...'  // Optional: custom AI prompt template
}
```

### Features

- ✅ No API key required
- ✅ Browser-based and privacy-friendly
- ✅ Free to use
- ⚠️ Requires Chrome 127+ with AI features enabled
- ⚠️ May require downloading the AI model on first use

### Enabling Chrome AI

1. Update Chrome to version 127 or later
2. Visit `chrome://flags/#optimization-guide-on-device-model`
3. Set to "Enabled"
4. Restart Chrome

### Custom Prompts

Customize how Chrome AI generates suggestions using the `systemPrompt` option:

```tsx
{
  type: 'chrome',
  priority: 10,
  systemPrompt: `You are a professional form assistant. 
For the field named {fieldName} with current value "{currentValue}", 
provide a suggestion based on this context: {formContext}.
Return only the suggested value, no explanations.`
}
```

**Available placeholders:**
- `{fieldName}` - The name of the field being filled
- `{currentValue}` - The current value in the field
- `{formContext}` - The form context as JSON
- `{fields}` - List of all form fields (for autofill)

If no custom prompt is provided, a sensible default is used.

### Handling Model Download

The AI model (~1-2GB) downloads on first use. Handle this gracefully:

```tsx
const { aiAvailability, aiDownloadProgress, aiAutofill } = useForm({
  ai: { providers: [{ type: 'chrome' }] }
});

if (aiAvailability?.needsDownload) {
  return (
    <div>
      <p>Chrome AI requires a one-time model download (~1-2GB)</p>
      <button onClick={() => aiAutofill()}>
        📥 Download AI Model & Start
      </button>
    </div>
  );
}

if (aiAvailability?.status === 'downloading') {
  return (
    <div>
      <p>Downloading AI model... Please keep this tab open.</p>
      <progress value={aiDownloadProgress || 0} max={100} />
      <p>{Math.round(aiDownloadProgress || 0)}% complete</p>
    </div>
  );
}
```

## OpenAI Provider

Connect to OpenAI's API for AI-powered form features.

### Configuration

```tsx
{
  type: 'openai',
  apiKey: 'sk-...', // Required: Your OpenAI API key
  model: 'gpt-3.5-turbo', // Optional: defaults to 'gpt-3.5-turbo'
  organization: 'org-...', // Optional: Your OpenAI organization ID
  apiUrl: 'https://api.openai.com/v1/chat/completions', // Optional: custom API URL
  priority: 5
}
```

### Supported Models

- `gpt-3.5-turbo` (default) - Fast and cost-effective
- `gpt-4` - More accurate but slower and more expensive
- `gpt-4-turbo` - Balance of speed and accuracy

### Custom API URL

Use a custom `apiUrl` to route requests through a proxy or use OpenAI-compatible APIs:

```tsx
{
  type: 'openai',
  apiKey: 'sk-...',
  apiUrl: 'https://your-proxy.com/v1/chat/completions',
  model: 'gpt-3.5-turbo'
}
```

### Example

```tsx
<AIFormProvider
  providers={[
    {
      type: 'openai',
      apiKey: process.env.REACT_APP_OPENAI_KEY || '',
      model: 'gpt-4',
      organization: 'org-...',
      priority: 10
    }
  ]}
>
  <App />
</AIFormProvider>
```

## Custom Server Provider

Connect to your own AI backend or any custom API endpoint.

### Configuration

```tsx
{
  type: 'custom',
  apiUrl: 'https://your-api.com',
  headers: {
    'Authorization': 'Bearer your-token',
    'X-Custom-Header': 'value'
  },
  priority: 1
}
```

### Required API Endpoints

Your custom server must implement these endpoints:

#### 1. Health Check

```
GET /health
Response: 200 OK
```

#### 2. Field Suggestion

```
POST /api/suggest
Content-Type: application/json

Request Body:
{
  "fieldName": "email",
  "currentValue": "john@",
  "formContext": { "firstName": "John", "lastName": "Doe" }
}

Response:
{
  "suggestion": "john@example.com"
}
```

#### 3. Form Autofill

```
POST /api/autofill
Content-Type: application/json

Request Body:
{
  "fields": ["firstName", "lastName", "email"],
  "formContext": {}
}

Response:
{
  "autofillData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Example

```tsx
<AIFormProvider
  providers={[
    {
      type: 'custom',
      apiUrl: 'https://your-api.com',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`
      },
      priority: 5
    }
  ]}
>
  <App />
</AIFormProvider>
```

## Browser AI Provider

Connect to browser-based AI services.

### Configuration

```tsx
{
  type: 'browser',
  apiUrl: 'https://browser-ai.example.com',
  headers: {
    'Authorization': 'Bearer token'
  },
  priority: 3
}
```

## Form Context

Provide contextual information to help AI generate better suggestions:

```tsx
<AIFormProvider
  providers={[{ type: 'chrome', priority: 10 }]}
  formContext="Senior software engineer with 8+ years of experience applying for a tech lead position"
>
  <App />
</AIFormProvider>
```

Or use an object for structured context:

```tsx
<AIFormProvider
  providers={[{ type: 'chrome', priority: 10 }]}
  formContext={{
    role: 'Senior Engineer',
    experience: '8+ years',
    specialization: 'Full-stack development'
  }}
>
  <App />
</AIFormProvider>
```

Forms can override the global context:

```tsx
const form = useForm({
  ai: {
    formContext: 'Junior developer with 2 years of experience'
  }
});
```

## Multi-Provider Setup

Configure multiple providers with automatic fallback:

```tsx
<AIFormProvider
  providers={[
    // Chrome AI: Highest priority, free and privacy-friendly
    { type: 'chrome', priority: 10 },
    
    // OpenAI: Fallback option with good accuracy
    { 
      type: 'openai', 
      apiKey: process.env.REACT_APP_OPENAI_KEY || '',
      model: 'gpt-3.5-turbo',
      priority: 5 
    },
    
    // Custom server: Lowest priority fallback
    {
      type: 'custom',
      apiUrl: 'https://your-ai-backend.com',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_CUSTOM_TOKEN}`
      },
      priority: 1
    }
  ]}
  executionOrder={['chrome', 'openai', 'custom']}
  fallbackOnError={true}
  formContext="Default context for all forms"
>
  <App />
</AIFormProvider>
```

### How Fallback Works

1. **Chrome AI is tried first** (priority: 10)
   - If unavailable or fails, automatically falls back to OpenAI

2. **OpenAI is tried second** (priority: 5)
   - If fails (e.g., API key invalid, rate limit), falls back to Custom server

3. **Custom server is tried last** (priority: 1)
   - If all providers fail, the promise rejects

## Local Configuration (Per-Form Override)

Override global provider settings for individual forms:

```tsx
const { register, aiAutofill } = useForm({
  ai: {
    enabled: true,
    providers: [
      { type: 'openai', apiKey: 'sk-...', priority: 10 }
    ],
    executionOrder: ['openai'],
    fallbackOnError: false,
    debounceMs: 500,
    excludeFields: ['password', 'creditCard']
  }
});
```

Local options override global settings:
- `enabled`: Enable/disable AI for this form only
- `providers`: Use different providers for this form
- `executionOrder`: Custom provider order for this form
- `fallbackOnError`: Override fallback behavior
- `debounceMs`: Custom debounce timing
- `excludeFields`: Fields to exclude from AI processing

## Security Best Practices

### Exclude Sensitive Fields

Always exclude sensitive fields from AI processing:

```tsx
const form = useForm({
  ai: {
    excludeFields: ['password', 'ssn', 'creditCard', 'cvv']
  }
});
```

### Environment Variables

Store API keys in environment variables:

```tsx
{
  type: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_KEY || '',
}
```

### Custom Headers

Use custom headers for authentication:

```tsx
{
  type: 'custom',
  apiUrl: 'https://your-api.com',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
    'X-API-Version': '1.0'
  }
}
```

## See Also

- [API Reference](./API_REFERENCE.md)
- [Examples](./EXAMPLES.md)
- [Browser Compatibility](./BROWSER_COMPATIBILITY.md)
