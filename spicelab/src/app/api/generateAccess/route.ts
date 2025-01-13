export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  const body = await request.json();
  const rtb = await request.headers.get('Authorization');
  
  const backend = process.env.BACKEND || "http://localhost:8080/";

  try {
      const response = await fetch(`${backend}api/auth/generateAccess`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `${rtb}`
          },
          body: JSON.stringify({ 'refreshToken': rtb })
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      // Get response as text since it's a JWT token
      const token = await response.text();
      
      // Return the token as plain text
      return new Response(token, {
          headers: {
              'Content-Type': 'text/plain'
          }
      });
  } catch (error: any) {
      console.error('Generate access error:', error);
      return Response.json({ error: error.message }, { status: 500 });
  }
}