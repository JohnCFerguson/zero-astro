# Zero Sync Integration Library for Astro: Next Steps

## Environment Variables

Before running your Astro application, set the following environment variables:

*   **`PUBLIC_ZERO_URL`**: The URL of your Zero server.
*   **`PUBLIC_ZERO_AUTH_TOKEN`**:  Your Zero authentication token (if required).
*   **`PUBLIC_ZERO_USER_ID`**:  A unique user ID for your application (optional, defaults to 'default-user').

You can set these in your environment, or in an `.env` file in the project root directory.  Be careful not to commit the `.env` file to version control.

## Setting up the Zero Client with Astro Sessions

To integrate with Astro's session API, follow these steps:

1. **Import necessary modules:** In the components where you want to use the `zeroClient`, import the necessary modules:


## Package Configuration (`package.json`)

Before publishing to npm, ensure your `package.json` file is correctly configured:

```
json
{
  "name": "zero-astro",
  "type": "module",
  "version": "0.1.0",
  "description": "Zero Sync integration for Astro",
  "author": "John Ferguson",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/zero-astro.git"
  },
  "keywords": [
    "astro",
    "zero-sync",
    "replication"
  ],
  "scripts": {
    "dev": "astro dev",
    "build": "esbuild --bundle src/index.ts --outfile=dist/index.js --format=esm && tsc", // Improved build script
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest",
    "prepublishOnly": "npm run build && npm run typecheck",
    "typecheck": "tsc --noEmit", // Add type checking script
    "lint": "eslint src/**/*.{ts,astro}" // Add linting script
  },
  "dependencies": {
      "@rocicorp/zero": "^0.10.0" // Keep this if needed by your internal scripts
  },
  "devDependencies": {
    "@types/node": "^20.17.12",
    "esbuild": "^0.19.5", // Add esbuild as a dev dependency
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-astro": "^1.3.1",
    "prettier": "^3.4.2",
    "prettier-plugin-astro": "^0.14.1",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.19.1",
    "vitest": "^1.0.0" //Example, use the correct version number for vitest
  },
  "peerDependencies": {
    "astro": "^5.1.5", // Updated Astro version
    "@rocicorp/zero": "^0.10.0" 
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components": {
      "import": "./dist/components/index.js",
      "types": "./dist/components/index.d.ts"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ]
}
```

- Create a build process using a tool like `esbuild` or `rollup`.
- The build process should bundle your code into a distributable format in a `dist` directory.
- Generate type definitions (.d.ts files) if needed.

## Package.json Configuration

- Configure the `name`, `version`, `description`, `main`, `keywords`, `repository`, `license`, `dependencies`, `peerDependencies`, `scripts`, and `types` fields in your `package.json` file.
- See the previous responses for an example `package.json` configuration.
