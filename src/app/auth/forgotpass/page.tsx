import Image from "next/image";
import Link from "next/link";

export default function ForgotPass() {
    return (
        <div className="relative h-screen bg-gray-100">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-8">
            <Image src="/images/logo.png" alt="Forgot Password" width={300} height={300} />
            </div>
            <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center w-2/3 max-w-md p-6 space-y-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <h1 className="text-4xl font-semibold">Zapomniałem hasła</h1>
            <p className="text-sm text-gray-500">Podaj Email na który wyślemy link do zmiany hasła</p>
            <form className="flex flex-col space-y-3 w-full">
            <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
                type="submit"
                className="w-full p-3 text-white bg-blue-500 rounded-md"
            >
                Zresetuj hasło
            </button>
            </form>
            </div>
            </div>
        </div>
    );
}