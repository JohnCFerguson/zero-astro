# Zero Astro Integration

Astro integration for Rocicorp Zero.

## Installation

```bash
npm install zero-astro
```

## Usage

```typescript
// astro.config.mjs
import zero from 'zero-astro';

export default defineConfig({
  integrations: [zero()]
});
```

### Middleware

The integration adds a Zero client to your Astro context:

```typescript
import type { APIContext } from 'astro';

export async function GET({ locals }: APIContext) {
  const { zeroClient } = locals;
  // Use zeroClient here
}
```

## Configuration

No configuration required. The middleware automatically initializes the Zero client.

## Types

The package includes TypeScript definitions. The `ZeroLocals` interface is automatically added to your Astro's `Locals`.