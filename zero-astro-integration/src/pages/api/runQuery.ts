import type { APIRoute } from 'astro';
import { server } from '../index.astro';

export const POST: APIRoute = async (context) => {
	const result = await server.runQuery(context); // Call the action correctly

	return new Response(JSON.stringify(result));
};
