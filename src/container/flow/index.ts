import useApproveDelegationProgress from "hooks/useApproveDelegationProgress";
import useApproveProgress from "hooks/useApproveProgress";
import { TokenType } from "./../../types/token.types";
import { aTokenList, stableDebtTokenList, variableDebtTokenList } from "./../../constants/tokens";
import useTokens from "hooks/useTokens";
import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";
import useDelegation from "hooks/useDelegation";

export const Flow = createContainer(useFlow);

function useFlow() {
  const { balances: aTokenBalances, allowances: aTokenAllowances } = useTokens(aTokenList, TokenType.AToken);
  const { balances: stableDebtTokenBalances, allowances: stableDebtTokenAllowances } = useTokens(
    stableDebtTokenList,
    TokenType.DebtToken
  );
  const { balances: variableDebtTokenBalances, allowances: variableDebtTokenAllownaces } = useTokens(
    variableDebtTokenList,
    TokenType.DebtToken
  );

  const { delegateTokens } = useDelegation(
    stableDebtTokenBalances,
    stableDebtTokenAllowances,
    variableDebtTokenBalances,
    variableDebtTokenAllownaces
  );
  const approveProgress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const delegationProgress = useApproveDelegationProgress(delegateTokens);
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
      case Step.THREE:
        return {
          buttonLabel: "Continue",
          action: moveReviewPositions,
        };
      default:
        throw Error("Can not handle current step");
    }
  };

  // Private functions
  const moveApproveStep = () => {
    if (aTokenBalances.filter((t) => t.balance?.toString() !== "0").length === 0) return;
    changeStep(currentStep + 1);
  };

  const moveDelegationStep = () => {
    console.log(approveProgress);
    // check all the a tokens are approved
    if (approveProgress !== 1) {
      /**
       * @Todo add toast to ask user to approve all tokens
       */
      return;
    }
    changeStep(currentStep + 1);
  };

  const moveReviewPositions = () => {
    if (delegationProgress !== 1) {
      /**
       * @Todo add toast to ask user to approve all tokens
       */
    }
    changeStep(currentStep + 1);
  };

  return {
    currentStep,
    actions: {
      changeStep,
      buttonFlow,
    },
  };
}
