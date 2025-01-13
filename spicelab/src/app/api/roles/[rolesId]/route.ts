import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper function to validate rolesId
function validateRolesId(rolesId: string | undefined): boolean {
    return typeof rolesId === 'string' && rolesId.length > 0;
}

// Helper function to handle API errors
function handleApiError(error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message.includes('Error: 404') ? 404 :
        message.includes('Error: 401') ? 401 :
            message.includes('Error: 403') ? 403 : 500;

    return new NextResponse(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(
    request: Request,
    { params }: { params: { rolesId: string } }
) {
    try {
        const { rolesId } = params;
        if (!validateRolesId(rolesId)) {
            return new NextResponse(
                JSON.stringify({ error: 'Invalid role ID' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const backend = process.env.BACKEND || "http://spiceapi:8080";
        const atok = request.headers.get("Authorization");

        if (!atok) {
            return new NextResponse(
                JSON.stringify({ error: 'Authorization token required' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch(`${backend}/api/roles/${rolesId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': atok
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return handleApiError(error);
    }
}