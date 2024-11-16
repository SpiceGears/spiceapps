// app/signup/page.tsx
import Page1 from "@/components/signup/Page1";
import Page2 from "@/components/signup/Page2";
import Page3 from "@/components/signup/Page3";
import SignUpForm from "@/components/signup/SignUpForm";
import React from "react";
import { Suspense } from "react";

const SignupPage = () => {
  return (
    <div className="grid h-screen place-items-center bg-white">
      <Suspense fallback={<></>}> <SignUpForm steps={[Page1, Page2, Page3]} /></Suspense>
    </div>
  );
};

export default SignupPage;
