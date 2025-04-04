"use client";
import {
  FormControl,
  Select,
  SelectProps,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useField } from "formik";
import React from "react";

type Props = { name: string; id: string; helperText?: string } & SelectProps;

const FormikSelect: React.FC<Props> = ({
  name,
  children,
  helperText,
  size,
  ...props
}) => {
  const [field, meta] = useField(name);

  // Ensure there's always a defined value
  const value = field.value ?? '';
  const error = Boolean(meta.touched && meta.error);
  const showHelperText = error || !!helperText;
  const id = props.id;

  return (
    <FormControl error={error}>
      <InputLabel id={id + "-label"}>{props.label}</InputLabel>
      <Select {...props} {...field} value={value} id={id} labelId={id + "-label"}>
        {children}
      </Select>
      {showHelperText && (
        <FormHelperText>{meta.error ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormikSelect;
