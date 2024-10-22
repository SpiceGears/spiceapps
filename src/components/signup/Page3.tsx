"use client";
import { Button, MenuItem } from "@mui/material";
import { FormStepComponentType } from "./FormStepProps";
import FormikSelect from "../formik/FormikSelect";
import FormikTextField from "../formik/FormikTextField";
import Image from "next/image";

const Page3: FormStepComponentType = (props) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-2 mb-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="w-full h-1 bg-gray-300"></div>
        <span className="text-sm text-gray-500 mt-2">Krok 3 z 3</span>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-6">
        Utwórz swoje konto
      </h2>
      <FormikSelect
        label="Dział"
        labelId="dzial-label"
        id="simple-select"
        name={"dzial"}
      >
        <MenuItem value="Mechanik">Mechanik</MenuItem>
        <MenuItem value="Programista">Programista</MenuItem>
        <MenuItem value="SocialMedia">Social Media</MenuItem>
        <MenuItem value="Zarzadzanie">Zarządzanie</MenuItem>
        <MenuItem value="Mentor">Mentor</MenuItem>
      </FormikSelect>
      <div className="flex justify-between gap-2">
        <Button onClick={props.onPrevious} className="flex-grow">
          Wróć
        </Button>
        <Button type="submit" variant="contained">
          Stwórz konto
        </Button>
      </div>
    </div>
  );
};

export default Page3;
