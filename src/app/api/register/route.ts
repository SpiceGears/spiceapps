'use server'

export async function POST(request: Request) {
    if(request.method === 'POST') {
        console.log('Request Method:', request.method);
        
        const body = await request.json();
        console.log('Request Body:', body);
        
        const backend = "http://localhost:5086";
        console.log('Backend URL:', backend);
        
        try {
            // Send POST request to another API using Fetch API
            const response = await fetch(backend + 'api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'login': body.login, 'password': body.password })
            });
            console.log('Response:', response);
            
            // Check if the response is okay
            if(!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            // Get the response data
            const data = await response.json();
            console.log('Response Data:', data);
            
            // Return the response from the other API
            return Response.json(data);
        } catch(error: any) {
            // Handle any errors
            console.error('Error:', error);
            throw new Error(error);
        }
    }
}