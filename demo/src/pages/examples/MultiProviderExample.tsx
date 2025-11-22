import { useState } from 'react';
import { useForm, AIFormProvider } from 'react-hook-form-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
}

function MultiProviderForm() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
  } = useForm<FormData>();

  const [error, setError] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<string>('');

  const handleAutofill = async () => {
    setError(null);
    try {
      await aiAutofill();
      setLastProvider('Successfully filled using configured provider');
    } catch (err) {
      setError('All AI providers failed. Please fill the form manually.');
      console.error('Autofill error:', err);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Business Contact Form</CardTitle>
            <CardDescription>
              This form uses multiple AI providers with automatic fallback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: true })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Acme Inc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  {...register('role')}
                  placeholder="Software Engineer"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAutofill}
                  disabled={aiLoading || !aiAvailability?.available}
                  className="flex-1"
                >
                  {aiLoading ? (
                    <>Filling...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Autofill
                    </>
                  )}
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {lastProvider && !error && (
                <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <p className="text-sm">{lastProvider}</p>
                </div>
              )}

              {aiAvailability && !aiAvailability.available && (
                <p className="text-sm text-muted-foreground">
                  AI Status: {aiAvailability.status}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Provider Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-md">
              <code>{`<AIFormProvider
  providers={[
    { 
      type: 'chrome', 
      priority: 10 
    },
    { 
      type: 'openai', 
      apiKey: 'sk-...', 
      model: 'gpt-3.5-turbo',
      priority: 5 
    },
    {
      type: 'custom',
      apiUrl: 'https://api.example.com',
      priority: 1
    }
  ]}
  executionOrder={[
    'chrome', 
    'openai', 
    'custom'
  ]}
  fallbackOnError={true}
>
  <App />
</AIFormProvider>`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Fallback Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Chrome AI (Priority: 10)</p>
              <p className="text-muted-foreground">
                Tries first. Free and privacy-friendly. Falls back if unavailable.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">2. OpenAI (Priority: 5)</p>
              <p className="text-muted-foreground">
                Tries second. Reliable cloud provider. Falls back on API errors.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">3. Custom Server (Priority: 1)</p>
              <p className="text-muted-foreground">
                Last resort. Your own backend. Error thrown if this fails.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>Reliability:</strong> No single point of failure</p>
            <p>• <strong>Cost Optimization:</strong> Use free Chrome AI when available</p>
            <p>• <strong>Flexibility:</strong> Easy to add/remove providers</p>
            <p>• <strong>Graceful Degradation:</strong> Automatic fallback</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MultiProviderExample() {
  return (
    <div className="container py-8 md:py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-3">Multi-Provider Setup</h1>
        <p className="text-lg text-muted-foreground">
          Configure multiple AI providers with automatic fallback for maximum reliability.
        </p>
      </div>

      <AIFormProvider
        providers={[
          { type: 'chrome', priority: 10 },
        ]}
        fallbackOnError={true}
      >
        <MultiProviderForm />
      </AIFormProvider>
    </div>
  );
}
