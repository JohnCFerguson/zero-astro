# ZeroMutation Component API Reference

The `ZeroMutation` component provides a way to perform mutations against your database. It handles the complexities of interaction with the Zero client, allowing you to focus on defining the data changes you need.

## Props

*   **`mutation`**:  A function that defines the mutation operation.  This function receives `mutationParams` as an argument and should return a promise that resolves when the mutation completes successfully.  This function typically uses the Zero client to interact with your database, often leveraging functions defined within your `zero-schema.ts` file.
```
javascript
    // Example mutation function
    const updateTodoMutation = async (params: { id: string; completed: boolean }) => {
      const client = await getZeroClient({/* ... your client configuration ... */});
      const result = await client.mutate(async (tx) => {
          // Use a helper function from your schema file (zero-schema.ts)
          await tx.update('todos', params.id, { completed: params.completed });
      });

      return result;
    };
    
```
*   **`mutationParams`**:  An object containing the parameters required by the `mutation` function.  The shape of this object should precisely match the expected parameters of your mutation function.
```
javascript
    // Example mutationParams
    const mutationParams = { id: 'todo-123', completed: true };
    
```
*   **`onSuccess`**: (Optional) A function that is called when the mutation completes successfully.  This function receives the result of the mutation as an argument.  This provides a way to update the user interface or perform other actions after a successful mutation.
```
javascript
    // Example onSuccess function
    const handleSuccess = (data) => {
      console.log('Mutation successful:', data);
      // Update UI or perform other actions
    };
    
```
## Creating Custom Mutation Functions

To create custom mutation functions for use with `ZeroMutation`, follow these steps:


1.  **Obtain the Zero Client:** Use `getZeroClient` to obtain an instance of the Zero client, ensuring it is properly configured with your database connection details.
2.  **Define the Mutation Logic:**  Implement the mutation logic within your custom function.  This typically involves using the Zero client's mutation methods (`mutate` or other relevant functions from your schema file) to interact with the database.

## Example Usage
```
astro
---
import ZeroMutation from 'zero-astro-integration/components/ZeroMutation.astro';
import { getZeroClient } from 'zero-astro'; // Import your client function

// Define your mutation function (see example above)
const updateTodoMutation = async (params: { id: string; completed: boolean }) => {
    // ... implementation as shown in the Props section ...
};
---

<ZeroMutation
    mutation={updateTodoMutation}
    mutationParams={{ id: 'todo-123', completed: true }}
    onSuccess={(data) => {
        console.log('Todo updated successfully:', data);
    }}
/>
```
## Database Interaction

The `ZeroMutation` component relies on the Zero client to interact with your database.  The `mutation` function you provide is responsible for performing the actual database operation.  It uses the Zero client's API, likely interacting with the data defined in `zero-schema.ts`, to execute these actions.  Ensure the client is correctly configured with the necessary database connection settings and authentication credentials.
```
javascript
// Example configuration (in your astro.config.mjs or elsewhere)
import { getZeroClient } from 'zero-astro';

const client = await getZeroClient({
  url: import.meta.env.PUBLIC_ZERO_URL,
  authToken: import.meta.env.PUBLIC_ZERO_AUTH_TOKEN
});
```
Ensure you have the `client` available where you use the `ZeroMutation` component.  Passing the client might be done through context or as a prop.


This file provides a comprehensive reference for the `ZeroMutation` component within your Astro application using Zero integration.  It guides you through creating custom mutations and illustrates how these interact with the underlying Zero client and database.  Remember to replace the placeholder comments and configurations with your specific settings and functions.