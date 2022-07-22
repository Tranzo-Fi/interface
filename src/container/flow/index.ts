import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";

export const Flow = createContainer(useFlow);

function useFlow() {
  const [currentStep, setCurrentStep] = React.useState<Step>(Step.ONE);

  const changeStep = React.useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  return {
    currentStep,
    actions: {
      changeStep,
    },
  };
}
