import { CHAIN_ID } from "connector";
import { aTokenList } from "constants/tokens";
import { Connection } from "container/connection";
import { TRANZO_CONTRACT_ADDRESS } from "container/contract";
import { ethers } from "ethers";
import useApproveProgress from "hooks/useApproveProgress";
import useToken from "hooks/useToken";
import useTokens, { AllownaceTokenType } from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass/styled-components";
import { TokenType } from "../types/token.types";
import ApproveTokenItem from "./ApproveTokenItem";
import Layout from "./primitives/Layout";

type Props = {};

const Progress = ({ progress }: { progress: number }) => {
  return (
    <Box
      bg={"flash"}
      width={`${progress * 100}%`}
      height={14}
      mt={1}
      sx={{
        borderRadius: "10px",
      }}
    ></Box>
  );
};

const Approve = (props: Props) => {
  const { account } = Connection.useContainer();
  const { balances: aTokenBalances, allowances: aTokenAllowances } = useTokens(aTokenList, TokenType.AToken);
  const progress = useApproveProgress(aTokenAllowances, aTokenBalances);
  const { approve } = useToken(TokenType.AToken);

  const doApprove = React.useCallback(
    (tokenAddress: string, amount: ethers.BigNumber) => {
      approve(tokenAddress, TRANZO_CONTRACT_ADDRESS[CHAIN_ID.Kovan], amount);
    },
    [approve]
  );

  console.log("aTokenAllowances", aTokenAllowances);

  const approveTokens = React.useMemo(() => {
    return (
      account &&
      aTokenBalances
        .filter((t) => t.balance.toString() !== "0")
        .map((token, i) => (
          <ApproveTokenItem
            key={token.address}
            onClick={doApprove}
            balance={token}
            allowance={aTokenAllowances?.find((t) => t.symbol === token.symbol) as AllownaceTokenType}
          />
        ))
    );
  }, [aTokenBalances, aTokenAllowances, doApprove, account]);

  return (
    <Layout title={"Approve aTokens"}>
      <Box px={3}>
        <Flex
          p={10}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #262638`,
          }}
        >
          <Box width={"97%"}>
            <Progress progress={progress} />
          </Box>
          <Box width={"2%"}>
            <i className="fa fa-info-circle flash" aria-hidden="true"></i>
          </Box>
        </Flex>
        <Box minHeight={"55vh"}>
          <Flex flexWrap={"wrap"}>{approveTokens}</Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Approve;
