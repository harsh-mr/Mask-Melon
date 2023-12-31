import { HardhatUserConfig, subtask, task } from "hardhat/config";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";
import "hardhat-circom";
import * as path from "path";
import { TASK_CIRCOM_TEMPLATE } from "hardhat-circom";
import { Artifact, HardhatRuntimeEnvironment } from "hardhat/types";
import { ZkeyFastFile } from "hardhat-circom/src";
import fs from "fs";
// @ts-ignore
import { poseidonContract } from "circomlibjs";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";

const TASK_COMPILE_HASHER = "compile:hasher";

require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const TESTNET_PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const POLYGON_SCAN_API_KEY = process.env.POLYGON_SCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  circom: {
    inputBasePath: "./circuits",
    outputBasePath: "./artifacts/circuits",
    ptau: "pot12_final.ptau",
    circuits: [{
      name: "withdraw",
      input: "input.json",
      version: 2,
    }],
  },
  typechain: {
    outDir: "artifacts/contracts/types",
    target: "ethers-v5"
  },
  networks: {
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    },
    harmonyTest: {
      url: "https://api.s0.b.hmny.io",
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    },
    harmony: {
      url: "https://api.harmony.one",
      accounts: [`${MAINNET_PRIVATE_KEY}`]
    },
    arbitrumTest: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    },
    scrollTest: {
      url: "https://scroll-testnet-public.unifra.io",
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    },
    celoTest: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: `${POLYGON_SCAN_API_KEY}`,
      harmonyTest: "harmonyTest",
      harmony: "harmony",
    }
  }
}

export default config;

type ZKeys = {
  zkeys: ZkeyFastFile[];
}

subtask(TASK_CIRCOM_TEMPLATE, "generate Verifier template shipped by SnarkJS")
  .setAction(async ({ zkeys }: ZKeys, hre: HardhatRuntimeEnvironment) => {

    const groth16Template = fs.readFileSync(path.resolve("./circuits/template/verifier_groth16.sol.ejs"), "utf8");

    let combinedVerifier = "";
    for (const zkey of zkeys) {
      const verifierSol = await hre.snarkjs.zKey.exportSolidityVerifier(zkey, {
        groth16: groth16Template,
        plonk: "",
      });
      combinedVerifier += verifierSol;
    }

    fs.writeFileSync("./artifacts/circuits/Verifier.sol", combinedVerifier);
  });

subtask(TASK_COMPILE_HASHER)
  .setAction(async (hre: HardhatRuntimeEnvironment) => {
    const outputPath = path.join(__dirname, "artifacts", "contracts", "PoseidonHasher.sol");
    const outputFile = path.join(outputPath, "PoseidonHasher.json");

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const contract: Artifact = {
      _format: "hh-sol-artifact-1",
      contractName: "PoseidonHasher",
      sourceName: "contracts/PoseidonHasher.sol",
      abi: poseidonContract.generateABI(2),
      bytecode: poseidonContract.createCode(2),
      deployedBytecode: "",
      linkReferences: {},
      deployedLinkReferences: {},
    }

    fs.writeFileSync(outputFile, JSON.stringify(contract, null, 2));
  });

task(TASK_COMPILE, "Compiles the entire project, building all artifacts")
  .setAction(async (taskArguments, hre, runSuper) => {
    await runSuper(taskArguments);
    await hre.run(TASK_COMPILE_HASHER);
  });
