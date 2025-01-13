
export const dynamic = 'force-dynamic';

export async function GET (
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const backend = process.env.BACKEND || "http://localhost:8080/";
        const atok = request.headers.get("Authorization");

        const response = await fetch(`${backend}/api/user/${params.userId}/finishedTasks/count`, {
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