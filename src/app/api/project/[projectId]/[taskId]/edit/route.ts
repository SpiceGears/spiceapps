export async function PUT(
    request: Request,
    { params }: { params: { projectId: string, taskId: string } }
) {
    const body = await request.json();
    const { projectId, taskId } = params;

    const backend = process.env.BACKEND || "http://localhost:8080/";

    try {
        // Send PUT request to another API using Fetch API
        const response = await fetch(backend + `api/project/${projectId}/${taskId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "assignedUsers": body.assignedUsers, "name": body.name, "description": body.description, "dependencies": [projectId] })
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Get the response data
        const data = await response.json();

        // Return the response from the other API
        return Response.json(data);
    } catch (error: any) {
        // Handle any errors
        console.error('Error:', error);
        throw new Error(error);
    }
} 