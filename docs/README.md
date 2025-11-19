# Documentation

Welcome to the React Hook Form AI documentation!

## Documentation Structure

Our documentation is organized for easy LLM consumption and human readability:

### 📖 Core Documentation

- **[Getting Started](./GETTING_STARTED.md)** - Installation, basic usage, and key concepts
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation with all hooks, components, and types
- **[Provider Configuration](./PROVIDERS.md)** - Detailed guide for configuring AI providers
- **[Examples](./EXAMPLES.md)** - Practical examples for common use cases
- **[Browser Compatibility](./BROWSER_COMPATIBILITY.md)** - Browser requirements and compatibility information

### 🚀 Quick Links

**New to React Hook Form AI?**
Start with [Getting Started](./GETTING_STARTED.md)

**Looking for specific API details?**
Check the [API Reference](./API_REFERENCE.md)

**Need examples?**
Browse [Examples](./EXAMPLES.md)

**Setting up providers?**
Read [Provider Configuration](./PROVIDERS.md)

**Browser issues?**
See [Browser Compatibility](./BROWSER_COMPATIBILITY.md)

## Documentation Philosophy

Our documentation follows these principles:

1. **LLM-Friendly** - Structured for easy parsing by AI assistants
2. **Modular** - Each document covers a specific topic
3. **Practical** - Includes real-world examples
4. **Complete** - Comprehensive API coverage with TSDoc annotations
5. **Searchable** - Clear headings and table of contents

## Generating API Reference

The API reference is automatically generated from TSDoc comments in the source code:

```bash
npm run generate:api-reference
```

This command parses TSDoc comments from the source files and generates the API reference documentation.

## Contributing to Documentation

When contributing to the codebase:

1. **Add TSDoc comments** to all public APIs
2. **Include examples** in TSDoc comments
3. **Run the generator** to update API reference
4. **Update relevant docs** if adding new features

### TSDoc Example

```typescript
/**
 * Enhanced React Hook Form with AI-powered autofill.
 * 
 * @public
 * @remarks
 * A drop-in replacement for React Hook Form's useForm hook.
 * 
 * @param options - Form options with optional AI configuration
 * @returns Extended form object with AI capabilities
 * 
 * @example
 * ```tsx
 * const { register, aiAutofill } = useForm<FormData>();
 * ```
 */
export function useForm<T>(options?: UseFormProps<T>) {
  // ...
}
```

## Documentation Maintenance

### Updating Documentation

1. **Source Code Changes** - Update TSDoc comments in source files
2. **Generate API Docs** - Run `npm run generate:api-reference`
3. **Update Guides** - Modify relevant documentation files
4. **Test Examples** - Ensure all code examples work

### Documentation Checklist

- [ ] TSDoc comments added/updated
- [ ] API reference regenerated (`npm run generate:api-reference`)
- [ ] Examples tested
- [ ] Links verified
- [ ] Spelling checked

## Feedback

Found an issue or have a suggestion? Please [open an issue](https://github.com/grayhatdevelopers/react-hook-form-ai/issues) on GitHub.

---

<div align="center">
  <sub>Documentation maintained by the React Hook Form AI team</sub>
</div>
