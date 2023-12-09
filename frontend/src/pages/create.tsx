import { Box, Center, Divider, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { randomBN } from "../utils/random";
import base64url from "base64url";
import Link from "next/link";
import { GlobalContext } from "../contexts/GlobalContext";

const Create = () => {
  const { symbol, hasher } = useContext(GlobalContext);

  const [origin, setOrigin] = useState<string>();
  const [link, setLink] = useState<string>();
  const [redeemSecret, setRedeemSecret] = useState<string>();

  useEffect(() => {
    if (!origin && window) {
      setOrigin(window.location.origin);
    }

    if (origin && hasher) {
      const nullifier = randomBN();
      const secret = randomBN();
      console.log("null", nullifier);
      console.log("secretKey", secret);

      const commitment = hasher.hash(nullifier, secret).toHexString().slice(2);
      console.log("comm ", commitment, parseInt(commitment));
      const base64commitment = base64url.encode(commitment);
      console.log("base64", base64commitment);
      setLink(origin + "/pay/" + base64commitment);
      setRedeemSecret(
        base64url.encode(`${nullifier.toHexString()}#${secret.toHexString()}`)
      );
    }
  }, [origin, hasher]);

  return (
    <Center>
      <Box p="6" borderRadius="md" boxShadow="lg">
        <VStack spacing="4">
          <Text textColor="white">
            Your link to receive 1 {!symbol ? "token" : symbol} is:
          </Text>
          <Box
            bg="gray.700"
            borderRadius="5px"
            p="4"
            textColor="white"
            sx={{ backgroundImage: "linear-gradient(90deg, #BE14EC, #EF14A9)" }}
          >
            {link && <Link href={link}>{link}</Link>}
          </Box>
          <Text textColor="white">
            Share it with someone who owes you money
          </Text>
          {/* <Divider /> */}
          <Text textColor="white">Use this secret to redeem tokens later:</Text>

          <Box
            bg="gray.700"
            w="40%"
            borderRadius="5px"
            p="4"
            textColor="white"
            sx={{ backgroundImage: "linear-gradient(90deg, #BE14EC, #EF14A9)" }}
          >
            <Text noOfLines={[2, 3]}>{redeemSecret}</Text>
          </Box>
        </VStack>
      </Box>
    </Center>
  );
};

export default Create;
