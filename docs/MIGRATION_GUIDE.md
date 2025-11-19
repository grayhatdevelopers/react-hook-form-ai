# Migration Guide

## From React Hook Form to React Hook Form AI

This guide shows you how to add AI capabilities to your existing React Hook Form with minimal changes.

## Quick Migration (3 Steps)

### Step 1: Install the Package

```bash
npm install react-hook-form-ai
```

### Step 2: Update Import

```diff
- import { useForm } from 'react-hook-form';
+ import { useForm } from 'react-hook-form-ai';
```

### Step 3: Add AI Button

```diff
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('name')} />
    <input {...register('email')} />
+   <button type="button" onClick={() => aiAutofill()}>
+     AI Autofill
+   </button>
    <button type="submit">Submit</button>
  </form>
```

**That's it!** Your form now has AI capabilities.

---

## Complete Example

### Before (React Hook Form)

```tsx
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

function MyForm() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('phone')} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### After (React Hook Form AI)

```diff
- import { useForm } from 'react-hook-form';
+ import { useForm } from 'react-hook-form-ai';

  interface FormData {
    name: string;
    email: string;
    phone: string;
  }

  function MyForm() {
-   const { register, handleSubmit } = useForm<FormData>();
+   const { register, handleSubmit, aiAutofill, aiLoading } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
      console.log(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
        <input {...register('email')} />
        <input {...register('phone')} />
+       <button 
+         type="button" 
+         onClick={() => aiAutofill()}
+         disabled={aiLoading}
+       >
+         {aiLoading ? 'Processing...' : 'AI Autofill'}
+       </button>
        <button type="submit">Submit</button>
      </form>
    );
  }
```

**Changes:**
- ✅ Changed import from `react-hook-form` to `react-hook-form-ai`
- ✅ Added `aiAutofill` and `aiLoading` to destructured values
- ✅ Added AI Autofill button with loading state

---

## Adding Configuration

### Basic Configuration

```diff
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading 
- } = useForm<FormData>();
+ } = useForm<FormData>({
+   ai: {
+     enabled: true,
+     providers: [{ type: 'chrome', priority: 10 }]
+   }
+ });
```

### With Context

```diff
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading 
  } = useForm<FormData>({
    ai: {
      enabled: true,
      providers: [{ type: 'chrome', priority: 10 }],
+     formContext: 'Senior software engineer with 8+ years experience'
    }
  });
```

### Excluding Sensitive Fields

```diff
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading 
  } = useForm<FormData>({
    ai: {
      enabled: true,
      providers: [{ type: 'chrome', priority: 10 }],
+     excludeFields: ['password', 'creditCard', 'ssn']
    }
  });
```

---

## Global Configuration with Provider

### Before (Multiple Forms)

```tsx
function App() {
  return (
    <>
      <ContactForm />
      <RegistrationForm />
      <ProfileForm />
    </>
  );
}
```

### After (With Global Provider)

```diff
+ import { AIFormProvider } from 'react-hook-form-ai';

  function App() {
    return (
+     <AIFormProvider
+       providers={[{ type: 'chrome', priority: 10 }]}
+       formContext="Enterprise application forms"
+     >
        <ContactForm />
        <RegistrationForm />
        <ProfileForm />
+     </AIFormProvider>
    );
  }
```

**Benefit:** All forms automatically inherit AI configuration.

---

## Migration Patterns

### Pattern 1: Simple Form

**Before:**
```tsx
const { register, handleSubmit } = useForm();
```

**After:**
```diff
- const { register, handleSubmit } = useForm();
+ const { register, handleSubmit, aiAutofill } = useForm();
```

### Pattern 2: Form with Validation

**Before:**
```tsx
const { 
  register, 
  handleSubmit, 
  formState: { errors } 
} = useForm();
```

**After:**
```diff
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
+   aiAutofill,
+   aiLoading
  } = useForm();
```

### Pattern 3: Form with Default Values

**Before:**
```tsx
const { register, handleSubmit } = useForm({
  defaultValues: {
    name: '',
    email: ''
  }
});
```

**After:**
```diff
  const { 
    register, 
    handleSubmit,
+   aiAutofill,
+   aiLoading
  } = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
