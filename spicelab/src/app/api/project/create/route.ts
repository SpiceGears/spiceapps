// src/app/api/project/create/route.ts
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const atok = request.headers.get('Authorization');
        const backend = process.env.BACKEND || "http://spiceapi:8080/";

        // Validate request body
        if (!body.name || !body.description) {
            return Response.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const response = await fetch(`${backend}api/project/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${atok}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.text();
            return Response.json(
                { error: errorData || 'Failed to create project' },
                { status: response.status }
            );
        }

        const data = await response.text();
        
        try {
            // Try to parse as JSON if possible
            const jsonData = JSON.parse(data);
            return Response.json(jsonData);
        } catch {
            // If not JSON, return as text
            return new Response(data, {
                headers: { 'Content-Type': 'text/plain' }
            });
        }

    } catch (error: any) {
        console.error('Project creation error:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}