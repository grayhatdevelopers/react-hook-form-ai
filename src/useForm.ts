import {
  useForm as useReactHookForm,
  UseFormProps,
  FieldValues,
  Path,
  UseFormReturn,
  UseFormRegisterReturn,
} from "react-hook-form";
import { useAIAssistant } from "./utils/useAIAssistant";
import { useOptionalAIFormContext } from "./AIFormProvider";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import type { AIProvider, AIProviderType } from "./types";

/**
 * Configuration options for AI features in the form.
 * 
 * @public
 * @remarks
 * These options can be passed to the `useForm` hook via the `ai` property to configure
 * AI-powered autofill and suggestions. Local options override global settings from `AIFormProvider`.
 * 
 * @example
 * ```tsx
 * const form = useForm<FormData>({
 *   ai: {
 *     enabled: true,
 *     debounceMs: 500,
 *     excludeFields: ['password', 'creditCard'],
 *     providers: [
 *       { type: 'chrome', priority: 10 },
 *       { type: 'openai', apiKey: 'sk-...', priority: 5 }
 *     ]
 *   }
 * });
 * ```
 */
export interface AIFormOptions {
  /** Enable AI features (default: true) */
  enabled?: boolean;
  /** API endpoint for AI fallback */
  apiUrl?: string;
  /** Debounce time in ms for AI suggestions (default: 800) */
  debounceMs?: number;
  /** Fields to exclude from AI processing */
  excludeFields?: string[];
  /** Auto-check availability on mount */
  autoCheckAvailability?: boolean;
  /** Override providers from AIFormProvider */
  providers?: AIProvider[];
  /** Override execution order from AIFormProvider */
  executionOrder?: AIProviderType[];
  /** Override fallback behavior from AIFormProvider */
  fallbackOnError?: boolean;
  /** Context for AI to use when filling forms (optional) */
  formContext?: string | Record<string, any>;
}

/**
 * Extended return type from `useForm` hook with AI capabilities.
 * 
 * @public
 * @remarks
 * This interface extends the standard React Hook Form return type with additional
 * AI-powered properties and methods for autofill, suggestions, and availability checking.
 * 
 * @typeParam T - The form data type extending FieldValues
 * 
 * @example
 * ```tsx
 * const {
 *   register,
 *   handleSubmit,
 *   aiAutofill,
 *   aiLoading,
 *   aiAvailability
 * } = useForm<FormData>();
 * ```
 */
export interface UseFormAIReturn<T extends FieldValues> extends UseFormReturn<T> {
  /** AI feature enabled state */
  aiEnabled: boolean;
  /** Trigger AI autofill for all or specific fields */
  aiAutofill: (fields?: Path<T>[]) => Promise<void>;
  /** Get AI suggestion for a specific field */
  aiSuggest: (fieldName: Path<T>) => Promise<string | null>;
  /** Check if AI is currently processing */
  aiLoading: boolean;
  /** AI availability status */
  aiAvailability: {
    available: boolean;
    status: string;
    needsDownload: boolean;
  } | null;
  /** Refresh AI availability check */
  refreshAvailability: () => Promise<void>;
  /** Download progress (0-100) when model is downloading */
  aiDownloadProgress: number | null;
}

/**
 * Enhanced React Hook Form with AI-powered autofill and field suggestions.
 * 
 * @public
 * @remarks
 * A drop-in replacement for React Hook Form's `useForm` hook that adds AI capabilities
 * including autofill, field suggestions, and availability checking. Supports multiple
 * AI providers (Chrome Built-in AI, OpenAI, Custom Server) with automatic fallback.
 * 
 * @typeParam T - The form data type extending FieldValues
 * @param options - Standard React Hook Form options plus optional AI configuration
 * @returns Extended form object with AI capabilities
 * 
 * @example Basic usage
 * ```tsx
 * const { register, handleSubmit, aiAutofill } = useForm<FormData>();
 * 
 * return (
 *   <form onSubmit={handleSubmit(onSubmit)}>
 *     <input {...register('name')} />
 *     <button type="button" onClick={() => aiAutofill()}>
 *       AI Autofill
 *     </button>
 *   </form>
 * );
 * ```
 * 
 * @example With AI configuration
 * ```tsx
 * const form = useForm<FormData>({
 *   ai: {
 *     enabled: true,
 *     debounceMs: 500,
 *     excludeFields: ['password'],
 *     providers: [
 *       { type: 'chrome', priority: 10 },
 *       { type: 'openai', apiKey: 'sk-...', priority: 5 }
 *     ]
 *   }
 * });
 * ```
 * 
 * @example Handling Chrome AI download
 * ```tsx
 * const { aiAvailability, aiDownloadProgress, aiAutofill } = useForm<FormData>();
 * 
 * if (aiAvailability?.needsDownload) {
 *   return <button onClick={() => aiAutofill()}>Download AI Model</button>;
 * }
 * 
 * if (aiAvailability?.status === 'downloading') {
 *   return <progress value={aiDownloadProgress || 0} max={100} />;
 * }
 * ```
 */
