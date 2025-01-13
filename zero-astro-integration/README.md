# Zero Astro

Zero Sync integration for Astro applications. Provides real-time synchronization and offline-first capabilities using [Zero](https://zero.rocicorp.dev/).

## Installation

```bash
npm install zero-astro @rocicorp/zero
```

## Quick Start

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import zero from 'zero-astro';

export default defineConfig({
  integrations: [zero()]
});
```

```astro
---
// src/pages/index.astro
import { getZeroClient } from 'zero-astro';
import { ZeroProvider } from 'zero-astro/components';

const client = await getZeroClient({
  url: import.meta.env.PUBLIC_ZERO_URL,
  authToken: import.meta.env.PUBLIC_ZERO_AUTH_TOKEN
});
---

<ZeroProvider client={client}>
  <App />
</ZeroProvider>
```

## Features

- ✅ Server-side data fetching
- ✅ Client-side hydration
- ✅ Real-time updates
- ✅ Type-safe queries and mutations
- ✅ Automatic error handling
- ✅ Subscription management

## API Reference

### Z Class

The main Zero client wrapper:

```ts
import { Z } from 'zero-astro';

const z = new Z({
  server: 'https://your-zero-server.com',
  userID: 'user-123',
  schema: {
    version: 1,
    tables: {
      todos: {
        version: 1
      }
    }
  }
});
```

### Queries

```astro
---
import { ZeroQuery } from 'zero-astro/components';

const query = z.createQuery(tx => tx.get('todos'));
---

<ZeroQuery {query}>
  {(data) => (
    <ul>
      {data?.map(todo => <li>{todo.title}</li>)}
    </ul>
  )}
</ZeroQuery>
```

### Mutations

```ts
const mutation = z.mutate(
  async (tx, params: { title: string }) => {
    await tx.put('todos', {
      id: crypto.randomUUID(),
      title: params.title
    });
  },
  { title: 'New Todo' }
);
```

## Configuration

```ts
type ZeroConfig = {
  authToken?: string;
  url: string;
};

await getZeroClient({
  url: 'https://your-zero-server.com',
  authToken: 'optional-auth-token'
});
```

## TypeScript Support

The integration includes full TypeScript support. Define your schema:

```ts
type Schema = {
  version: number;
  tables: {
    todos: {
      version: number;
      // your table schema
    };
  };
};

const z = new Z<Schema>({...});
```

## Example Usage

Check out the [hello-zero](../hello-zero) directory for a complete example application.

## Environment Variables

```env
PUBLIC_ZERO_URL="https://your-zero-server.com"
PUBLIC_ZERO_AUTH_TOKEN="your-auth-token"
```
