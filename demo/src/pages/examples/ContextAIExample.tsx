import { useForm } from 'react-hook-form-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Copy, Check, Info } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { codeToHtml } from 'shiki';

interface JobApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string;
  education: string;
  coverLetter: string;
}

const codeExample = `import { useForm } from 'react-hook-form-ai';
import { useState, useMemo } from 'react';

interface JobApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string;
  education: string;
  coverLetter: string;
}

function JobApplicationForm() {
  const [contextEnabled, setContextEnabled] = useState(true);
  const [contextType, setContextType] = useState('senior');
  const [customContext, setCustomContext] = useState('');

  const contextDescriptions = {
    senior: 'Senior Software Engineer with 8+ years...',
    junior: 'Junior Developer with 2 years...',
    intern: 'Computer Science student...',
  };

  // FIX: Compute active context reactively
  const activeContext = useMemo(() => {
    if (!contextEnabled) return undefined;
    if (contextType === 'custom') {
      return customContext.trim() || undefined;
    }
    return contextDescriptions[contextType];
  }, [contextEnabled, contextType, customContext]);

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    reset,
  } = useForm<JobApplicationForm>({
    ai: {
      enabled: true,
      formContext: activeContext, // Now updates reactively
    },
  });

  const onSubmit = (data) => {
    console.log('Application submitted:', data);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={contextEnabled}
          onChange={(e) => setContextEnabled(e.target.checked)}
        />
        Enable AI Context
      </label>

      <select
        value={contextType}
        onChange={(e) => setContextType(e.target.value)}
      >
        <option value="senior">Senior Engineer</option>
        <option value="junior">Junior Developer</option>
        <option value="intern">Intern</option>
        <option value="custom">Custom Context</option>
      </select>

      {contextType === 'custom' && (
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          placeholder="Enter applicant context..."
        />
      )}

      <input {...register('firstName')} />
      <input {...register('lastName')} />
      <input {...register('email')} />
      <input {...register('phone')} />
      <input {...register('position')} />
      <input {...register('experience')} />
      <textarea {...register('skills')} />
      <input {...register('education')} />
      <textarea {...register('coverLetter')} />

      <button 
        type="button"
        onClick={() => aiAutofill()}
        disabled={aiLoading}
      >
        AI Autofill
      </button>
      <button type="button" onClick={() => reset()}>
        Clear
      </button>
      <button onClick={handleSubmit(onSubmit)}>
        Submit
      </button>
    </div>
  );
}`;

export default function ContextFormExample() {
  const [contextEnabled, setContextEnabled] = useState(true);
  const [contextType, setContextType] = useState<'senior' | 'junior' | 'intern' | 'custom'>('senior');
  const [customContext, setCustomContext] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const contextDescriptions = {
    senior: 'Senior Software Engineer with 8+ years of experience in full-stack development, specializing in React, Node.js, and cloud architecture',
    junior: 'Junior Developer with 2 years of experience, eager to learn and grow in web development',
    intern: 'Computer Science student seeking internship opportunity, passionate about learning software development',
  };

  // FIX: Compute active context reactively using useMemo
  const activeContext = useMemo(() => {
    if (!contextEnabled) return undefined;
    if (contextType === 'custom') {
      return customContext.trim() || undefined;
    }
    return contextDescriptions[contextType];
  }, [contextEnabled, contextType, customContext]);

  // Helper for display purposes only
  const displayContext = contextType === 'custom' 
    ? (customContext || 'Enter your custom context below')
    : contextDescriptions[contextType];

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
    reset,
    formState: { errors },
  } = useForm<JobApplicationForm>({
    ai: {
      enabled: true,
      formContext: activeContext, // Now updates reactively when dependencies change
    },
  });

  useEffect(() => {
    codeToHtml(codeExample, {
      lang: 'typescript',
      theme: 'one-dark-pro'
    }).then(html => {
      setHighlightedCode(html);
    });
  }, []);

  const onSubmit = (data: JobApplicationForm) => {
    console.log('Application submitted:', data);
    alert('Application submitted! Check console for data.');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-3">
          Context-Aware Job Application Form
        </h1>
        <p className="text-lg text-muted-foreground">
          This form uses AI context to provide relevant suggestions based on the applicant's profile. Toggle context on/off and switch between profiles to see how AI adapts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Context Settings</CardTitle>
              <CardDescription>
                Configure the applicant profile to guide AI suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="contextEnabled"
                  checked={contextEnabled}
                  onChange={(e) => setContextEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="contextEnabled" className="cursor-pointer">
                  Enable AI Context
                </Label>
              </div>

              {contextEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="contextType">Applicant Profile</Label>
                    <select
                      id="contextType"
                      value={contextType}
                      onChange={(e) => setContextType(e.target.value as any)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="senior">Senior Engineer</option>
                      <option value="junior">Junior Developer</option>
                      <option value="intern">Intern</option>
                      <option value="custom">Custom Context</option>
                    </select>
                  </div>

                  {contextType === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customContext">Custom Context</Label>
                      <Textarea
                        id="customContext"
                        value={customContext}
                        onChange={(e) => setCustomContext(e.target.value)}
                        placeholder="Enter your custom context here... (e.g., 'Experienced data scientist applying for ML engineer role')"
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe the applicant's background, experience, or any relevant details to guide the AI.
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Active Context:</p>
                        <p className="text-sm text-blue-700 mt-1">{displayContext}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Application</CardTitle>
              <CardDescription>
                Fill out the form manually or use AI to autofill based on the selected profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
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
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Last name is required' })}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
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
                  <Label htmlFor="position">Position Applied For *</Label>
                  <Input
                    id="position"
                    {...register('position', { required: 'Position is required' })}
                    placeholder="Software Engineer"
                  />
                  {errors.position && (
                    <p className="text-sm text-destructive">{errors.position.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    {...register('experience')}
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <Textarea
                    id="skills"
                    {...register('skills')}
                    placeholder="React, TypeScript, Node.js..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    {...register('education')}
                    placeholder="Bachelor's in Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    {...register('coverLetter')}
                    placeholder="Write your cover letter here..."
                    rows={5}
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
                      <>Processing...</>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Autofill
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button onClick={handleSubmit(onSubmit)} className="flex-1">
                    Submit Application
                  </Button>
                </div>

                {aiAvailability && !aiAvailability.available && (
                  <p className="text-sm text-muted-foreground text-center">
                    AI Status: {aiAvailability.status}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Code Example</CardTitle>
                <CardDescription>
                  Implementation with context-aware AI
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

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                1. Select a pre-defined profile or create a custom context describing the applicant
              </p>
              <p>
                2. The <code className="bg-muted px-1 py-0.5 rounded">formContext</code> option
                passes this context to the AI
              </p>
              <p>
                3. Click "AI Autofill" to generate relevant application data based on the context
              </p>
              <p>
                4. The AI adapts its suggestions to match the selected profile
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Context Examples to Try</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong>Career Changer:</strong> "Former teacher transitioning to software development, completed coding bootcamp"
              </p>
              <p className="text-muted-foreground">
                <strong>Specialist:</strong> "DevOps engineer with 5 years experience in Kubernetes and AWS"
              </p>
              <p className="text-muted-foreground">
                <strong>Freelancer:</strong> "Independent contractor specializing in mobile app development"
              </p>
              <p className="text-muted-foreground">
                <strong>Manager:</strong> "Engineering manager with 10+ years leading teams of 15+ developers"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}