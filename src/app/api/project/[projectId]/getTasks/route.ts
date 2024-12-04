export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    const atok = request.headers.get('Authorization');
    const { projectId } = params;
    const backend = process.env.BACKEND?.replace(/\/$/, '') || "http://localhost:8080";

    // Input validation
    if (!projectId) {
        return Response.json(
            { error: 'Project ID is required' },
            { status: 400 }
        );
    }

    if (!atok) {
        return Response.json(
            { error: 'Authorization token is required' },
            { status: 401 }
        );
    }

    console.log('Request details:', {
        projectId,
        token: atok,
        backend,
        url: `${backend}/api/project/${projectId}/getTasks`
    });

    try {
        const response = await fetch(`${backend}/api/project/${projectId}/getTasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('Response not OK:', {
                status: response.status,
                statusText: response.statusText
            });
            return Response.json(
                { error: `Backend error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Response data:', data);

        return Response.json(data);
    } catch (error: any) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}