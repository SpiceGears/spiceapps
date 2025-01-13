'use server';
// pages/api/login.js

export async function POST(request: Request) {
    const body = await request.json();
    
    const backend = process.env.BACKEND ||"http://localhost:8080/";
  
    try {
      // Send POST request to another API using Fetch API
      const response = await fetch(backend + 'api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'login': body.login, 'password': body.password })
      });
  
      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // Get the response data
      const data = await response.json();
  
      // Return the response from the other API
      return Response.json(data);
    } catch (error: any) {
      // Handle any errors
      console.error('Error:', error);
      throw new Error(error);
    }
  }
