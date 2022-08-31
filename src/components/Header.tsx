import { useWeb3React } from "@web3-react/core";
import { CHAIN_ID } from "connector";
import { Connection } from "container/connection";
import useNetwork from "hooks/useNetwork";
import { Box, Text, Flex, Image } from "rebass/styled-components";
import { Logo } from "../app/assets";
import { User } from "../container/user";
import AccountStatus from "./wallet/AccountStatus";
import WalletConnectButton from "./wallet/WalletConnectButton";

type Props = {};

const Header = (props: Props) => {
  const {
    state: { address },
  } = User.useContainer();
  const { chainId } = Connection.useContainer();
  const { library } = useWeb3React();
  const { switchNetwork } = useNetwork();
  return (
    <>
      <Flex mx={30} justifyContent={"space-between"} py={15}>
        <Flex>
          <Image
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
            height={50}
            width={50}
            src={Logo}
          />
          <Text
            fontSize={22}
            fontWeight={"bold"}
            ml={2}
            display={"grid"}
            alignContent={"center"}
            fontFamily={"Roboto Mono"}
            color={"flash"}
          >
            Tranzo.
          </Text>
        </Flex>

        <Box
          sx={{
            "@media screen and (max-width: 40em)": {
              display: "none",
            },
          }}
          color={"flash"}
          fontFamily={"primary"}
        >
          <Flex>
            {library && (
              <Box
                onClick={() => switchNetwork(library, 137)}
                p={2}
                fontSize={12}
                height={40}
                mt={1}
                sx={{
                  borderRadius: 8,
                  border: `1px solid #54b7ab`,
                  transition: "0.3s",
                  "&:hover": {
                    cursor: "pointer",
                    background: "#54b7ab",
                  },
                }}
                backgroundColor={"flash"}
                color={"white"}
                display={"grid"}
                alignContent={"center"}
                mr={2}
              >
                {chainId !== CHAIN_ID.Kovan ? "Switch to Polygon" : "Polygon Mainnet"}
              </Box>
            )}
            {address ? chainId === 137 ? <AccountStatus /> : null : <WalletConnectButton />}
          </Flex>
        </Box>
      </Flex>
      <Box width={"100%"} height={0.25} bg={"dullDark"} />
    </>
  );
};

export default Header;
