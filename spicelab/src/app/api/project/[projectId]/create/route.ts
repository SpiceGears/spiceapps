export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    const body = await request.json();
    const atok = await request.headers.get('Authorization');
    const { projectId } = params;

    const backend = process.env.BACKEND || "http://localhost:8080/";

    try {
        const response = await fetch(`${backend}api/project/${projectId}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${atok}`
            },
            body: JSON.stringify({
                name: body.name,
                description: body.description,
                dependencies: [],
                deadlineDate: body.deadlineDate,
                assignedUsers: [body.assignedUsers],
                priority: body.priority,
                status: body.status
            })
        });

        console.log('Response:', response);
        console.log('Body:', body);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        // Get response as text since it's a JWT token
        const token = await response.text();

        // Return the token as plain text
        return new Response(token, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    } catch (error: any) {
        console.log('Generate access error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}