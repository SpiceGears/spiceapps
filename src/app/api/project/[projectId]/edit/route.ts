export async function PUT(
    request: Request,
    { params }: { params: { projectId: string } }
){
    try {
        const backend = process.env.BACKEND || "http://localhost:8080";
        const atok = request.headers.get("Authorization");
        const { projectId } = params;
        const body = await request.json();
        const response = await fetch(`${backend}/api/project/${projectId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            },
            body: JSON.stringify({
                "name": body.name,
                "description": body.description,
                "scopes": []
            })
        });
        if (!response.ok) {
            console.error(`Backend response: ${response.status}`);
            return new Response(null, { status: response.status });
        }
        const data = await response.json();
        console.log(data);
        return Response.json(data);
    } catch (error) {
        console.error('Route handler error:', error);
        return new Response(null, { status: 500 });
    }
}