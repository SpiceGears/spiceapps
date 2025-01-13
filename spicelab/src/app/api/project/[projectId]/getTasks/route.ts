export const dynamic = 'force-dynamic';


export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const backend = process.env.BACKEND || "http://spiceapi:8080";  // Remove trailing slash
        const atok = request.headers.get("Authorization");
        const { projectId } = params;

        const response = await fetch(`${backend}/api/project/${projectId}/getTasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok || ''
            }
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