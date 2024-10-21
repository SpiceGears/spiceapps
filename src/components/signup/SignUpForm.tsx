"use client";
import { Form, Formik } from "formik";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormStepComponentType } from "./FormStepProps";

type Props = {
  steps: FormStepComponentType[];
};
const SignUpForm = ({ steps }: Props) => {
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
