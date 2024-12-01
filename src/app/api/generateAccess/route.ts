// app/api/user/getInfo/route.ts
export async function POST(request: Request) {
    try {
        const backend = "http://localhost:8080/";
        
        const rtb = request.headers.get("Authorization");
        console.log(rtb);
        const response = await fetch(`${backend}api/auth/generateAccess`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${rtb}`
            },
            body: JSON.stringify({ token: rtb })
        });
        
        if (!response.ok) {
            console.log(rtb);
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