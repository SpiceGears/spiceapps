// app/api/user/getInfo/route.ts
export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
    try {
        const backend = process.env.BACKEND|| "http://spiceapi:8080/";

        const atok = request.headers.get("Authorization");
        const response = await fetch(`${backend}api/user/getAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${atok}`
            }
        });

        if (!response.ok) {
            console.log(atok);
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error: any) {
        // Handle any errors
        console.error('Error:', error);
        throw new Error(error);
    }
}