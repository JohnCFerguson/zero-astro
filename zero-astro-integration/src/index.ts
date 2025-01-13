import type { AstroIntegration } from 'astro'

export { Z, getZeroClient, type Schema } from './lib/Z.astro'
export { ZeroQuery } from './lib/query.astro'
export { default as ZeroProvider } from './components/ZeroProvider.astro'
export { Mutation, type MutationOptions } from './lib/mutations.astro.ts'
export type { QueryState, QueryOptions } from './types/query'

export default function createZeroIntegration(): AstroIntegration {
  return {
    name: 'zero-astro',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: []
          }
        })
      }
    }
  }
}
