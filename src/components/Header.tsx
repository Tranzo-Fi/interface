import { Box, Flex, Image } from "rebass/styled-components";
import { Logo } from "../app/assets";
import { User } from "../container/user";
import AccountStatus from "./wallet/AccountStatus";
import WalletConnectButton from "./wallet/WalletConnectButton";

type Props = {};

const Header = (props: Props) => {
  const {
    state: { address },
  } = User.useContainer();
  return (
    <>
      <Flex mx={30} justifyContent={"space-between"} py={15}>
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
        <Box color={"flash"} fontFamily={"primary"}>
          {address ? <AccountStatus /> : <WalletConnectButton />}
        </Box>
      </Flex>
      <Box width={"100%"} height={0.25} bg={"dullDark"} />
    </>
  );
};

export default Header;
