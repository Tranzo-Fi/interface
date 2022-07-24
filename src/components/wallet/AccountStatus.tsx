import Avatar from "boring-avatars";
import { Flex, Text } from "rebass/styled-components";

import { User } from "../../container/user";
import { truncateAddress } from "../../utils/address";

type Props = {};

const AccountStatus = (props: Props) => {
  const {
    state: { address },
  } = User.useContainer();
  return (
    <Flex
      backgroundColor={"fadedDark"}
      height={"auto"}
      padding={10}
      paddingX={15}
      sx={{
        borderRadius: 15,
        border: `1px solid #262638`,
        "&:hover": {
          cursor: "pointer",
        },
      }}
    >
      <Avatar
        size={25}
        name={address}
        variant="sunset"
        colors={["#2623dd", "#6462de", "#939398", "#4a4a5c", "#5757ae"]}
      />
      <Text alignSelf={"center"} ml={2}>
        {truncateAddress(address)}
      </Text>
    </Flex>
  );
};

export default AccountStatus;
