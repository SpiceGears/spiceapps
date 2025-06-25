import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center text-center'>
        <h1 className='text-5xl'>Zostałeś zalogowany,</h1>
        <h2 className='text-4xl'>ale nadal nie zostałeś zatwierdzony.</h2>
        <h3 className='text-lg'>Skontaktuj się z administratorem w celu zatwierdzenia twojego konta.</h3>
    </div>
  )
}

export default page