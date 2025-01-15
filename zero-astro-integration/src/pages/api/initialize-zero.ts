import type { APIContext } from 'astro';
import { getZeroClient } from '../../lib/Z.astro.ts';

export const all = async (context: APIContext) => {
	try {
		const { zeroClient } = await getZeroClient(context);
		context.locals = { ...context.locals, zeroClient };
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error initializing Zero client:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
