# Zero-Astro Integration

An Astro integration for Rocicorp Zero, enabling real-time data synchronization.

## Installation

```bash
pnpm add zero-astro
```

## Setup

Configure Astro to use zero-astro:
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import zeroAstro from 'zero-astro';

export default defineConfig({
  integrations: [zeroAstro()],
  output: 'server'
});
```

## Usage

Get a Zero client instance:
```ts
import { getZeroClient } from 'zero-astro;

const zero = await getZeroClient({
  publicServer: import.meta.env.PUBLIC_SERVER || '',
  // ...any other config...
});
window.__ZERO_CLIENT__ = zero;
```

Use Zero calls in your components:
```ts
zero.subscribe('table', (data) => {
  // handle updates
});

// Mutate data:
await zero.mutate.table.insert({ ... });
```

## Additional Resources

See the examples for a complete reference on integrating Zero with Astro.