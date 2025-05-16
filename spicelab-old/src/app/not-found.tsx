import React from 'react';
import Image from 'next/image';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <Image src="/images/logo.png" alt="Forgot Password" width={300} height={300} />
            <div className="text-center mt-12">
            <h1 className="text-4xl font-bold">404 - Strona nie znaleziona</h1>
            <p className="text-xl mt-4">Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
            <a href="/" className="text-blue-500 underline mt-6 text-lg">
                Powrót do strony głównej
            </a>
            </div>
        </div>
    );
};

export default NotFoundPage;