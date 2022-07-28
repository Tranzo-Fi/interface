import { Box, Flex, Text } from "rebass/styled-components";
import Layout from "./primitives/Layout";
import TokenItem from "./TokenItem";

type Props = {};

const PositionTable = (props: Props) => {
  return (
    <>
      <Layout title={"Your Positions"}>
        <Flex p={10} height={"auto"}>
          {/* Deposit Column */}
          <Box width={1 / 3}>
            <Box
              sx={{
                borderBottom: `1px solid #262638`,
              }}
            >
              <Text
                color={"grey"}
                fontFamily={"Roboto Mono"}
                textAlign={"center"}
                p={`10px 0px 15px 0px`}
              >
                Deposits
              </Text>
            </Box>
            {/* Deposit Token List */}
            <Box
              flexDirection={"column"}
              display={"flex"}
              my={2}
              alignItems={"center"}
              sx={{
                height: "50vh",
                borderRight: `1px solid #262638`,
              }}
            >
              <TokenItem token={"wBTC"} balance={"10.087"} />
            </Box>
          </Box>
          {/* Debt Column */}
          {/* Stable Debt Column */}
          <Box width={1 / 3}>
            <Box
              sx={{
                borderBottom: `1px solid #262638`,
              }}
            >
              <Text
                color={"grey"}
                fontFamily={"Roboto Mono"}
                textAlign={"center"}
                p={`10px 0px 15px 0px`}
              >
                Stable Debts
              </Text>
            </Box>
            <Box
              flexDirection={"column"}
              display={"flex"}
              my={2}
              alignItems={"center"}
              sx={{
                height: "50vh",
                borderRight: `1px solid #262638`,
              }}
            >
              <TokenItem token={"DAI"} balance={"150.067"} />
            </Box>
          </Box>
          {/* Variable Debt Column */}
          <Box width={1 / 3}>
            <Box
              sx={{
                borderBottom: `1px solid #262638`,
              }}
            >
              <Text
                color={"grey"}
                fontFamily={"Roboto Mono"}
                textAlign={"center"}
                p={`10px 0px 15px 0px`}
              >
                Variable Debts
              </Text>
            </Box>
            <Box
              flexDirection={"column"}
              display={"flex"}
              my={2}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <TokenItem token={"USDC"} balance={"102.056"} />
              <TokenItem token={"USDC"} balance={"102.056"} />
              <TokenItem token={"MANA"} balance={"69.056"} />
            </Box>
          </Box>
        </Flex>
      </Layout>
    </>
  );
};

export default PositionTable;
