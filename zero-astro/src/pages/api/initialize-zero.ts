import type { APIContext } from 'astro';
import { getZeroClient } from '../../lib/ZeroClient.astro';
import { schema } from '../../zero-schema';

export const ALL = async (context: APIContext) => {
	try {
		const { zeroClient } = await getZeroClient({
      url: import.meta.env.PUBLIC_URL,
      schema: {
        version: 1,
        tables: schema.tables
      }
		});
		// Type assertion to avoid type errors.
		(context.locals as any).zeroClient = zeroClient;
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error initializing Zero client:', error);
		return new Response(
			JSON.stringify({ 
				success: false, 
				error: error instanceof Error ? error.message : 'Unknown error'
			}), 
			{ 
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
