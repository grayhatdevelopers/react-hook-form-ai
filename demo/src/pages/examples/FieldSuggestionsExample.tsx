import { useState } from 'react';
import { useForm } from 'react-hook-form-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Check, X } from 'lucide-react';

interface ProfileForm {
  username: string;
  email: string;
  bio: string;
  website: string;
}

export default function FieldSuggestionsExample() {
  const {
    register,
    handleSubmit,
    aiSuggest,
    setValue,
  } = useForm<ProfileForm>({
    ai: {
      enabled: true,
      debounceMs: 500,
    },
  });

  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const getSuggestion = async (fieldName: keyof ProfileForm) => {
    setLoadingField(fieldName);
    try {
      const suggestion = await aiSuggest(fieldName);
      if (suggestion) {
        setSuggestions((prev) => ({ ...prev, [fieldName]: suggestion }));
      }
    } catch (error) {
      console.error(`Failed to get suggestion for ${fieldName}:`, error);
    } finally {
      setLoadingField(null);
    }
  };

  const acceptSuggestion = (fieldName: keyof ProfileForm) => {
    const suggestion = suggestions[fieldName];
    if (suggestion) {
      setValue(fieldName, suggestion);
      dismissSuggestion(fieldName);
    }
  };

  const dismissSuggestion = (fieldName: string) => {
    setSuggestions((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const onSubmit = (data: ProfileForm) => {
    console.log('Form submitted:', data);
    alert('Profile saved! Check console for data.');
  };

  return (
    <div className="container py-8 md:py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-3">Field Suggestions Example</h1>
        <p className="text-lg text-muted-foreground">
          Get AI-powered suggestions for individual fields. Click the sparkle button next to any field.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Editor</CardTitle>
              <CardDescription>
                Get AI suggestions for each field individually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      {...register('username')}
                      placeholder="johndoe"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => getSuggestion('username')}
                      disabled={loadingField === 'username'}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestions.username && (
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Suggestion:</p>
                      <p className="text-sm">{suggestions.username}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => acceptSuggestion('username')}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => dismissSuggestion('username')}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => getSuggestion('email')}
                      disabled={loadingField === 'email'}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestions.email && (
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Suggestion:</p>
                      <p className="text-sm">{suggestions.email}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => acceptSuggestion('email')}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => dismissSuggestion('email')}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <div className="flex gap-2 items-start">
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => getSuggestion('bio')}
                      disabled={loadingField === 'bio'}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestions.bio && (
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Improved version:</p>
                      <p className="text-sm">{suggestions.bio}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => acceptSuggestion('bio')}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => dismissSuggestion('bio')}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex gap-2">
                    <Input
                      id="website"
                      {...register('website')}
                      placeholder="https://example.com"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => getSuggestion('website')}
                      disabled={loadingField === 'website'}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestions.website && (
                    <div className="bg-muted p-3 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Suggestion:</p>
                      <p className="text-sm">{suggestions.website}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => acceptSuggestion('website')}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => dismissSuggestion('website')}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-md">
                <code>{`const { 
  register, 
  aiSuggest, 
  setValue 
} = useForm<ProfileForm>({
  ai: {
    debounceMs: 500,
  }
});

const [suggestions, setSuggestions] = 
  useState<Record<string, string>>({});

const getSuggestion = async (
  fieldName: keyof ProfileForm
) => {
  const suggestion = 
    await aiSuggest(fieldName);
  if (suggestion) {
    setSuggestions(prev => ({
      ...prev,
      [fieldName]: suggestion
    }));
  }
};

const acceptSuggestion = (
  fieldName: keyof ProfileForm
) => {
  setValue(
    fieldName, 
    suggestions[fieldName]
  );
};`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                • <strong>Context-Aware:</strong> AI considers other field values
              </p>
              <p>
                • <strong>User Control:</strong> Review before accepting
              </p>
              <p>
                • <strong>Custom Debounce:</strong> Faster suggestions (500ms)
              </p>
              <p>
                • <strong>Individual Fields:</strong> Target specific fields
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