export function useForm<T extends FieldValues>(
  options?: UseFormProps<T> & {
    ai?: AIFormOptions;
  }
): UseFormAIReturn<T> {
  const { ai: aiOptions, ...rhfOptions } = options || {};
  const providerContext = useOptionalAIFormContext();
  
  // Merge provider context with local options (local options take precedence)
  const mergedConfig = useMemo(() => {
    const {
      enabled: localEnabled,
      apiUrl,
      debounceMs: localDebounce,
      excludeFields: localExclude,
      autoCheckAvailability = true,
      providers: localProviders,
      executionOrder: localOrder,
      fallbackOnError: localFallback,
      formContext: localFormContext,
    } = aiOptions || {};

    return {
      enabled: localEnabled ?? providerContext?.enabled ?? true,
      apiUrl: apiUrl ?? 'http://localhost:3001',
      debounceMs: localDebounce ?? providerContext?.debounceMs ?? 800,
      excludeFields: localExclude ?? providerContext?.excludeFields ?? [],
      autoCheckAvailability,
      providers: localProviders ?? providerContext?.providers,
      executionOrder: localOrder ?? providerContext?.executionOrder,
      fallbackOnError: localFallback ?? providerContext?.fallbackOnError ?? true,
      formContext: localFormContext ?? providerContext?.formContext,
    };
  }, [aiOptions, providerContext]);

  const {
    enabled: aiEnabled,
    apiUrl,
    debounceMs,
    excludeFields,
    autoCheckAvailability,
    providers,
    executionOrder,
    fallbackOnError,
    formContext: configFormContext,
  } = mergedConfig;

  const form = useReactHookForm<T>(rhfOptions);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDownloadProgress, setAiDownloadProgress] = useState<number | null>(null);
  const [aiAvailability, setAiAvailability] = useState<{
    available: boolean;
    status: string;
    needsDownload: boolean;
  } | null>(null);
  
  // Track debounce timers
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Get current form values for context
  const formValues = form.watch();

  // Merge form values with configured context
  const mergedFormContext = useMemo(() => {
    if (typeof configFormContext === 'string') {
      return { ...formValues, _context: configFormContext };
    } else if (configFormContext) {
      return { ...formValues, ...configFormContext };
    }
    return formValues;
  }, [formValues, configFormContext]);

  // Initialize AI assistant with form context and overrides
  const ai = useAIAssistant({
    enabled: aiEnabled,
    formContext: mergedFormContext,
    apiUrl,
    providers,
    executionOrder,
    fallbackOnError,
  });

  // Check availability on mount
  useEffect(() => {
    if (autoCheckAvailability && aiEnabled) {
      void refreshAvailability();
    }
    
    // Cleanup debounce timers on unmount
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiEnabled, autoCheckAvailability]);

  /**
   * Refresh AI availability status
   */
  const refreshAvailability = useCallback(async () => {
    try {
      const status = await ai.checkAvailability();
      setAiAvailability(status);
      
      if (status.needsDownload) {
        console.log('Chrome AI model requires download. User interaction needed to start download.');
      } else if (status.status === 'downloading') {
        console.log('Chrome AI model is currently downloading...');
      } else if (status.available) {
        console.log('Chrome AI is ready to use!');
      }
    } catch (err) {
      console.error('Failed to check AI availability:', err);
      setAiAvailability({
        available: false,
        status: 'error',
        needsDownload: false
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Enhanced register that integrates AI suggestions on blur
   */
  const registerWithAI = useCallback(
    <TFieldName extends Path<T>>(
      name: TFieldName,
      rules?: Parameters<UseFormReturn<T>["register"]>[1]
    ): UseFormRegisterReturn<TFieldName> => {
      const baseRegister = form.register<TFieldName>(name, rules as Parameters<typeof form.register<TFieldName>>[1]);

      if (!aiEnabled || excludeFields.includes(String(name))) {
        return baseRegister;
      }

      const enhancedRegister: UseFormRegisterReturn<TFieldName> = {
        ...baseRegister,
        onBlur: async (e: any) => {
          // Call original onBlur first
          await baseRegister.onBlur?.(e);

          // Clear existing timer for this field
          const timerId = debounceTimers.current.get(String(name));
          if (timerId) clearTimeout(timerId);

          // Set new debounced timer
          const newTimer = setTimeout(async () => {
            const value = e?.target?.value;
            
            // Only suggest if there's a value
            if (value && value.trim().length > 0) {
              try {
                const suggestion = await ai.suggestValue(String(name), value);
                
                // Optionally auto-apply suggestion or show it to user
                if (suggestion && suggestion !== value) {
                  console.log(`💡 Suggestion for "${String(name)}": ${suggestion}`);
                  // You could add logic here to show the suggestion to the user
                  // and let them accept/reject it
                }
              } catch (err) {
                console.error(`Error getting suggestion for ${String(name)}:`, err);
              }
            }
          }, debounceMs);

          debounceTimers.current.set(String(name), newTimer);
        },
      };

      return enhancedRegister;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, aiEnabled, excludeFields, debounceMs]
  );

  /**
   * AI-powered autofill for all or specific fields
   */
  const aiAutofill = useCallback(
    async (fields?: Path<T>[]): Promise<void> => {
      if (!aiEnabled) {
        console.warn('AI is disabled for this form');
        return;
      }

      // Check if AI is available
      if (aiAvailability && !aiAvailability.available) {
        console.warn(`AI is not available. Status: ${aiAvailability.status}`);
        if (aiAvailability.needsDownload) {
          console.log('Attempting to trigger model download...');
        }
        // Continue anyway to attempt download or use fallback
      }

      setAiLoading(true);
      setAiDownloadProgress(null);

      try {
        // Get all registered field names
        const currentValues = form.getValues();
        const targetFields = fields || (Object.keys(currentValues) as Path<T>[]);
        
        // Filter out excluded fields
        const fieldsToFill = targetFields.filter(
          field => !excludeFields.includes(String(field))
        );

        if (fieldsToFill.length === 0) {
          console.warn('No fields to autofill');
          return;
        }

        const autofillData = await ai.autofill(fieldsToFill.map(String), {
          onDownloadProgress: (progress) => {
            setAiDownloadProgress(progress);
          },
        });
        
        // Apply autofilled values
        for (const [name, value] of Object.entries(autofillData)) {
          if (fieldsToFill.some(f => String(f) === name)) {
            form.setValue(name as Path<T>, value as any, {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true,
            });
          }
        }
        
        console.log('✅ Autofill completed successfully');
      } catch (error) {
        console.error('AI autofill failed:', error);
        throw error;
      } finally {
        setAiLoading(false);
        setAiDownloadProgress(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, aiEnabled, excludeFields, aiAvailability]
  );

  /**
   * Get AI suggestion for a specific field
   */
  const aiSuggest = useCallback(
    async (fieldName: Path<T>): Promise<string | null> => {
      if (!aiEnabled) {
        console.warn('AI is disabled');
        return null;
      }

      setAiLoading(true);

      try {
        const currentValue = form.getValues(fieldName);
        const suggestion = await ai.suggestValue(
          String(fieldName), 
          String(currentValue || '')
        );
        
        return suggestion;
      } catch (error) {
        console.error('AI suggest failed:', error);
        return null;
      } finally {
        setAiLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, aiEnabled]
  );

  return {
    ...form,
    register: registerWithAI as UseFormReturn<T>["register"],
    aiEnabled,
    aiAutofill,
    aiSuggest,
    aiLoading,
    aiAvailability,
    refreshAvailability,
    aiDownloadProgress,
  };
}