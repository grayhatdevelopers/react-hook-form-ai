# Documentation Structure

This document explains the documentation structure for React Hook Form AI, designed for easy LLM consumption and better developer experience.

## Overview

The documentation has been restructured following the react-hook-form approach:

- **Modular** - Separate files for different topics
- **LLM-Friendly** - Structured for AI-assisted coding
- **Comprehensive** - Complete API coverage with examples
- **Maintainable** - Auto-generated from TSDoc comments

## File Structure

```
react-hook-form-ai/
├── README.md                          # Concise overview with links
├── docs/
│   ├── README.md                      # Documentation index
│   ├── API_REFERENCE.md               # Complete API documentation
│   ├── PROVIDERS.md                   # Provider configuration guide
│   ├── EXAMPLES.md                    # Practical examples
│   └── logo.png                       # Logo image
├── src/
│   ├── useForm.ts                     # Enhanced with TSDoc
│   ├── AIFormProvider.tsx             # Enhanced with TSDoc
│   ├── utils/useAIAssistant.ts        # Enhanced with TSDoc
│   └── types/ai.ts                    # Enhanced with TSDoc
├── tsdoc.json                         # TSDoc configuration
├── tsdoc-markdown.config.js           # API generator config
└── package.json                       # Added generate:api-reference script
```

## Documentation Files

### README.md (Root)

**Purpose:** Quick overview and navigation hub

**Content:**
- Feature highlights
- Quick start example
- Links to detailed documentation
- API overview
- Browser compatibility table

**Target Audience:** New users, quick reference

### docs/GETTING_STARTED.md

**Purpose:** Onboarding guide for new users

**Content:**
- Installation instructions
- Basic usage examples
- Key concepts explanation
- Next steps

**Target Audience:** Developers new to the library

### docs/API_REFERENCE.md

**Purpose:** Complete API documentation

**Content:**
- All hooks with signatures
- All components with props
- All interfaces and types
- Usage examples for each API
- Parameter descriptions
- Return value descriptions

**Target Audience:** Developers needing detailed API information, LLMs

**Generation:** Auto-generated from TSDoc comments via `npm run generate:api-reference`

### docs/PROVIDERS.md

**Purpose:** Detailed provider configuration guide

**Content:**
- Chrome Built-in AI setup
- OpenAI configuration
- Custom server setup
- Browser AI configuration
- Multi-provider setup
- Security best practices

**Target Audience:** Developers configuring AI providers

### docs/EXAMPLES.md

**Purpose:** Practical usage examples

**Content:**
- Multi-provider setup
- Field-level suggestions
- Chrome AI download handling
- Excluding sensitive fields
- Custom debounce timing
- Partial form autofill
- Context-aware suggestions

**Target Audience:** Developers implementing specific features

## TSDoc Annotations

All public APIs now have comprehensive TSDoc comments:

### Example Structure

```typescript
/**
 * Brief description of the function/interface.
 * 
 * @public
 * @remarks
 * Detailed explanation of the API, its purpose, and behavior.
 * 
 * @typeParam T - Description of type parameter
 * @param paramName - Description of parameter
 * @returns Description of return value
 * 
 * @example Basic usage
 * ```tsx
 * // Example code
 * ```
 * 
 * @example Advanced usage
 * ```tsx
 * // More complex example
 * ```
 */
```

### Files with TSDoc

- `src/useForm.ts` - useForm hook and related interfaces
- `src/AIFormProvider.tsx` - AIFormProvider component and hooks
- `src/utils/useAIAssistant.ts` - useAIAssistant hook
- `src/types/ai.ts` - All AI-related types

## Generating API Reference

### Command

```bash
npm run generate:api-reference
# or
pnpm run generate:api-reference
```

### Process

1. Parses TSDoc comments from source files
2. Generates markdown documentation
3. Outputs to `docs/API_REFERENCE.md`

### When to Regenerate

- After adding new public APIs
- After updating TSDoc comments
- After changing function signatures
- Before releasing new versions

## Benefits for LLM Consumption

### 1. Modular Structure

Each document covers a specific topic, making it easy for LLMs to:
- Find relevant information quickly
- Provide focused answers
- Reference specific sections

### 2. Consistent Format

All documentation follows consistent patterns:
- Clear headings and subheadings
- Code examples with syntax highlighting
- Parameter descriptions
- Return value descriptions

### 3. Complete Examples

Every API includes working examples that LLMs can:
- Reference for code generation
- Adapt to user needs
- Combine for complex scenarios

### 4. Cross-References

Documents link to related content:
- API Reference ↔ Examples
- Getting Started → Provider Configuration
- Browser Compatibility → Provider Configuration

## Maintenance Workflow

### Adding New Features

1. **Write Code** with TSDoc comments
   ```typescript
   /**
    * New feature description
    * @example
    * ```tsx
    * // Usage example
    * ```
    */
   export function newFeature() { }
   ```

2. **Generate API Docs**
   ```bash
   npm run generate:api-reference
   ```

3. **Update Relevant Guides**
   - Add to EXAMPLES.md with practical examples
   - Update PROVIDERS.md if it affects configuration

4. **Update README.md**
   - Add to features list if significant
   - Update quick start if relevant

### Updating Existing Features

1. **Update TSDoc** in source files
2. **Regenerate API docs**
3. **Update examples** if behavior changed
4. **Update guides** if configuration changed

## Best Practices

### For Contributors

1. **Always add TSDoc** to public APIs
2. **Include examples** in TSDoc comments
3. **Regenerate API docs** before committing
4. **Test examples** to ensure they work
5. **Update guides** for significant changes

### For Maintainers

1. **Review TSDoc** in pull requests
2. **Ensure examples work** before merging
3. **Keep docs in sync** with code
4. **Update version** in documentation
5. **Announce breaking changes** clearly

## Feedback

Documentation improvements are always welcome! Please:

1. Open an issue for suggestions
2. Submit PRs for corrections
3. Share your use cases for better examples

---

**Last Updated:** November 2025
**Maintained By:** React Hook Form AI Team
