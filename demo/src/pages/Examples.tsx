import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Examples() {
  const examples = [
    {
      title: 'Basic Autofill',
      description: 'Simple form with AI autofill button. Perfect starting point.',
      path: '/examples/basic',
      difficulty: 'Beginner',
    },
    {
      title: 'Field Suggestions',
      description: 'Get AI suggestions for individual fields with accept/dismiss UI.',
      path: '/examples/field-suggestions',
      difficulty: 'Intermediate',
    },
    {
      title: 'Multi-Provider Setup',
      description: 'Configure multiple AI providers with automatic fallback.',
      path: '/examples/multi-provider',
      difficulty: 'Intermediate',
    },
    {
      title: 'Context-Aware AI',
      description: 'Use custom prompts to generate context-aware form data based on field values.',
      path: '/examples/context-ai',
      difficulty: 'Intermediate',
    },
    {
      title: 'Chrome AI Download',
      description: 'Handle Chrome AI model download with progress tracking.',
      path: '/examples/chrome-ai',
      difficulty: 'Advanced',
    },
  ];

  return (
    <div className="container py-8 md:py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] mb-3">
          Examples
        </h1>
        <p className="text-lg text-muted-foreground">
          Interactive examples showing different use cases and features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {examples.map((example) => (
          <Card
            key={example.path}
            className="flex flex-col transition-all duration-200 hover:shadow-lg hover:border-primary/20"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{example.title}</CardTitle>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {example.difficulty}
                </span>
              </div>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex items-end">
              <Link
                to={example.path}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200"
              >
                <span>View Example</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
