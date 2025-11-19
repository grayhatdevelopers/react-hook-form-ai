# Examples

Practical examples for common use cases with React Hook Form AI.

## Table of Contents

- [Multi-Provider Setup with Fallback](#multi-provider-setup-with-fallback)
- [Field-Level AI Suggestions](#field-level-ai-suggestions)
- [Chrome AI Download Handling](#chrome-ai-download-handling)
- [Excluding Sensitive Fields](#excluding-sensitive-fields)
- [Custom Debounce Timing](#custom-debounce-timing)
- [Partial Form Autofill](#partial-form-autofill)
- [Context-Aware Suggestions](#context-aware-suggestions)

## Multi-Provider Setup with Fallback

Configure multiple AI providers with priority-based execution and automatic fallback.

```tsx
import { AIFormProvider, useForm } from 'react-hook-form-ai';

// Root component with provider configuration
function Root() {
  return (
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
    >
      <App />
    </AIFormProvider>
  );
}

// Form component
function App() {
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading,
    aiAvailability 
  } = useForm<{
    name: string;
    email: string;
    company: string;
  }>();

  const [error, setError] = React.useState<string | null>(null);

  const handleAutofill = async () => {
    setError(null);
    try {
      await aiAutofill();
    } catch (err) {
      setError('All AI providers failed. Please fill the form manually.');
      console.error('Autofill error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('name')} placeholder="Full Name" />
      <input {...register('email')} placeholder="Email" type="email" />
      <input {...register('company')} placeholder="Company" />
      
      <button 
        type="button" 
        onClick={handleAutofill}
        disabled={aiLoading || !aiAvailability?.available}
      >
        {aiLoading ? 'Filling...' : 'AI Autofill'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {aiAvailability && !aiAvailability.available && (
        <p>AI Status: {aiAvailability.status}</p>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Field-Level AI Suggestions

Get AI suggestions for individual fields with user control.

```tsx
import { useForm } from 'react-hook-form-ai';
import { useState } from 'react';

interface ProfileForm {
  username: string;
  email: string;
  bio: string;
  password: string;
  website: string;
}

function ProfileEditor() {
  const { 
    register, 
    handleSubmit, 
    aiSuggest, 
    setValue,
    watch 
  } = useForm<ProfileForm>({
    ai: {
      enabled: true,
      debounceMs: 500,
      excludeFields: ['password'], // Never send password to AI
      providers: [
        { type: 'chrome', priority: 10 },
        { type: 'openai', apiKey: process.env.REACT_APP_OPENAI_KEY || '', priority: 5 }
      ]
    }
  });

  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingField, setLoadingField] = useState<string | null>(null);

  // Get AI suggestion for a specific field
  const getSuggestion = async (fieldName: keyof ProfileForm) => {
    setLoadingField(fieldName);
    try {
      const suggestion = await aiSuggest(fieldName);
      if (suggestion) {
        setSuggestions(prev => ({ ...prev, [fieldName]: suggestion }));
      }
    } catch (error) {
      console.error(`Failed to get suggestion for ${fieldName}:`, error);
    } finally {
      setLoadingField(null);
    }
  };

  // Accept a suggestion
  const acceptSuggestion = (fieldName: keyof ProfileForm) => {
    const suggestion = suggestions[fieldName];
    if (suggestion) {
      setValue(fieldName, suggestion);
      setSuggestions(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  // Dismiss a suggestion
  const dismissSuggestion = (fieldName: keyof ProfileForm) => {
    setSuggestions(prev => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <div>
        <label>Username</label>
        <input {...register('username')} placeholder="johndoe" />
        <button 
          type="button" 
          onClick={() => getSuggestion('username')}
          disabled={loadingField === 'username'}
        >
          {loadingField === 'username' ? '...' : '✨ Suggest'}
        </button>
        {suggestions.username && (
          <div className="suggestion-box">
            <strong>Suggestion:</strong> {suggestions.username}
            <button type="button" onClick={() => acceptSuggestion('username')}>
              ✓ Accept
            </button>
            <button type="button" onClick={() => dismissSuggestion('username')}>
              ✗ Dismiss
            </button>
          </div>
        )}
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} placeholder="john@example.com" type="email" />
        <button 
          type="button" 
          onClick={() => getSuggestion('email')}
          disabled={loadingField === 'email'}
        >
          {loadingField === 'email' ? '...' : '✨ Suggest'}
        </button>
        {suggestions.email && (
          <div className="suggestion-box">
            <strong>Suggestion:</strong> {suggestions.email}
            <button type="button" onClick={() => acceptSuggestion('email')}>
              ✓ Accept
            </button>
            <button type="button" onClick={() => dismissSuggestion('email')}>
              ✗ Dismiss
            </button>
          </div>
        )}
      </div>

      <div>
        <label>Bio</label>
        <textarea {...register('bio')} placeholder="Tell us about yourself..." rows={4} />
        <button 
          type="button" 
          onClick={() => getSuggestion('bio')}
          disabled={loadingField === 'bio'}
        >
          {loadingField === 'bio' ? '...' : '✨ Improve with AI'}
        </button>
        {suggestions.bio && (
          <div className="suggestion-box">
            <strong>Improved version:</strong>
            <p>{suggestions.bio}</p>
            <button type="button" onClick={() => acceptSuggestion('bio')}>
              ✓ Accept
            </button>
            <button type="button" onClick={() => dismissSuggestion('bio')}>
              ✗ Dismiss
            </button>
          </div>
        )}
      </div>

      <div>
        <label>Password</label>
        <input 
          {...register('password')} 
          type="password" 
          placeholder="Enter secure password" 
        />
        <small>🔒 Password is excluded from AI processing for security</small>
      </div>

      <button type="submit">Save Profile</button>
    </form>
  );
}
```

## Chrome AI Download Handling

Handle Chrome AI model download gracefully with progress tracking.

```tsx
import { useForm } from 'react-hook-form-ai';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

function ContactForm() {
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading,
    aiAvailability,
    refreshAvailability,
    aiDownloadProgress 
  } = useForm<FormData>({
    ai: {
      providers: [{ type: 'chrome', priority: 10 }],
      autoCheckAvailability: true
    }
  });

  const [downloadStarted, setDownloadStarted] = useState(false);

  // Poll availability during download
  useEffect(() => {
    if (aiAvailability?.status === 'downloading') {
      const interval = setInterval(async () => {
        await refreshAvailability();
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [aiAvailability?.status, refreshAvailability]);

  const handleAutofillClick = async () => {
    if (aiAvailability?.needsDownload) {
      setDownloadStarted(true);
    }
    
    try {
      await aiAutofill();
    } catch (error) {
      console.error('Autofill failed:', error);
    }
  };

  // Render different UI based on availability status
  const renderAIStatus = () => {
    if (!aiAvailability) {
      return <p>Checking AI availability...</p>;
    }

    switch (aiAvailability.status) {
      case 'readily':
        return (
          <button 
            type="button" 
            onClick={handleAutofillClick}
            disabled={aiLoading}
          >
            {aiLoading ? 'Filling...' : '✨ AI Autofill'}
          </button>
        );

      case 'downloadable':
        return (
          <div>
            <button 
              type="button" 
              onClick={handleAutofillClick}
              disabled={aiLoading}
            >
              📥 Download AI Model & Autofill
            </button>
            <p style={{ fontSize: '0.9em', color: '#666' }}>
              First-time setup: ~1-2GB download required
            </p>
          </div>
        );

      case 'downloading':
        return (
          <div>
            <p>Downloading AI model...</p>
            {aiDownloadProgress !== null && (
              <div>
                <progress 
                  value={aiDownloadProgress} 
                  max={100}
                  style={{ width: '100%', height: '20px' }}
                />
                <p>{Math.round(aiDownloadProgress)}% complete</p>
              </div>
            )}
            <small style={{ color: '#666' }}>
              This is a one-time download. Please keep this tab open.
            </small>
          </div>
        );

      case 'unavailable':
        return (
          <div>
            <p style={{ color: '#999' }}>
              ❌ Chrome AI is not available in this browser
            </p>
            <small>
              Requires Chrome 127+ with AI features enabled.
              <br />
              Visit <a href="chrome://flags/#optimization-guide-on-device-model">
                chrome://flags
              </a> to enable.
            </small>
          </div>
        );

      case 'error':
        return (
          <div>
            <p style={{ color: '#d00' }}>⚠️ AI availability check failed</p>
            <button type="button" onClick={() => refreshAvailability()}>
              🔄 Retry
            </button>
          </div>
        );

      default:
        return <p>Unknown AI status: {aiAvailability.status}</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <h2>Contact Us</h2>
      
      <div>
        <label>Name</label>
        <input {...register('name')} placeholder="Your name" />
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} placeholder="your@email.com" type="email" />
      </div>

      <div>
        <label>Message</label>
        <textarea {...register('message')} placeholder="Your message..." rows={5} />
      </div>

      <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        {renderAIStatus()}
      </div>

      <button type="submit">Send Message</button>
    </form>
  );
}
```

## Excluding Sensitive Fields

Always exclude sensitive fields from AI processing.

```tsx
import { useForm } from 'react-hook-form-ai';

interface PaymentForm {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardholderName: string;
  billingAddress: string;
}

function PaymentForm() {
  const { register, handleSubmit, aiAutofill } = useForm<PaymentForm>({
    ai: {
      enabled: true,
      // Exclude sensitive payment fields
      excludeFields: ['cardNumber', 'cvv', 'expiryDate'],
      providers: [
        { type: 'chrome', priority: 10 }
      ]
    }
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <div>
        <label>Cardholder Name</label>
        <input {...register('cardholderName')} placeholder="John Doe" />
      </div>

      <div>
        <label>Card Number</label>
        <input 
          {...register('cardNumber')} 
          placeholder="1234 5678 9012 3456"
          type="text"
        />
        <small>🔒 Not sent to AI</small>
      </div>

      <div>
        <label>Expiry Date</label>
        <input {...register('expiryDate')} placeholder="MM/YY" />
        <small>🔒 Not sent to AI</small>
      </div>

      <div>
        <label>CVV</label>
        <input {...register('cvv')} placeholder="123" type="password" />
        <small>🔒 Not sent to AI</small>
      </div>

      <div>
        <label>Billing Address</label>
        <textarea {...register('billingAddress')} rows={3} />
      </div>

      <button 
        type="button" 
        onClick={() => aiAutofill()}
      >
        Fill Non-Sensitive Fields
      </button>

      <button type="submit">Submit Payment</button>
    </form>
  );
}
```

## Custom Debounce Timing

Adjust debounce timing for AI suggestions based on your needs.

```tsx
import { useForm } from 'react-hook-form-ai';

function FastSuggestionsForm() {
  const { register, handleSubmit } = useForm({
    ai: {
      enabled: true,
      debounceMs: 300, // Faster suggestions (default is 800ms)
      providers: [{ type: 'chrome', priority: 10 }]
    }
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('search')} placeholder="Type to get suggestions..." />
      <button type="submit">Search</button>
    </form>
  );
}

function SlowSuggestionsForm() {
  const { register, handleSubmit } = useForm({
    ai: {
      enabled: true,
      debounceMs: 1500, // Slower suggestions to reduce API calls
      providers: [
        { type: 'openai', apiKey: 'sk-...', priority: 10 }
      ]
    }
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <textarea {...register('essay')} rows={10} placeholder="Write your essay..." />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Partial Form Autofill

Autofill only specific fields instead of the entire form.

```tsx
import { useForm } from 'react-hook-form-ai';

interface RegistrationForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

function RegistrationForm() {
  const { register, handleSubmit, aiAutofill, aiLoading } = useForm<RegistrationForm>();

  // Autofill only personal info fields
  const fillPersonalInfo = async () => {
    await aiAutofill(['firstName', 'lastName', 'phone']);
  };

  // Autofill only account fields (excluding passwords)
  const fillAccountInfo = async () => {
    await aiAutofill(['username', 'email']);
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <h3>Account Information</h3>
      <input {...register('username')} placeholder="Username" />
      <input {...register('email')} placeholder="Email" type="email" />
      <input {...register('password')} placeholder="Password" type="password" />
      <input {...register('confirmPassword')} placeholder="Confirm Password" type="password" />
      
      <button 
        type="button" 
        onClick={fillAccountInfo}
        disabled={aiLoading}
      >
        Fill Account Info
      </button>

      <h3>Personal Information</h3>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <input {...register('phone')} placeholder="Phone" />
      
      <button 
        type="button" 
        onClick={fillPersonalInfo}
        disabled={aiLoading}
      >
        Fill Personal Info
      </button>

      <button type="submit">Register</button>
    </form>
  );
}
```

## Context-Aware Suggestions

AI suggestions consider other field values for better accuracy.

```tsx
import { useForm } from 'react-hook-form-ai';

interface AddressForm {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  street: string;
}

function AddressForm() {
  const { register, handleSubmit, watch, aiSuggest, setValue } = useForm<AddressForm>();

  const country = watch('country');
  const state = watch('state');

  // Get city suggestion based on country and state
  const suggestCity = async () => {
    const suggestion = await aiSuggest('city');
    if (suggestion) {
      setValue('city', suggestion);
    }
  };

  // Get zip code suggestion based on city, state, country
  const suggestZipCode = async () => {
    const suggestion = await aiSuggest('zipCode');
    if (suggestion) {
      setValue('zipCode', suggestion);
    }
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <div>
        <label>Country</label>
        <input {...register('country')} placeholder="United States" />
      </div>

      <div>
        <label>State</label>
        <input {...register('state')} placeholder="California" />
      </div>

      <div>
        <label>City</label>
        <input {...register('city')} placeholder="San Francisco" />
        <button type="button" onClick={suggestCity}>
          Suggest City
        </button>
        {country && state && (
          <small>Based on {state}, {country}</small>
        )}
      </div>

      <div>
        <label>Zip Code</label>
        <input {...register('zipCode')} placeholder="94102" />
        <button type="button" onClick={suggestZipCode}>
          Suggest Zip
        </button>
      </div>

      <div>
        <label>Street Address</label>
        <input {...register('street')} placeholder="123 Main St" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## See Also

- [API Reference](./API_REFERENCE.md)
- [Provider Configuration](./PROVIDERS.md)
- [Getting Started](./GETTING_STARTED.md)
