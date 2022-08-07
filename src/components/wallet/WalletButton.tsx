import React from "react";
import { Flex, Image, Box, Text } from "rebass/styled-components";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { User } from "../../container/user";

type Props = {
  name: string;
  description: string;
  icon: string;
  connector: AbstractConnector;
  id: string;
};

const WalletButton = ({ name, description, icon, connector, id }: Props) => {
  // const {
  //   actions: { toggleWalletModal },
  // } = Global.useContainer();
  const {
    actions: { login },
  } = User.useContainer();
  const { connector: activeConnector } = useWeb3React();

  const isActiveConnector = connector === activeConnector;

  const handleOnClick = React.useCallback(() => {
    if (!isActiveConnector) {
      if (id === "metamask" && window.ethereum) {
        window?.ethereum // for account selection
          ?.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          })
          .then(() => {
            login(connector, id);
          });
      } else {
        login(connector, id);
      }
    }
    // toggleWalletModal(false);
  }, [isActiveConnector, login, connector, id]);

  return (
    <Flex
      onClick={handleOnClick}
      mt={3}
      padding={15}
      sx={{
        border: "1px solid",
        borderColor: "dullDark",
        borderRadius: 10,
        transition: "0.5s",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "fadedDark",
        },
      }}
    >
      <Image src={icon} width={40} height={40} />
      <Box ml={3}>
        <Text fontFamily={"Roboto Mono"} fontSize={16} color={"flash"}>
          {name}
        </Text>
        <Text fontFamily={"Roboto Mono"} fontSize={12} color={"grey"}>
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default WalletButton;
