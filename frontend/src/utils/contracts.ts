import EasyLink from "../contracts/EasyLink.sol/EasyLink.json";
import EasyLinkToken from "../contracts/EasyLinkToken.sol/EasyLinkToken.json";
import { HarmonyMainnet, HarmonyTestnet, PolygonMumbai } from "./chains";

export const easyLink = 'easyLink';
export const easyLinkToken = 'easyLinkToken';

export const CONTRACTS: {
  [name: string]: {
    [chainId: string]: {
      address: string,
      deploymentBlock?: number
    }
  }
} = {
  [easyLink]: {
    // [PolygonMumbai]: {
    //   address: '0xD220E708a12E6162C9c3D3d360233E1296613FfF',
    //   deploymentBlock: 43006828
    // },
    [PolygonMumbai]: {
      address: '0x2f9FAB80D96BA8aAf4e4Aa0ab20D98c798Cd2318',
      deploymentBlock: 43353099
    },
    [HarmonyTestnet]: {
      address: '0xF71eCB6F691ed1E150D4Fe130170A00fFEB44a45',
      deploymentBlock: 24697828
    },
    [HarmonyMainnet]: {
      address: '0xA713FDDAC50e63a7846134fAb3ebA290938100c2',
      deploymentBlock: 26252855
    },
  },
  [easyLinkToken]: {
    [PolygonMumbai]: {
      address: '0xd87c1c8D7B6780668E4b1E24B9ABf9880688b795',
    },
    [HarmonyTestnet]: {
      address: '0xb67379b8b6242D79bE2107D0e18ddD870E4a861A',
    },
    [HarmonyMainnet]: { // Wrapped UST
      address: '0x224e64ec1bdce3870a6a6c777edd450454068fec',
    }
  }
}

export const CONTRACT_TO_ABI: { [n: string]: any } = {
  [easyLink]: [...EasyLink.abi],
  [easyLinkToken]: [...EasyLinkToken.abi]
}