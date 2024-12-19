export async function POST(
    request: Request,
    { params }: { params: { rolesId: string } }
) {
    try {
        const body = await request.json();
        const backend = process.env.BACKEND || "http://localhost:8080";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}/api/roles/${params.rolesId}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return new Response(null, { status: 201 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(error.message, { status: 500 });
    }
}