import Link from "next/link";

export default function Menu() {
    const menuItems = [
        {
            title: "MENU",
            items: [
                {
                    title: "Home",
                    link: "/dashboard/home",
                },
                {
                    title: "Projects",
                    link: "/dashboard/projects",
                },
                {
                    title: "Profile",
                    link: "/dashboard/profile",
                },
            ],
        },
        {
            title: "OTHER",
            items: [
                {
                    title: "Settings",
                    link: "/dashboard/settings",
                },
                {
                    title: "Logout",
                    link: "/dashboard/logout",
                },
            ],
        }
    ]
    return (
        <div className="">
            {menuItems.map((i) => (
                <div className="" key={i.title}>
                    <span>{i.title}</span>
                    {i.items.map((item) => (
                        <Link href={item.link} key={item.title}>
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}