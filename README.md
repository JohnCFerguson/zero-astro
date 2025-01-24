# Zero Astro

Zero integration for Astro applications.

## Installation

```bash
# Using npm
npm install zero-astro

# Using yarn
yarn add zero-astro

# Using pnpm
pnpm add zero-astro

# Using astro cli
npx astro add zero-astro
```

## Setup

Configure Astro to use zero-astro:
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import zeroAstro from 'zero-astro';

export default defineConfig({
  integrations: [zeroAstro({
    projectId: 'your-project-id'
  })],
  output: 'server'
});
```

## Usage

Get a Zero client instance:
```ts
import { getZeroClient, QueryView } from 'zero-astro';

const zero = await getZeroClient({
  publicServer: import.meta.env.PUBLIC_SERVER || '',
  // ...any other config...
});
window.__ZERO_CLIENT__ = zero;

// Create a materialized query view
const view = zero.query.table.materialize();
const queryView = new QueryView(view);

// Subscribe to updates
const unsubscribe = queryView.addListener((data, resultType) => {
  if (resultType === 'complete') {
    // handle updates
    console.log('Data updated:', data);
  }
});

// Cleanup on unmount
window.addEventListener('unload', () => {
  unsubscribe();
  queryView.destroy();
});

// Mutate data with type safety:
await zero.mutate.table.insert({
  id: crypto.randomUUID(),
  // ...your data
});
```

## Additional Resources

See the examples for a complete reference on integrating Zero with Astro.