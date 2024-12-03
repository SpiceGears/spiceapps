// app/api/project/[projectId]/route.ts


export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const backend = process.env.BACKEND || "http://localhost:8080/";
        const atok = request.headers.get("Authorization");
        const { projectId } = params; // Extract projectId from URL params

        console.log('Fetching project:', projectId);
        
        const response = await fetch(`${backend}/api/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${atok}` 
            }
        });
        
        if (!response.ok) {
            console.log(atok);
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return Response.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return new Response('Error fetching project', { status: 500 });
    }
}