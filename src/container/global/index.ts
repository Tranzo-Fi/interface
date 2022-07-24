import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";
import { useImmerReducer } from "use-immer";

enum ACTIONS {
  TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL",
  CHANGE_FLOW = "CHANGE_FLOW",
}

const initialState = {
  modal: {
    isOpen: false,
  },
  flow: {
    currentStep: Step.ONE,
  },
};

type ActionType =
  | { type: ACTIONS.TOGGLE_WALLET_MODAL; payload: boolean }
  | { type: ACTIONS.CHANGE_FLOW; payload: Step };

export const Global = createContainer(useGlobal);

function useGlobal() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const toggleWalletModal = React.useCallback(
    (payload: boolean) => {
      dispatch({ type: ACTIONS.TOGGLE_WALLET_MODAL, payload });
    },
    [dispatch]
  );
  const changeFlow = React.useCallback(
    (payload: Step) => {
      dispatch({ type: ACTIONS.CHANGE_FLOW, payload });
    },
    [dispatch]
  );

  return {
    state,
    actions: {
      toggleWalletModal,
      changeFlow,
    },
  };
}

const reducer = (draft: typeof initialState, action: ActionType): any => {
  switch (action.type) {
    case ACTIONS.TOGGLE_WALLET_MODAL:
      draft.modal.isOpen = action.payload;
      break;
    case ACTIONS.CHANGE_FLOW:
      draft.flow.currentStep = action.payload;
      break;
    default:
      return draft;
  }
};
