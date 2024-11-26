import Image from "next/image";
import Link from "next/link";

export default function Menu() {
    const menuItems = [
        {
            title: "MENU",
            items: [
            {
                label: "Home",
                href: "/dashboard/home",
            },
            {
                label: "Projects",
                href: "/dashboard/projects",
            },
            {
                label: "Profile",
                href: "/dashboard/profile",
            },
            ],
        },
        {
            title: "OTHER",
            items: [
            {
                label: "Settings",
                href: "/dashboard/settings",
            },
            {
                label: "Logout",
                href: "/dashboard/logout",
            },
            ],
        }
        ]
    return (
        <div className="">
            {menuItems.map((i) => (
                <div className="flex flex-col gap-2" key={i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item) => (
                        <Link href={item.href} key={item.label}>
                            <Image src="/icon.ico" alt="Logo" width={20} height={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}