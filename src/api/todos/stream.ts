// import type { APIRoute } from 'astro';

// export const GET: APIRoute = async ({ request }) => {
//   const stream = new ReadableStream({
//     async start(controller) {
//       const view = z.query.todo.materialize();
//       view.addListener((todos) => {
//         controller.enqueue(`data: ${JSON.stringify(todos)}\n\n`);
//       });
//     }
//   });

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive'
//     }
//   });
// };
