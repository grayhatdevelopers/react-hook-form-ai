import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Download, CheckCircle, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { codeToHtml } from 'shiki';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const codeExample = `const {
  aiAutofill,
  aiLoading,
  aiAvailability,
  refreshAvailability,
  aiDownloadProgress,
} = useForm<FormData>({
  ai: {
    providers: [
      { type: 'chrome', priority: 10 }
    ],
    autoCheckAvailability: true,
  },
});

// Poll during download
useEffect(() => {
  if (aiAvailability?.status === 'downloading') {
    const interval = setInterval(
      () => refreshAvailability(),
      2000
    );
    return () => clearInterval(interval);
  }
}, [aiAvailability?.status]);

// Show download progress
{aiDownloadProgress !== null && (
  <progress 
    value={aiDownloadProgress} 
    max={100} 
  />
)}`;

export default function ChromeAIExample() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
    refreshAvailability,
    aiDownloadProgress,
  } = useForm<FormData>({
    ai: {
      providers: [{ type: 'chrome', priority: 10 }],
      autoCheckAvailability: true,
    },
  });

  const [downloadStarted, setDownloadStarted] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load and highlight code with Shiki
    codeToHtml(codeExample, {
      lang: 'typescript',
      theme: 'one-dark-pro'
    }).then(html => {
      setHighlightedCode(html);
    });
  }, []);

  useEffect(() => {
    if (aiAvailability?.status === 'downloading') {
      const interval = setInterval(async () => {
        await refreshAvailability();
      }, 2000);

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

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert('Message sent! Check console for data.');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    if (!aiAvailability) return <Loader2 className="h-5 w-5 animate-spin" />;
    
    switch (aiAvailability.status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'downloading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'downloadable':
        return <Download className="h-5 w-5 text-yellow-600" />;
      case 'unavailable':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    if (!aiAvailability) return 'Checking AI availability...';
    console.log('AI Availability:', aiAvailability);
    
    switch (aiAvailability.status) {
      case 'readily':
        return 'Chrome AI is ready to use';
      case 'available':
        return 'Chrome AI is available';
      case 'downloading':
        return 'Downloading AI model...';
      case 'downloadable':
        return 'AI model needs to be downloaded (click AI Autofill to start)';
      case 'unavailable':
        return 'Chrome AI is not available. Please check requirements.';
      default:
        return `AI Status: ${aiAvailability.status}`;
    }
  };

  return (
    <div className="container py-8 md:py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-3">Chrome AI Download Handling</h1>
        <p className="text-lg text-muted-foreground">
          Handle Chrome's AI model download with progress tracking and user feedback.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Status</CardTitle>
              <CardDescription>
                Current state of Chrome Built-in AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{getStatusMessage()}</p>
                  </div>
                </div>

                {aiDownloadProgress !== null && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Download Progress</span>
                      <span className="font-medium">{aiDownloadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${aiDownloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {aiAvailability?.status === 'downloadable' && !downloadStarted && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      The AI model (~1-2GB) needs to be downloaded. Click the AI Autofill
                      button to start the download.
                    </p>
                  </div>
                )}

                {aiAvailability?.status === 'unavailable' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      Chrome AI is not available
                    </p>
                    <p className="text-xs text-red-700">
                      Make sure you're using Chrome 139+ and have enabled the required flags.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                Try the AI autofill feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    {...register('message')}
                    placeholder="Your message here..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAutofillClick}
                    disabled={aiLoading || aiAvailability?.status === 'unavailable'}
                    className="flex-1"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Filling...
                      </>
                    ) : aiAvailability?.needsDownload ? (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download & Autofill
                      </>
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
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Implementation</CardTitle>
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
                    className="text-sm [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:m-0"
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
              <CardTitle>Chrome AI Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Browser Version</p>
                <p className="text-muted-foreground">
                  Chrome 139+ (Canary or Dev channel)
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Required Flags</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>chrome://flags/#optimization-guide-on-device-model</li>
                  <li>chrome://flags/#prompt-api-for-gemini-nano</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Model Download</p>
                <p className="text-muted-foreground">
                  ~1-2GB download required on first use. Requires user interaction to start.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                • <code className="bg-muted px-1 py-0.5 rounded">available</code> - AI is ready
              </p>
              <p>
                • <code className="bg-muted px-1 py-0.5 rounded">downloadable</code> - Needs download
              </p>
              <p>
                • <code className="bg-muted px-1 py-0.5 rounded">downloading</code> - Download in progress
              </p>
              <p>
                • <code className="bg-muted px-1 py-0.5 rounded">unavailable</code> - Not available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}