import { useForm } from 'react-hook-form-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

const codeExample = `import { useForm } from 'react-hook-form-ai';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

function ContactForm() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input 
        {...register('firstName', { 
          required: true 
        })} 
      />
      <input {...register('lastName')} />
      <input {...register('email')} />
      <input {...register('phone')} />
      <input {...register('company')} />
      
      <button 
        type="button"
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        AI Autofill
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}`;

export default function BasicExample() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
    formState: { errors },
  } = useForm<FormData>();

  const [highlightedCode, setHighlightedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load and highlight code with Shiki using a darker theme
    codeToHtml(codeExample, {
      lang: 'typescript',
      theme: 'one-dark-pro' // Darker theme options: 'one-dark-pro', 'tokyo-night', 'dracula', 'material-theme-darker'
    }).then(html => {
      setHighlightedCode(html);
    });
  }, []);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 md:py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-3">
          Basic Autofill Example
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple form with AI autofill functionality. Click the AI Autofill button to populate all fields.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                Fill out the form manually or use AI autofill
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName', { required: 'Last name is required' })}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
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

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => aiAutofill()}
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

                {aiAvailability && !aiAvailability.available && (
                  <p className="text-sm text-muted-foreground">
                    AI Status: {aiAvailability.status}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Code Example</CardTitle>
                <CardDescription>
                  Implementation of this form
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
                title="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md bg-[#0d1117]">
                {highlightedCode ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    className="text-sm [&_pre]:bg-[#0d1117]! [&_pre]:p-4! [&_pre]:m-0!"
                  />
                ) : (
                  <div className="bg-[#0d1117] p-4 rounded-md">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                1. The <code className="bg-muted px-1 py-0.5 rounded">aiAutofill()</code> function
                analyzes all registered fields
              </p>
              <p>
                2. AI generates contextually appropriate data for each field
              </p>
              <p>
                3. Form values are automatically populated
              </p>
              <p>
                4. Validation rules are respected
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}