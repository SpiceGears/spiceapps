// components/signu/Page1.tsx
"use client";
import { Button } from "@mui/material";
import React from "react";
import { FormStepComponentType } from "@/components/signup/FormStepProps";
import FormikTextField from "../formik/FormikTextField";
import Image from "next/image";

const Page1: FormStepComponentType = (props) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-full h-1 bg-gray-300"></div>
        <span className="text-sm text-gray-500 mt-2">Krok 1 z 3</span>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-6">Utwórz swoje konto</h2>
      <FormikTextField name="email" label="Email" />
      <FormikTextField name="password" label="Hasło" type="password" />
      <FormikTextField name="confirmPassword" label="Potwierdź Hasło" type="password" />
      <Button variant="contained" color="primary" fullWidth onClick={props.onNext}>
        Dalej
      </Button>
    </div>
  );
};

export default Page1;
