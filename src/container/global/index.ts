import React from "react";
import { createContainer } from "unstated-next";
import { Step } from "../../types/app.types";
import { useImmerReducer } from "use-immer";

enum ACTIONS {
  TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL",
  SET_TO_SIGNER = "SET_TO_SIGNER",
  SET_FROM_SIGNER = "SET_FROM_SIGNER",
  CLEAR_SIGNERS = "CLEAR_SIGNERS",
}

const initialSignerState = {
  from: {
    address: "",
    signer: null,
  },
  to: {
    address: "",
    signer: null,
  },
};

const initialState = {
  modal: {
    isOpen: false,
  },
  signer: initialSignerState,
};

type ActionType =
  | { type: ACTIONS.TOGGLE_WALLET_MODAL; payload: boolean }
  | { type: ACTIONS.SET_TO_SIGNER; payload: { signer: any; address: string } }
  | { type: ACTIONS.SET_FROM_SIGNER; payload: { signer: any; address: string } }
  | { type: ACTIONS.CLEAR_SIGNERS };

export const Global = createContainer(useGlobal);

function useGlobal() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const toggleWalletModal = React.useCallback(
    (payload: boolean) => {
      dispatch({ type: ACTIONS.TOGGLE_WALLET_MODAL, payload });
    },
    [dispatch]
  );

  const setToSigner = React.useCallback(
    (payload: { signer: any; address: string }) => {
      dispatch({ type: ACTIONS.SET_TO_SIGNER, payload });
    },
    [dispatch]
  );

  const setFromSigner = React.useCallback(
    (payload: { signer: any; address: string }) => {
      dispatch({ type: ACTIONS.SET_FROM_SIGNER, payload });
    },
    [dispatch]
  );

  const clearSigners = React.useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_SIGNERS });
  }, [dispatch]);

  return {
    state,
    actions: {
      toggleWalletModal,
      setToSigner,
      setFromSigner,
      clearSigners,
    },
  };
}

const reducer = (draft: typeof initialState, action: ActionType): any => {
  switch (action.type) {
    case ACTIONS.TOGGLE_WALLET_MODAL:
      draft.modal.isOpen = action.payload;
      break;
    case ACTIONS.SET_TO_SIGNER:
      draft.signer.to.address = action.payload.address;
      draft.signer.to.signer = action.payload.signer;
      break;
    case ACTIONS.SET_FROM_SIGNER:
      draft.signer.from.address = action.payload.address;
      draft.signer.from.signer = action.payload.signer;
      break;
    case ACTIONS.CLEAR_SIGNERS:
      draft.signer = initialSignerState;
      break;
    default:
      return draft;
  }
};
