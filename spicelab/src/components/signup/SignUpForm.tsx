"use client";
import { Form, Formik } from "formik";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormStepComponentType } from "./FormStepProps";
import { useRef } from "react";

type Props = {
  steps: FormStepComponentType[];
};
const SignUpForm = ({ steps }: Props) => {
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

    //try {
      const response = await fetch('/api/register', {
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
    //} catch (error) {
      //console.error('Register error:', error);
      // Handle error appropriately (e.g., show error message to user)
    //}
  }
  
  
  
  
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("step"); // get the current step using search params
  const pageIndex = page ? +page : 1;
  // get the step component
  const StepComponent = steps.at(pageIndex - 1);
  const stepExists = !!StepComponent;
  return (
    // use Formik context to handle the form state and onSubmit
    <Formik
      onSubmit={(values: any) => {
        console.log(values);
        register();
      }}
      initialValues={{
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        interests: "",
      }}
    >
      <Form>
        {/* render the step component if it exists */}
        {!!stepExists && (
          <StepComponent
            onNext={() => {
              // navigate to next page if it is not the last page using `router.push`
              if (pageIndex < steps.length) {
                const nextPage = pageIndex + 1;
                router.push(`/auth/register?step=${nextPage}`);
              }
            }}
            onPrevious={() => {
              // navigate to the previous page using `router.push`
              const prevPage = pageIndex - 1;
              if (prevPage > 1) {
                router.push(`/auth/register?step=${prevPage}`);
              } else {
                router.push("/auth/register");
              }
            }}
          />
        )}
      </Form>
    </Formik>
  );
};

export default SignUpForm;
