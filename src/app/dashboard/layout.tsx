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
        <div className="h-screen flex flex-col">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="flex flex-1">
                <div className="">
                    <Menu />
                </div>
                <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
                    {children}
                </div>
            </div>
        </div>
    );
}