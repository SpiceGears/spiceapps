"use client";

import Image from "next/image"; // Importing the Image component from Next.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return null;
}