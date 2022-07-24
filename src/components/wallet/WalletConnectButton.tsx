import React from "react";
import { Button } from "rebass/styled-components";
import { Global } from "../../container/global";

type Props = {};

const WalletConnectButton = (props: Props) => {
  const {
    actions: { toggleWalletModal },
  } = Global.useContainer();

  function openWalletModal() {
    toggleWalletModal(true);
  }
  return (
    <Button
      color={"white"}
      bg={"flash"}
      height={45}
      sx={{
        border: `1.5px solid #6462de`,
        ":hover": {
          backgroundColor: "fadedFlash",
          cursor: "pointer",
        },
      }}
      onClick={openWalletModal}
    >
      Connect Wallet
    </Button>
  );
};

export default WalletConnectButton;
