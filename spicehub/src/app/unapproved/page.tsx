import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center text-center'>
        <h1 className='text-5xl'>Zostałeś zalogowany,</h1>
        <h2 className='text-4xl'>ale nadal nie zostałeś zatwierdzony.</h2>
        <h3 className='text-lg'>Skontaktuj się z administratorem w celu zatwierdzenia twojego konta.</h3>

        <a href='/logout' className='mt-2 text-blue-600 dark:text-blue-500 
                         hover:text-blue-700 dark:hover:text-blue-600'>Wyloguj się</a>
    </div>
  )
}

export default page