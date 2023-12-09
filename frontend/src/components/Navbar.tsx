import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { shortenAddress } from "../utils/address";
import { GlobalContext } from "../contexts/GlobalContext";
import {
  GroupBase,
  OnChangeValue,
  OptionBase,
  Select,
} from "chakra-react-select";
import { CHAINS, isTestnet } from "../utils/chains";
import { ethers } from "ethers";
import Link from "next/link";

const pages = ["Home", "FAQs"];

interface NetworkOption extends OptionBase {
  label: string;
  value: string;
}

const ResponsiveAppBar = () => {
  const router = useRouter();

  const {
    provider,
    chainId,
    connect,
    switchChain,
    easyLinkToken: easyLinkToken,
  } = useContext(GlobalContext);
  const [account, setAccount] = useState<string>();
  const [mintLoading, setMintLoading] = useState<boolean>();
  const [networkOptions, setNetworkOptions] = useState<
    GroupBase<NetworkOption>[]
  >([]);

  useEffect(() => {
    if (!account && provider) {
      provider
        .getSigner(0)
        .getAddress()
        .then((account: string) => {
          setAccount(account);
        });
    }
  });

  const connectWallet = async () => {
    await connect();
  };

  const switchChainLocal = (e: OnChangeValue<NetworkOption, false>) => {
    if (!e) {
      return;
    }
    switchChain(parseInt(e.value));
  };

  const getTestTokens = async () => {
    if (!easyLinkToken) {
      console.log("getTestTokens() no easyLinkToken");
      return;
    }

    setMintLoading(true);
    try {
      const mint = await easyLinkToken.mint(ethers.utils.parseEther("10"));
      await mint.wait(1);
    } finally {
      setMintLoading(false);
    }
  };

  useEffect(() => {
    const mainNetworks: NetworkOption[] = [];
    const testNetworks: NetworkOption[] = [];
    Object.entries(CHAINS).forEach((entry) => {
      const option = {
        label: entry[1].chainName,
        value: entry[0],
      };

      if (entry[1].testnet) {
        testNetworks.push(option);
      } else {
        mainNetworks.push(option);
      }
    });

    setNetworkOptions([
      {
        label: "mainnets",
        options: mainNetworks,
      },
      {
        label: "testnets",
        options: testNetworks,
      },
    ]);
  }, []);

  return (
    <AppBar
      position="static"
      sx={{ px: 12, py: 3 }}
      style={{ background: "none", boxShadow: "none" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href={`/`}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              EasyLink
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              pl: 9,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textTransform: "none",
                  fontFamily: "Montserrat",
                  fontSize: "1.1rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Button
            sx={{
              my: 2,
              color: "white",
              display: "block",
              textTransform: "none",
              fontFamily: "Montserrat",
              fontSize: "1.1rem",
              py: 2,
              px: 8,
              borderRadius: "40px",
              backgroundImage: "linear-gradient(90deg, #BE14EC, #EF14A9)",
            }}
          >
            {account ? shortenAddress(account) : "Connect Wallet"}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
