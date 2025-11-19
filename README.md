<div align="center">
    <a href="https://github.com/SaadBazaz/react-hook-form-ai" title="React Hook Form AI - Simple React forms validation, combined with the power of AI">
        <img src="https://raw.githubusercontent.com/SaadBazaz/react-hook-form-ai/master/docs/logo.png" alt="React Hook AI Form Logo - React hook custom hook for form validation, with AI" />
    </a>
</div>

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/react-hook-form-ai.svg?style=for-the-badge)](https://www.npmjs.com/package/react-hook-form-ai)
[![npm](https://img.shields.io/npm/dt/react-hook-form-ai.svg?style=for-the-badge)](https://www.npmjs.com/package/react-hook-form-ai)
[![npm](https://img.shields.io/npm/l/react-hook-form-ai?style=for-the-badge)](https://github.com/SaadBazaz/react-hook-form-ai/blob/master/LICENSE)

</div>

A drop-in replacement for React Hook Form with AI-powered autofill and field suggestions. Supports Chrome Built-in AI, OpenAI, and custom AI providers with automatic fallback.

## Features

- 🤖 **AI-Powered Autofill** - Generate realistic form data using AI
- 💡 **Smart Field Suggestions** - Get AI suggestions for individual fields
- 🔄 **Multiple Provider Support** - Chrome Built-in AI, OpenAI, Custom Server, or Browser AI
- 🛡️ **Provider Fallback** - Automatic fallback to next provider on failure
- 📊 **Download Progress** - Monitor Chrome AI model download progress
- ✅ **Availability Checking** - Check AI availability before use
- 🌐 **Global Configuration** - Configure providers once with AIFormProvider
- 📘 **Full TypeScript Support** - Complete type definitions included
- 🔌 **Drop-in Replacement** - 100% compatible with React Hook Form API

## Installation

```bash
npm install react-hook-form-ai
# or
pnpm add react-hook-form-ai
# or
yarn add react-hook-form-ai
```

## Quick Start

```tsx
import { useForm } from 'react-hook-form-ai';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

function App() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName', { required: true })} placeholder="Last Name" />
      {errors.lastName && <p>Last name is required.</p>}
      <input {...register('email')} placeholder="Email" type="email" />
      
      <button 
        type="button" 
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        {aiLoading ? 'Filling...' : 'AI Autofill'}
      </button>
      
      <input type="submit" />
    </form>
  );
}
```

## Global Configuration

Configure AI providers globally for your entire application:

```tsx
import { AIFormProvider } from 'react-hook-form-ai';

function Root() {
  return (
    <AIFormProvider
      providers={[
        { type: 'chrome', priority: 10 },
        { 
          type: 'openai', 
          apiKey: process.env.REACT_APP_OPENAI_KEY || '',
          model: 'gpt-3.5-turbo',
          priority: 5 
        },
        {
          type: 'custom',
          apiUrl: 'https://your-api.com',
          priority: 1
        }
      ]}
      fallbackOnError={true}
    >
      <App />
    </AIFormProvider>
  );
}
```

## Documentation

### API & Examples
- 📚 [API Reference](./docs/API_REFERENCE.md) - Complete API documentation
- 💻 [Examples](./docs/EXAMPLES.md) - Practical usage examples

### Resources
- 🔗 [React Hook Form Documentation](https://react-hook-form.com/get-started) - Learn about the underlying form library
- 🤖 [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/ai/built-in) - Official Chrome AI documentation

## Key Concepts

### AI Providers

React Hook Form AI supports multiple AI providers:

- **Chrome Built-in AI** - Free, privacy-friendly, on-device AI (requires Chrome 127+)
- **OpenAI** - Cloud-based AI using GPT models (requires API key)
- **Custom Server** - Your own AI backend
- **Browser AI** - Browser-based AI services

### Provider Priority and Fallback

Providers are tried in order based on priority or execution order. When `fallbackOnError` is `true`, the next provider is automatically tried if one fails.

```tsx
// Chrome AI → OpenAI → Custom Server
providers={[
  { type: 'chrome', priority: 10 },
  { type: 'openai', apiKey: 'sk-...', priority: 5 },
  { type: 'custom', apiUrl: 'https://api.example.com', priority: 1 }
]}
```

### Security

Always exclude sensitive fields from AI processing:

```tsx
const form = useForm({
  ai: {
    excludeFields: ['password', 'ssn', 'creditCard']
  }
});
```

## Common Use Cases

### Multi-Provider Setup

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

### Field-Level Suggestions

```tsx
const { aiSuggest, setValue } = useForm<FormData>();

const suggestion = await aiSuggest('email');
if (suggestion) {
  setValue('email', suggestion);
}
```

### Chrome AI Download Handling

```tsx
const { aiAvailability, aiDownloadProgress } = useForm();

if (aiAvailability?.needsDownload) {
  return <button onClick={() => aiAutofill()}>Download AI Model</button>;
}

if (aiAvailability?.status === 'downloading') {
  return <progress value={aiDownloadProgress || 0} max={100} />;
}
```

See [Examples](./docs/EXAMPLES.md) for more use cases.

## API Overview

### useForm Hook

```typescript
const {
  // Standard React Hook Form properties
  register,
  handleSubmit,
  formState,
  // ... all other RHF properties
  
  // AI-specific properties
  aiEnabled,
  aiAutofill,
  aiSuggest,
  aiLoading,
  aiAvailability,
  refreshAvailability,
  aiDownloadProgress
} = useForm<FormData>({
  ai: {
    enabled: true,
    providers: [...],
    excludeFields: ['password']
  }
});
```

See [API Reference](./docs/API_REFERENCE.md) for complete documentation.

## Browser Compatibility

| Browser | Chrome AI | OpenAI | Custom Server |
|---------|-----------|--------|---------------|
| Chrome 127+ | ✅ | ✅ | ✅ |
| Chrome <127 | ❌ | ✅ | ✅ |
| Firefox | ❌ | ✅ | ✅ |
| Safari | ❌ | ✅ | ✅ |
| Edge | ❌ | ✅ | ✅ |
| Mobile | ❌ | ✅ | ✅ |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Credits

This library is built on top of [React Hook Form](https://react-hook-form.com/). All credit for the core form management functionality goes to the React Hook Form team.

## License

MIT © [Saad Bazaz](https://github.com/SaadBazaz)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/SaadBazaz">Saad Bazaz</a> and <a href="https://github.com/sameedilyas">Sameed Ilyas</a></sub>
</div>
