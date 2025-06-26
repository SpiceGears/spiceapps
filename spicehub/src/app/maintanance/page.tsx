// app/maintenance/page.tsx

import React from 'react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const MaintenancePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const code = typeof params.code === 'string' ? params.code : 'UNKNOWN';

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center text-center'>
      <h1 className="text-3xl">SpiceHub nie działa :\</h1>
      <h2 className="text-xl">Skontaktuj się z deweloperami, aby rozwiązać.</h2>
      <code className="text-red-600 mt-4 block">Error code: {code}</code>
    </div>
  );
};

export default MaintenancePage;
