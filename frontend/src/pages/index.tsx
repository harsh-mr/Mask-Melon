import type { NextPage } from "next";
import {
  Box,
  Button,
  Center,
  Heading,
  Wrap,
  WrapItem,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      {/* <Center> */}
      <Box paddingTop={200} height="100%" textAlign="center" color="white">
        {/* <Heading fontSize="50px" lineHeight="1.2">
          Just whip up a payment link and voila! 
            </Heading>
          <Heading fontSize="50px" lineHeight="1.2">
          Your on-chain history stays under wraps          
          </Heading> */}

        <Text fontSize="6xl" fontFamily={"heading"}>
          The convert superhero of payment protocols!{" "}
        </Text>
        <Text fontSize="6xl" color="#EF14A9">
          Your on-chain history stays under wraps{" "}
        </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "30px",
          }}
        >
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
                    // fontFamily: "Montserrat",
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
      </Box>
      {/* </Center> */}
    </>
  );
};

export default Home;
