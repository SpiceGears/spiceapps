export type FromStepProps = {
    onNext(): void;
    onPrevious(): void;
  };
  export type FormStepComponentType = React.FunctionComponent<FromStepProps>;