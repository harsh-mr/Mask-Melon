export const PolygonMumbai = '80001';
export const HarmonyTestnet = '1666700000';
export const HarmonyMainnet = '1666600000';
export const ArbitrumTestnet = '421614';
export const ScrollTest = '534351';
export const Celo = '44787';

export const CHAINS: {
  [key: string]: {
    chainName: string,
    rpcUrl: string,
    blockExplorerUrl: string,
    nativeCurrency: string,
    nativeCurrencyDecimals: number,
    testnet: boolean,
  }
} = {
  [PolygonMumbai]: {
    chainName: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.matic.today',
    blockExplorerUrl: 'https://mumbai.polygonscan.com/',
    nativeCurrency: 'MATIC',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [HarmonyTestnet]: {
    chainName: 'Harmony Testnet',
    rpcUrl: 'https://api.s0.b.hmny.io',
    blockExplorerUrl: 'https://explorer.pops.one/',
    nativeCurrency: 'ONE',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [HarmonyMainnet]: {
    chainName: 'Harmony',
    rpcUrl: 'https://api.harmony.one',
    blockExplorerUrl: 'https://explorer.harmony.one/',
    nativeCurrency: 'ONE',
    nativeCurrencyDecimals: 18,
    testnet: false,
  },
  [ArbitrumTestnet]: {
    chainName: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    nativeCurrency: 'ETH',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [ScrollTest]: {
    chainName: 'Scroll Testnet',
    rpcUrl: 'https://sepolia-rpc.scroll.io',
    blockExplorerUrl: 'https://sepolia-blockscout.scroll.io/',
    nativeCurrency: 'ETH',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [Celo]: {
    chainName: 'Celo',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorerUrl: 'https://alfajores.celoscan.io/',
    nativeCurrency: 'CELO',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
}

export const isTestnet = (chainId: string | undefined): boolean => {
  return chainId ? CHAINS[chainId]?.testnet : false;
}