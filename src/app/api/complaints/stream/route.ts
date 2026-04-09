import { NextRequest } from 'next/server';
import { EventEmitter } from 'events';

// Global singleton for event emitter across Next.js API reloads in Dev
declare global {
  var sseEmitter: EventEmitter | undefined;
}

if (!global.sseEmitter) {
  global.sseEmitter = new EventEmitter();
}
const emitter = global.sseEmitter;

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        // Send retry config
        controller.enqueue(encoder.encode(`retry: 10000\n\n`));

        const onMessage = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Listen to our custom 'new_complaint' event
        emitter.on('new_complaint', onMessage);

        request.signal?.addEventListener('abort', () => {
          emitter.off('new_complaint', onMessage);
          controller.close();
        });
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    }
  );
}

// POST endpoint to trigger the event from the main complaint POST hook
export async function POST(request: NextRequest) {
    const data = await request.json();
    emitter.emit('new_complaint', data);
    return new Response('ok', { status: 200 });
}
