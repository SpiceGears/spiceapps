// app/api/auth/logout/route.ts
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const backend = process.env.BACKEND || "http://spiceapi:8080";
    const rtb = request.headers.get("Authorization");

    if (!rtb) {
        console.error('No refresh token provided');
        return new Response('No refresh token provided', { status: 401 });
    }

    try {
        const response = await fetch(`${backend}api/auth/logout`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${rtb}`
            },
        });

        if (response.status === 400) {
            const errorData = await response.text();
            console.error('Bad Request:', errorData);
            return new Response(errorData, { status: 400 });
        }

        if (!response.ok) {
            console.error(`Backend response: ${response.status}`);
            return new Response(null, { status: response.status });
        }

        const data = await response.json();
        console.log('Logout successful:', data);
        return Response.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Route handler error:", error);
        return new Response('Internal server error', { status: 500 });
    }
}