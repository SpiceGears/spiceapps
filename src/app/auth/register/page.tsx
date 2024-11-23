'use client'
// app/signup/page.tsx
import Page1 from "@/components/signup/Page1";
import Page2 from "@/components/signup/Page2";
import Page3 from "@/components/signup/Page3";
import SignUpForm from "@/components/signup/SignUpForm";
import React from "react";
import { Suspense } from "react";
import { useRef } from "react";
import { useRouter } from 'next/navigation';

export default function SignupPage(){
  const router = useRouter();
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const repeatPassword = useRef<HTMLInputElement | null>(null);
  const name = useRef<HTMLInputElement | null>(null);
  const surname = useRef<HTMLInputElement | null>(null);
  const dateOfBirth = useRef<HTMLInputElement | null>(null);
  const phoneNumber = useRef<HTMLInputElement | null>(null);
  const department = useRef<HTMLSelectElement | null>(null);
  async function register() 
  {
    if (email == null || password == null || repeatPassword == null || name == null || surname == null || dateOfBirth == null || phoneNumber == null || department == null) return;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email.current.value, password: password.current.value, repeatPassword: repeatPassword.current.value, name: name.current.value, surname: surname.current.value, dateOfBirth: dateOfBirth.current.value, phoneNumber: phoneNumber.current.value, department: department.current.value})
      });

      if (!response.ok) {
        throw new Error('Register failed');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Register error:', error);
      // Handle error appropriately (e.g., show error message to user)
    }
  }
  return (
    <div className="grid h-screen place-items-center bg-white">
      <Suspense fallback={<></>}> <SignUpForm steps={[Page1, Page2, Page3]} /></Suspense>
    </div>
  );
};
