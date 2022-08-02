import useApproveProgress from "hooks/useApproveProgress";
import { TokenType } from "./../../types/token.types";
import { aTokenList } from "./../../constants/tokens";
import useTokens from "hooks/useTokens";
import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";

export const Flow = createContainer(useFlow);

function useFlow() {
  const { balances: aTokenBalances, allowances: aTokenAllowances } = useTokens(aTokenList, TokenType.AToken);
  const approveProgress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const [currentStep, setCurrentStep] = React.useState<Step>(Step.ONE);

  const changeStep = React.useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  const buttonFlow = (currentStep: Step) => {
    switch (currentStep) {
      case Step.ONE:
        return {
          buttonLabel: "Transfer Positions",
          action: moveApproveStep,
        };
      case Step.TWO:
        return {
          buttonLabel: "Continue",
          action: moveDelegationStep,
        };
    }
  };

  // Private functions
  const moveApproveStep = () => {
    if (aTokenBalances.filter((t) => t.balance?.toString() !== "0").length === 0) return;
    changeStep(currentStep + 1);
  };

  const moveDelegationStep = () => {
    // check all the a tokens are approved
    if (approveProgress !== 1) {
      /**
       * @Todo add toast to ask user to approve all tokens
       */
      return;
    }
  };

  return {
    currentStep,
    actions: {
      changeStep,
    },
  };
}
