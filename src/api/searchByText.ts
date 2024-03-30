import { searchWebcams } from '@/lib/webcams';

export async function POST(request: Request) : Promise<Response> {
    const { query }: { query: unknown } = await request.json();
    if (!query || typeof query !== 'string') {
        return new Response('no query', {
            status: 400
        });
    }
    const searchPhotosResponse = await searchWebcams(query);
    return new Response(JSON.stringify(searchPhotosResponse), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
