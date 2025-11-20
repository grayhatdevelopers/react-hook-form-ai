import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function GetStarted() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCommand = 'npm install react-hook-form-ai';
  const basicExample = `import { useForm } from 'react-hook-form-ai';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

function App() {
  const { register, handleSubmit, aiAutofill, aiLoading } = 
    useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <input {...register('email')} placeholder="Email" />
      
      <button 
        type="button" 
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        {aiLoading ? 'Filling...' : 'AI Autofill'}
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}`;

  const providerExample = `import { AIFormProvider } from 'react-hook-form-ai';

function Root() {
  return (
    <AIFormProvider
      providers={[
        { type: 'chrome', priority: 10 },
        { 
          type: 'openai', 
          apiKey: 'sk-...', 
          priority: 5 
        }
      ]}
      fallbackOnError={true}
    >
      <App />
    </AIFormProvider>
  );
}`;

  return (
    <div className="container py-8 md:py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] mb-3">Get Started</h1>
        <p className="text-lg text-muted-foreground">
          Add AI-powered features to your React forms in minutes
        </p>
      </div>

      <div className="space-y-8">
        {/* Installation */}
        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>
              Install the package using your preferred package manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
                <code>{installCommand}</code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-slate-50 hover:bg-slate-800"
                onClick={() => copyToClipboard(installCommand, 'install')}
              >
                {copied === 'install' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Or with pnpm:</p>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>pnpm add react-hook-form-ai</code>
              </pre>
              <p className="text-sm text-muted-foreground">Or with yarn:</p>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>yarn add react-hook-form-ai</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Basic Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
            <CardDescription>
              Replace your React Hook Form import and start using AI features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>{basicExample}</code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-slate-50 hover:bg-slate-800"
                onClick={() => copyToClipboard(basicExample, 'basic')}
              >
                {copied === 'basic' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Provider Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configure AI Providers</CardTitle>
            <CardDescription>
              Set up multiple AI providers with automatic fallback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>{providerExample}</code>
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-slate-50 hover:bg-slate-800"
                onClick={() => copyToClipboard(providerExample, 'provider')}
              >
                {copied === 'provider' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chrome AI Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Chrome Built-in AI Setup</CardTitle>
            <CardDescription>
              Enable Chrome's on-device AI for privacy-first autofill
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Chrome 139+ (Canary or Dev channel)</li>
                <li>Enable chrome://flags/#optimization-guide-on-device-model</li>
                <li>Enable chrome://flags/#prompt-api-for-gemini-nano</li>
                <li>Restart Chrome</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">First Use:</h4>
              <p className="text-sm text-muted-foreground">
                The AI model (~1-2GB) will download on first use. Use the{' '}
                <code className="bg-muted px-1 py-0.5 rounded">aiDownloadProgress</code> and{' '}
                <code className="bg-muted px-1 py-0.5 rounded">aiAvailability</code> properties
                to show download status to users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Explore examples and learn more about advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Check out the examples:</h4>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="/examples/basic">Basic Autofill Example</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="/examples/field-suggestions">Field Suggestions</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="/examples/multi-provider">Multi-Provider Setup</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="/examples/chrome-ai">Chrome AI Download Handling</Link>
                    </Button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Learn more:</h4>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="https://github.com/grayhatdevelopers/react-hook-form-ai" target="_blank" rel="noopener noreferrer">
                        GitHub Repository
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0">
                      <Link to="https://www.npmjs.com/package/react-hook-form-ai" target="_blank" rel="noopener noreferrer">
                        NPM Package
                      </Link>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
