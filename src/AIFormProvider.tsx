import React, { createContext, useContext, ReactNode } from 'react';
import type { AIProvider, AIFormContextValue, AIProviderType } from './types';

const AIFormContext = createContext<AIFormContextValue | null>(null);

/**
 * Props for the AIFormProvider component.
 * 
 * @public
 * @remarks
 * Configure AI providers globally for your application or a specific component tree.
 * All forms within the provider will inherit these settings unless overridden locally.
 */
export interface AIFormProviderProps {
  children: ReactNode;
  providers: AIProvider[];
  executionOrder?: AIProviderType[];
  fallbackOnError?: boolean;
  enabled?: boolean;
  debounceMs?: number;
  excludeFields?: string[];
  /** Global context for AI to use when filling forms (optional) */
  formContext?: string | Record<string, any>;
}

/**
 * Global AI configuration provider for React Hook Form AI.
 * 
 * @public
 * @remarks
 * Wrap your application or component tree with this provider to configure AI settings
 * globally. All `useForm` hooks within the provider will inherit these settings unless
 * overridden with local options.
 * 
 * @param props - Configuration options for AI providers
 * @returns Provider component wrapping children
 * 
 * @example Basic setup
 * ```tsx
 * <AIFormProvider
 *   providers={[
 *     { type: 'chrome', priority: 10 },
 *     { type: 'openai', apiKey: 'sk-...', priority: 5 }
 *   ]}
 *   fallbackOnError={true}
 * >
 *   <App />
 * </AIFormProvider>
 * ```
 * 
 * @example With custom execution order
 * ```tsx
 * <AIFormProvider
 *   providers={[
 *     { type: 'chrome', priority: 10 },
 *     { type: 'openai', apiKey: 'sk-...', priority: 5 },
 *     { type: 'custom', apiUrl: 'https://api.example.com', priority: 1 }
 *   ]}
 *   executionOrder={['chrome', 'openai', 'custom']}
 *   fallbackOnError={true}
 *   debounceMs={500}
 *   excludeFields={['password', 'ssn']}
 * >
 *   <App />
 * </AIFormProvider>
 * ```
 */
export function AIFormProvider({
  children,
  providers,
  executionOrder,
  fallbackOnError = true,
  enabled = true,
  debounceMs = 800,
  excludeFields = [],
}: AIFormProviderProps) {
  const sortedProviders = React.useMemo(() => {
    if (executionOrder && executionOrder.length > 0) {
      return executionOrder;
    }
    
    return providers
      .filter(p => p.enabled !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .map(p => p.type);
  }, [providers, executionOrder]);

  const contextValue: AIFormContextValue = {
    providers,
    executionOrder: sortedProviders,
    fallbackOnError,
    enabled,
    debounceMs,
    excludeFields,
  };

  return (
    <AIFormContext.Provider value={contextValue}>
      {children}
    </AIFormContext.Provider>
  );
}

/**
 * Hook to access AI form context from AIFormProvider.
 * 
 * @public
 * @remarks
 * This hook must be used within an AIFormProvider. It provides access to the global
 * AI configuration including providers, execution order, and other settings.
 * 
 * @returns The AI form context value
 * @throws Error if used outside of AIFormProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { providers, executionOrder } = useAIFormContext();
 *   // Use context values...
 * }
 * ```
 */
export function useAIFormContext(): AIFormContextValue {
  const context = useContext(AIFormContext);
  
  if (!context) {
    throw new Error('useAIFormContext must be used within AIFormProvider');
  }
  
  return context;
}

/**
 * Hook to optionally access AI form context from AIFormProvider.
 * 
 * @public
 * @remarks
 * Similar to `useAIFormContext` but returns null instead of throwing an error
 * when used outside of AIFormProvider. Useful for components that work with
 * or without the provider.
 * 
 * @returns The AI form context value or null if not within provider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const context = useOptionalAIFormContext();
 *   if (context) {
 *     // Use context values...
 *   } else {
 *     // Use default values...
 *   }
 * }
 * ```
 */
export function useOptionalAIFormContext(): AIFormContextValue | null {
  return useContext(AIFormContext);
}
