export const dynamic = 'force-dynamic';


export async function PUT(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const body = await request.json();
        const backend = process.env.BACKEND || "http://spiceapi:8080";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}/api/user/${params.userId}/removeRoles`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            },
            body: JSON.stringify(
                [body.roles],
            )
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return new Response(null, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(error.message, { status: 500 });
    }
}