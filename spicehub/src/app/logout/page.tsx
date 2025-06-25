'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { getCookie, removeCookie } from 'typescript-cookie';
import { getBackendUrl } from '../serveractions/backend-url';

const page = () => {
  const router = useRouter();

  async function logout(rt: string) 
  {
    const backend = await getBackendUrl();
    if (!backend) 
        {
            console.error("FETCH FAILED: NO BACKEND!");
            throw new Error("No backend");
        }
    const res = await fetch(`${backend}/api/auth/logout`, 
        {
            method: 'GET',
            headers: {
                Authorization: rt
            }
        })
    if (res.ok) {}
    else {
        console.error("Logout failed: "+await res.text())
    }
  }
  
  useEffect(() => {
    const rt = getCookie('refreshToken');
    if (rt) {logout(rt)};
    removeCookie('refreshToken');
    removeCookie('accessToken');
    router.push("/login");
  
    return () => {
    }
  }, [])
  
  return (
    <div className='w-full text-center'>
        <h1 className='text-4xl'>Wylogowywanie...</h1>
    </div>
  )
}

export default page