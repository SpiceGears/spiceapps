'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { getCookie, removeCookie } from 'typescript-cookie';
import { api } from '@/services/api';

const Page = () => {
  const router = useRouter();
  const ranOnce = useRef(false);

  useEffect(() => {
  const doLogout = async () => {
    try {
      if (getCookie('accessToken')) {
        await api.logout();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (!message.includes('This token does not exist')) {
        console.error('Logout failed:', e);
      }
    } finally {
      removeCookie('refreshToken');
      removeCookie('accessToken');
      router.replace('/login');
    }
  };

  void doLogout();
}, [router]);

  return (
    <div className='w-full text-center'>
      <h1 className='text-4xl'>Wylogowywanie...</h1>
    </div>
  );
};

export default Page;