import React from "react";
import { createContainer } from "unstated-next";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEY } from "../../constants/storage";
import { useWeb3React } from "@web3-react/core";
import { CHAIN_ID } from "../../connector";
import { SUPPORTED_WALLETS } from "../../constants/wallet";

enum ACTIONS {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
}
type ActionType =
  | { type: ACTIONS.LOGIN_REQUEST }
  | { type: ACTIONS.LOGIN_SUCCESS; payload: { address: string } }
  | { type: ACTIONS.LOGIN_FAIL }
  | { type: ACTIONS.LOGOUT };

const { CONNECTOR_ID } = STORAGE_KEY;

const initialState = {
  isLoading: false,
  address: "",
};

export const User = createContainer(useUser);

function useUser() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { active, account, activate, deactivate, chainId } = useWeb3React();
  const [, setConnectorId] = useLocalStorage(
    CONNECTOR_ID.name,
    CONNECTOR_ID.defaultValue
  );

  React.useEffect(() => {
    console.log("here>>");
    console.log(active, account, chainId);
    if (active && account && chainId) {
      console.log("here?");
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { address: account } });
      const isWrongNetwork = chainId !== CHAIN_ID.Ethereum;
      if (isWrongNetwork) {
        window.alert("Unsupported chain");
        // @ts-ignore
        // wrongNetworkRef.current = notifyError({
        //     title: "Wrong network",
        //     description: `Please switch network to xDai.`,
        //     isClosable: true,
        //     duration: null,
        // })
      } else {
        // if (wrongNetworkRef.current) {
        //     closeNotify(wrongNetworkRef.current)
        // }
      }
    }
  }, [account, active, chainId]);

  const login = React.useCallback(
    (
      instance: AbstractConnector,
      connectorId: string,
      onActivate?: Function
    ) => {
      dispatch({ type: ACTIONS.LOGIN_REQUEST });
      setConnectorId(connectorId);
      activate(instance, () => {}, true)
        .then(() => {
          if (onActivate) {
            onActivate();
          }
          console.log("connect success");
        })
        .catch((err) => {
          setConnectorId("");
          dispatch({ type: ACTIONS.LOGIN_FAIL });
          console.log(err);
        });
    },
    [dispatch, setConnectorId, activate]
  );

  //auto login
  const [isTried, setIsTried] = React.useState(false);
  const [connectorId] = useLocalStorage(
    CONNECTOR_ID.name,
    CONNECTOR_ID.defaultValue
  );
  React.useEffect(() => {
    const connector = SUPPORTED_WALLETS.find(
      (walletInfo) => walletInfo.id === connectorId
    )?.connector;
    if (!isTried && connector) {
      console.log("auto login...");
      login(connector, connectorId);
      setIsTried(true);
    }
  }, [connectorId, isTried, login]);

  return {
    state,
    actions: {
      login,
    },
  };
}

function reducer(state: typeof initialState, action: ActionType) {
  switch (action.type) {
    case ACTIONS.LOGIN_REQUEST: {
      return { ...state, isLoading: true };
    }
    case ACTIONS.LOGIN_SUCCESS: {
      const { address } = action.payload;
      return { ...state, isLoading: false, address };
    }
    case ACTIONS.LOGIN_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ACTIONS.LOGOUT: {
      return {
        ...state,
        address: "",
      };
    }
    default:
      throw new Error();
  }
}
