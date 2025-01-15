# Zero Astro Integration

Zero Sync integration for Astro applications. Provides real-time synchronization and offline-first capabilities using [Zero](https://zero.rocicorp.dev/).

## Overview

This library simplifies the integration of Zero Sync into your Astro projects. It offers server-side data fetching, client-side hydration, real-time updates, and type-safe queries and mutations.  It handles the complexity of database interaction through helper functions, letting you focus on your application logic.

## Installation
```
bash
npm install zero-astro @rocicorp/zero
```
## Quick Start

1.  **Configure Astro:** Add the `zero-astro` integration to your `astro.config.mjs` file:
```
javascript
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import zero from 'zero-astro';

    export default defineConfig({
      integrations: [zero()]
    });
    
```
2.  **Initialize the Zero Client:** In your Astro component, initialize the Zero client:
```
astro
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
      {/* Your application components */}
    </ZeroProvider>
    
```
3.  **Use the `ZeroQuery` and `ZeroMutation` Components:**

    Refer to the Usage section below.

## Key Features

*   Server-side data fetching
*   Client-side hydration
*   Real-time updates
*   Type-safe queries and mutations
*   Automatic error handling
*   Subscription management
*   Easy integration with Astro components


## Usage

### ZeroProvider

Wraps your application to provide the Zero client to child components.
```
astro
<ZeroProvider client={client}>
  {/* Your application components */}
</ZeroProvider>
```
### ZeroQuery

Fetches data from your Zero database.
```
astro
---
import { ZeroQuery } from 'zero-astro/components';
// ... (your client initialization)
const query = client.createQuery(tx => tx.get('todos'));
---

<ZeroQuery query={query}>
  {(data, error, isLoading) => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
      <ul>
      {data?.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    );
  }}
</ZeroQuery>
```
### ZeroMutation

Performs mutations against your database.
```
astro
---
import ZeroMutation from 'zero-astro-integration/components/ZeroMutation.astro';

// Example mutation function (implementation details would be in your library)
const createTodoMutation = async (params: { title: string }) => {
  const client = await getZeroClient({/* ... your client config ... */});
  // Assuming you have a function defined in zero-schema.ts or similar
  const result = await client.mutate(async (tx) => {
    await tx.put('todos', { id: crypto.randomUUID(), title: params.title, completed: false});
  });
  return result;
};

---
<ZeroMutation
  mutation={createTodoMutation}
  mutationParams={{ title: 'Buy milk' }}
  onSuccess={(data) => {
    console.log('Mutation successful:', data);
  }}
/>
```
**Creating Custom Mutation Functions:**

Custom mutation functions should use the Zero client to interact with the database.  You would likely define these functions in a separate file (e.g., `mutations.ts`) and import them into your Astro components.  These functions will handle the actual database interactions using the correct table or collections names and update the data as needed.  The `zero-schema.ts` file is used to provide details about the tables.

**Database Interaction:** The `ZeroMutation` component relies on the provided mutation function to interact with the database using the Zero client. The mutation function handles specifics of database interaction, such as table names, update logic, and data validation.


## Configuration

*   **Environment Variables:** Set the following environment variables:
```
    PUBLIC_ZERO_URL="your-zero-server-url"
    PUBLIC_ZERO_AUTH_TOKEN="your-auth-token"
    
```
*   **Client Configuration (within the Astro component):**
```
javascript
    // ... inside your Astro component
    const client = await getZeroClient({
        url: import.meta.env.PUBLIC_ZERO_URL,
        authToken: import.meta.env.PUBLIC_ZERO_AUTH_TOKEN
    });
    
```
## API Reference

For detailed API documentation, please refer to the [API_REFERENCE.md](./API_REFERENCE.md) file.

## Examples

(Include more detailed examples in separate directories)

## Contributing

(Include contribution guidelines)

## License

(Specify the license)