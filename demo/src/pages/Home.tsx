import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Code, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container relative">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            AI-Powered Form Validation
          </div>
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            React Hook Form meets AI
          </h1>
          <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
            A drop-in replacement for React Hook Form with AI-powered autofill and field suggestions.
            Supports Chrome Built-in AI, OpenAI, and custom providers.
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
            <Button size="default">
              <Link to="/get-started">
                Get Started
              </Link>
            </Button>
            <Button size="default" variant="outline">
              <Link to="/examples">View Examples</Link>
            </Button>
            <Button size="default" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <a href="https://react-hook-form.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                View React Hook Form Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 bg-slate-50 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Powerful AI features that integrate seamlessly with React Hook Form
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Sparkles className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>AI Autofill</CardTitle>
                    <CardDescription>
                      Generate realistic form data with a single click using AI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Zap className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>Smart Suggestions</CardTitle>
                    <CardDescription>
                      Get AI-powered suggestions for individual fields
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Shield className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>Multiple Providers</CardTitle>
                    <CardDescription>
                      Chrome AI, OpenAI, or your custom backend
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Code className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>Drop-in Replacement</CardTitle>
                    <CardDescription>
                      100% compatible with React Hook Form API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Sparkles className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>TypeScript First</CardTitle>
                    <CardDescription>
                      Full type safety and IntelliSense support
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Shield className="h-12 w-12" />
                  <div className="space-y-2">
                    <CardTitle>Privacy Focused</CardTitle>
                    <CardDescription>
                      On-device AI with Chrome Built-in AI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
      </section>
    </div>
  );
}