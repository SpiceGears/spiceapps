import { NextResponse } from "next/server";

export async function POST(request: Request){
    const backend = process.env.BACKEND;
    if(!backend){
        return NextResponse.json(
            {error: "Backend URL is not set"},
            {status: 500}
        );
    }

    try {
        const data = await request.json();
        const response = await fetch(
            `${backend}/api/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if(!response.ok){
            const error = await response.text();
            return NextResponse.json(
                { error: "Failed to login", details: error },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error){
        console.error("Error login:", error);
        return NextResponse.json(
            { error: "Failed to login", details: error },
            { status: 500 }
        );
    }
}