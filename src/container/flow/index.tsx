import { Connection } from "../connection/index";
import useNotification from "hooks/useNotification";
import useApproveDelegationProgress from "hooks/useApproveDelegationProgress";
import useApproveProgress from "hooks/useApproveProgress";
import { TokenType } from "../../types/token.types";
import { aTokenList, stableDebtTokenList, variableDebtTokenList } from "../../constants/tokens";
import useTokens from "hooks/useTokens";
import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";
import useDelegation from "hooks/useDelegation";

export const Flow = createContainer(useFlow);

function useFlow() {
  const [loading, setLoading] = React.useState(false);
  const { account } = Connection.useContainer();
  const {
    balances: aTokenBalances,
    allowances: aTokenAllowances,
    actions: { fetchAllowance },
  } = useTokens(aTokenList, TokenType.AToken);
  const {
    balances: stableDebtTokenBalances,
    allowances: stableDebtTokenAllowances,
    actions: { fetchAllowance: fetchStableDebtTokenAllowance },
  } = useTokens(stableDebtTokenList, TokenType.DebtToken);
  const {
    balances: variableDebtTokenBalances,
    allowances: variableDebtTokenAllownaces,
    actions: { fetchAllowance: fetchVariableDebtTokenAllownace },
  } = useTokens(variableDebtTokenList, TokenType.DebtToken);

  const { delegateTokens } = useDelegation(
    stableDebtTokenBalances,
    stableDebtTokenAllowances,
    variableDebtTokenBalances,
    variableDebtTokenAllownaces
  );
  const approveProgress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const delegationProgress = useApproveDelegationProgress(delegateTokens);
  const [currentStep, setCurrentStep] = React.useState<Step>(Step.ONE);
  const { notify } = useNotification();

  // usePolling(() => {
  //   fetchAllowance();
  //   fetchStableDebtTokenAllowance();
  //   fetchVariableDebtTokenAllownace();
  // }, 5000);

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
    if (aTokenBalances.filter((t) => t.balance?.toString() !== "0").length === 0 || !account) return;
    changeStep(currentStep + 1);
  };

  const moveDelegationStep = async () => {
    await fetchAllowance();
    setLoading(false);
    // check all the a tokens are approved
    if (approveProgress !== 1) {
      notify({
        title: "Approval Pending",
        description: "Please approve all the tokens",
      });
      return;
    }
    changeStep(currentStep + 1);
  };

  const moveReviewPositions = async () => {
    setLoading(true);
    await fetchStableDebtTokenAllowance();
    await fetchVariableDebtTokenAllownace();
    setLoading(false);
    if (delegationProgress !== 1) {
      notify({
        title: "Delegation Pending",
        description: "Please delegate all the tokens",
      });
    }
    changeStep(currentStep + 1);
  };

  return {
    currentStep,
    loading,
    actions: {
      changeStep,
      buttonFlow,
    },
  };
}
