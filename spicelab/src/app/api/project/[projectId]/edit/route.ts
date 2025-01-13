export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const body = await request.json();
        const backend = process.env.BACKEND || "http://spiceapi:8080";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}/api/project/${params.projectId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            },
            body: JSON.stringify({
                name: body.name,
                description: body.description,
                scopes: body.scopes,
                status: body.status,
                priority: body.priority,
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response((error as Error).message, { status: 500 });
    }
}