'use server';

export async function getBackendUrl () 
{
    let backend = process.env.BACKEND;
    return backend;
}
