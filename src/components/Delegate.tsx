import { stableDebtTokenList, variableDebtTokenList } from "constants/tokens";
import useTokens, { BalanceTokenType } from "hooks/useTokens";
import React from "react";
import { Box, Flex } from "rebass";
import { TokenType } from "types/token.types";
import DelegateTokenItem from "./DelegateTokenItem";
import Layout from "./primitives/Layout";
import Progress from "./primitives/Progress";

type Props = {};

const Delegate = (props: Props) => {
  const { balances: stableDebtTokenBalances } = useTokens(stableDebtTokenList, TokenType.DebtToken);
  const { balances: variableDebtTokenBalances } = useTokens(variableDebtTokenList, TokenType.DebtToken);

  const stableDelegateTokens = React.useMemo(
    () => stableDebtTokenBalances.filter((t) => t?.balance?.toString() !== "0"),
    [stableDebtTokenBalances]
  );
  const variableDelegateTokens = React.useMemo(
    () => variableDebtTokenBalances.filter((t) => t?.balance?.toString() !== "0"),
    [variableDebtTokenBalances]
  );

  const delegateTokens = React.useMemo(
    () => ([] as any).concat(stableDelegateTokens, variableDelegateTokens),
    [stableDelegateTokens, variableDelegateTokens]
  );

  return (
    <Layout title={"Aprove Delegation"}>
      <Box px={3}>
        <Flex
          p={10}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #262638`,
          }}
        >
          <Box width={"97%"}>
            <Progress progress={0.4} />
          </Box>
          <Box width={"2%"}>
            <i className="fa fa-info-circle flash" aria-hidden="true"></i>
          </Box>
        </Flex>
        <Box minHeight={"55vh"}>
          <Flex flexWrap={"wrap"}>
            {delegateTokens.map((t: BalanceTokenType, index: number) => {
              return <DelegateTokenItem key={t?.address} token={t} />;
            })}
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Delegate;
