"use client";
import { Button, MenuItem } from "@mui/material";
import { FormStepComponentType } from "./FormStepProps";
import FormikSelect from "../formik/FormikSelect";

const Page3: FormStepComponentType = (props) => {
  return (
    <div className="flex flex-col gap-2 w-[400px]">
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
