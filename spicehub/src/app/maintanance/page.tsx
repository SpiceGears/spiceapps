'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

const page = () => {
    //const searchparams = useSearchParams()

  return (
    <>
    <h1 className='text-3xl'>SpiceHub nie działa :\</h1>
    <h2 className='text-xl'>Skontaktuj się z deweloperami, aby rozwiązać.</h2>
    <Suspense>
    <code>{"Error code: H. O. W."}</code></Suspense>
    </>
  )
}

export default page