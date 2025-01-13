# Development Standards

## Technology Stack

- Frontend: Astro with Web Components
- Styling: Vanilla CSS (no Tailwind)
- Types: TypeScript with strict typing
- Database: Zero Sync/Postgresql 15

## TypeScript Standards

- Use strict type checking
- Avoid `any` type
- Generate interfaces for missing types
- Use proper type guards
- Prefer type inference where possible

## Code Organization

- Use feature-based folder structure
- Keep components single-responsibility
- Maintain clear type definitions
- Follow proper naming conventions

## Style Guidelines

- Use vanilla CSS with CSS variables
- Maintain consistent class naming
- Follow BEM methodology
- Use responsive design patterns

## Best Practices

- Always use #codebase context
- Write self-documenting code
- Include proper error handling
- Add type documentation
- Follow SOLID and ACID principles

## Example Patterns

```typescript
// Component props interface
interface ComponentProps {
  data: DataType;
  onAction: (id: string) => Promise<void>;
}

// Type guard example
function isValidResponse(data: unknown): data is ApiResponse {
  return typeof data === "object" && data !== null && "id" in data;
}
```

## File Organization & Code Practices

### Project Structure

```
/zero-astro/
├── .github/                    # Repository documentation
├── .vscode/                    # Editor configuration
├── zero-astro-integration/     # Main package
│   ├── src/                    # Source code ONLY
│   │   ├── lib/
│   │   ├── components/
│   │   └── types/
│   ├── package.json          # Package configuration
│   └── tsconfig.json         # TypeScript configuration
├── tsconfig.json             # Root TypeScript configuration
├── .env                      # Environment variables
└── README.md                 # Project documentation
```

### File Location Rules

1. Source code (.astro, .ts, .js) MUST be in `/zero-astro-integration/src/`
2. Configuration files can exist at root or package level:
   - Root level: tsconfig.json, .env, .gitignore
   - Package level: package.json, tsconfig.json
3. Documentation can exist at any level:
   - Root level: README.md
   - .github/: custom-instructions.md, CONTRIBUTING.md
   - Package level: README.md

### File Naming Conventions

- `.astro.ts` - Astro-specific TypeScript files
- `.astro` - Astro components
- `.ts` - Regular TypeScript files

### Critical Rules

1. Never create or modify files in a top-level `/src/` directory
2. All source code MUST be placed in `/zero-astro-integration/src/`
3. Follow the established directory structure
4. Check existing files before creating new ones

### Common Mistakes to Avoid

1. Creating new files instead of modifying existing ones
2. Placing files in wrong directories

### Code Block Template

```typescript
// filepath: /full/path/to/file
// ...existing code...
{ changed code }
// ...existing code...
```

# Project Integration References

## Zero Framework Integrations

This project references the following integrations as examples:

### React Integration

- Using `@rocicorp/zero/react` for React components integration
- [Official Zero React Integration](https://github.com/rocicorp/zero/tree/main/react)

### Svelte Integration

- Based on `zero-svelte` integration example
- [Zero Svelte Integration Repository](https://github.com/stolinski/zero-svelte)

## Development Context

The project uses Zero as the database layer with custom integrations for both React and Svelte patterns. These integrations serve as reference implementations for building similar patterns in other frameworks.

### Key Integration Patterns

- State management
- Real-time synchronization
- Framework-specific bindings
