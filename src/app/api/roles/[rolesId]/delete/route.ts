export async function DELETE(
    request: Request,
    { params }: { params: { rolesId: string } }
) {
    try {
        const backend = process.env.BACKEND || "http://localhost:8080";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}/api/roles/${params.rolesId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return new Response(null, { status: 204 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(error.message, { status: 500 });
    }
}