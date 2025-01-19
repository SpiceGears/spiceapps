export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const backend = process.env.BACKEND || "http://spiceapi:58831/";
        const atok = request.headers.get("Authorization");

        console.log(params.userId);

        const response = await fetch(`${backend}/api/user/${params.userId}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(error.message, { status: 500 });
    }
}