import Image from "next/image";
import Link from "next/link";
import Menu from "../../components/Menu";
import Navbar from "../../components/Navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex">
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w[14%] p-4">
                <Link href="/dashboard/home" className="flex items-center justify-center lg:justify-start gap-2">
                    <Image src="/images/spicelab.png" alt="icon" width={120} height={30} />
                </Link>
                <Menu/>
            </div>
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w[86%] bg-[#F7F8FA] overflow-scroll">
                <Navbar/>
                {children}
            </div>
        </div>
    );  
}