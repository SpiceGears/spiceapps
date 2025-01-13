export async function PUT(
    request: Request,
    { params }: { params: { projectId: string, taskId: string } }
) {
    const body = await request.json();
    const { projectId, taskId } = params;

    const backend = process.env.BACKEND || "http://spiceapi:8080/";

    try {
        // Log the request body
        console.log('Request body:', body);

        // Send PUT request to another API using Fetch API
        const response = await fetch(backend + `api/project/${projectId}/${taskId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        // Log the response status and body
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${data.message || 'Unknown error'}`);
        }

        // Return the response from the other API
        return Response.json(data);
    } catch (error: any) {
        // Handle any errors
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}