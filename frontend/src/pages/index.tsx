import type { NextPage } from "next";
import { Box, Button, Center, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Center>
        <Box textAlign="center" color="white">
          <Heading fontSize="50px" lineHeight="1.2">
            Rescue Your Ethereum Tokens & NFTs
          </Heading>
          <Heading fontSize="50px" lineHeight="1.2">
            From Compromised Accounts
          </Heading>
        </Box>
      </Center>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Wrap>
          <WrapItem>
            <Box>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textTransform: "none",
                  fontFamily: "Montserrat",
                  fontSize: "1rem",
                  py: 2,
                  px: 8,
                  borderRadius: "40px",
                  backgroundImage: "linear-gradient(90deg, #BE14EC, #EF14A9)",
                }}
                onClick={() => router.push("/create")}
              >
                Create link
              </Button>
            </Box>
          </WrapItem>
          <WrapItem>
            <Box>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textTransform: "none",
                  fontFamily: "Montserrat",
                  fontSize: "1rem",
                  py: 2,
                  px: 8,
                  borderRadius: "40px",
                  backgroundImage: "linear-gradient(90deg, #BE14EC, #EF14A9)",
                }}
                onClick={() => router.push("/redeem")}
              >
                Redeem tokens
              </Button>
            </Box>
          </WrapItem>
        </Wrap>
      </div>
    </>
  );
};

export default Home;
