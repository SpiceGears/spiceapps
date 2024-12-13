export async function GET(request: Request, response: Response) {
    try {
        const atok = request.headers.get('Authorization');
        const backend = process.env.BACKEND || "http://localhost:8080/";

        const response = await fetch(`${backend}/api/project`, {
            method: 'GET',
            headers: {
                'Authorization': `${atok}`
            }
        })

        if (!response.ok) {
            const errorData = await response.text();
            return Response.json(
                { error: errorData || 'Failed to get project' },
                { status: response.status }
            );
        }

        const data = await response.text();
        return Response.json(data);


    } catch (error) {
        console.error('Error getting project:', error);
    }
}