+   ai: {
+     enabled: true,
+     providers: [{ type: 'chrome', priority: 10 }]
+   }
  });
```

### Pattern 4: Form with Custom Resolver

**Before:**
```tsx
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

**After:**
```diff
  const { 
    register, 
    handleSubmit,
+   aiAutofill,
+   aiLoading
  } = useForm({
    resolver: zodResolver(schema),
+   ai: {
+     enabled: true,
+     providers: [{ type: 'chrome', priority: 10 }]
+   }
  });
```

---

## Advanced Migration

### Adding AI Status Indicator

```diff
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
-   aiLoading 
+   aiLoading,
+   aiAvailability
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
+     {aiAvailability && (
+       <div className={aiAvailability.available ? 'success' : 'warning'}>
+         AI Status: {aiAvailability.status}
+       </div>
+     )}
      
      <input {...register('name')} />
      <input {...register('email')} />
      
      <button 
        type="button" 
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        {aiLoading ? 'Processing...' : 'AI Autofill'}
      </button>
      <button type="submit">Submit</button>
    </form>
  );
```

### Adding Download Progress

```diff
  const { 
    register, 
    handleSubmit, 
    aiAutofill, 
    aiLoading,
-   aiAvailability
+   aiAvailability,
+   aiDownloadProgress
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {aiAvailability && (
        <div className={aiAvailability.available ? 'success' : 'warning'}>
          AI Status: {aiAvailability.status}
        </div>
      )}
      
+     {aiDownloadProgress !== null && (
+       <div className="progress-bar">
+         <div style={{ width: `${aiDownloadProgress}%` }} />
+         <span>Downloading: {aiDownloadProgress.toFixed(0)}%</span>
+       </div>
+     )}
      
      <input {...register('name')} />
      <input {...register('email')} />
      
      <button 
        type="button" 
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        {aiLoading ? 'Processing...' : 'AI Autofill'}
      </button>
      <button type="submit">Submit</button>
    </form>
  );
```

---

## Checklist

Use this checklist when migrating:

- [ ] Install `react-hook-form-ai`
- [ ] Update imports from `react-hook-form` to `react-hook-form-ai`
- [ ] Add `aiAutofill` and `aiLoading` to destructured values
- [ ] Add AI Autofill button to form
- [ ] Configure AI providers (optional)
- [ ] Add form context (optional)
- [ ] Exclude sensitive fields (if needed)
- [ ] Test AI functionality
- [ ] Update TypeScript types (if using TypeScript)
- [ ] Add loading states and error handling

---

## Troubleshooting

### Issue: AI Not Working

**Check:**
```diff
  const { register, handleSubmit, aiAutofill } = useForm({
+   ai: {
+     enabled: true,
+     providers: [{ type: 'chrome', priority: 10 }]
+   }
  });
```

### Issue: Chrome AI Unavailable

**Add fallback:**
```diff
  const { register, handleSubmit, aiAutofill } = useForm({
    ai: {
      enabled: true,
      providers: [
        { type: 'chrome', priority: 10 },
+       { type: 'custom', apiUrl: 'http://localhost:3001', priority: 5 }
      ]
    }
  });
```

### Issue: Sensitive Fields Being Filled

**Exclude them:**
```diff
  const { register, handleSubmit, aiAutofill } = useForm({
    ai: {
      enabled: true,
      providers: [{ type: 'chrome', priority: 10 }],
+     excludeFields: ['password', 'creditCard', 'ssn']
    }
  });
```

---

## Next Steps

1. ✅ Migrate one form as a test
2. ✅ Test AI functionality
3. ✅ Add configuration as needed
4. ✅ Migrate remaining forms
5. ✅ Consider using AIFormProvider for global config

## Resources

- [API Reference](./API_REFERENCE.md)
- [Examples](./EXAMPLES.md)
- [Context Feature Guide](../CONTEXT_FEATURE.md)
- [Demo Application](../demo/README.md)

---

**Migration is simple - just change the import and add an AI button! 🚀**
