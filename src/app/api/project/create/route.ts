export async function POST(request: Request) {
    try {
        const backend = process.env.BACKEND|| "http://localhost:8080/";

        const atok = request.headers.get('Authorization');
        
        console.log('Received request:', request);
        const body = await request.json();
        console.log('Request body:', body);
        
        const response = await fetch(`${backend}api/project/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${atok}`,
            },
            body: JSON.stringify({ "name": body.name, "description": body.description, "department": body.department, "scopes": body.scopes })
        });
        if (response.status === 403) {
            throw new Error('Forbidden: You do not have permission to access this resource.');
        }
        console.log(response.body)

        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data);
        return Response.json(data);
    } catch (error: any) {
        // Handle any errors
        console.error('Error:', error);
        throw new Error(error);
    }
}