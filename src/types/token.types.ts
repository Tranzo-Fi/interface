export type TokenType = {
  symbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  decimals: number;
};

export type TokenList = TokenType[];
