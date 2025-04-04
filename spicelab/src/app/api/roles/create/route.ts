export const dynamic = 'force-dynamic';


export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const backend = process.env.BACKEND || "http://spiceapi:8080";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}api/roles/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            },
            body: JSON.stringify({
                name: body.name,
                scopes: body.scopes,
            })
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