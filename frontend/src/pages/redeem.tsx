import { Box, Button, Center, Text, Textarea, VStack } from "@chakra-ui/react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { BigNumber } from "ethers";
import { MerkleTree } from "fixed-merkle-tree";
import { generateProof } from "../utils/proof";
import { CheckIcon } from "@chakra-ui/icons";
import { populateEvents } from "../utils/events";
import { LocalStoredEvent } from "../utils/storage";
import { decodeNote } from "../utils/note";

const Redeem = () => {
  const context = useContext(GlobalContext);

  const [secretBase64, setSecretBase64] = useState<string>();
  const [error, setError] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [nullifier, setNullifier] = useState<string>();
  const [redeemLoading, setRedeemLoading] = useState<boolean>();
  const [redeemed, setRedeemed] = useState<boolean>();

  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<LocalStoredEvent[]>([]);

  useEffect(() => {
    if (!context.easyLink || !context.chainId || !context.provider) {
      console.log("context.easyLink", context.easyLink);
      console.log("context.chainId", context.chainId);
      console.log("context.provider", context.provider);
      return;
    }

    setEventsLoading(true);
    populateEvents(context.easyLink, context.chainId, context.provider)
      .then((events) => setEvents(events))
      .catch(console.log)
      .finally(() => setEventsLoading(false));
  }, [context.easyLink, context.chainId, context.provider]);

  useEffect(() => {
    if (!secretBase64) {
      console.log("base not found");
      return;
    }
    console.log("secret", secretBase64);

    setRedeemLoading(true);
    const [nullifierLocal, secretLocal] = decodeNote(secretBase64);
    console.log(nullifierLocal, " ", secretLocal);
    if (!nullifierLocal || !secretLocal) {
      setError("Provided secret is not valid");
      setRedeemLoading(false);
      return;
    }

    setNullifier(nullifierLocal.toString());
    setSecret(secretLocal.toString());

    const commitment = context.hasher
      .hash(BigNumber.from(nullifierLocal), BigNumber.from(secretLocal))
      .toString();
    console.log(commitment);
    const paidCommitment = events.filter((it) => it.commitment === commitment);
    if (paidCommitment.length == 0) {
      setError("Related payment link wasn't payed yet");
      setRedeemLoading(false);
      return;
    }

    setError(undefined);
    setRedeemLoading(false);
  }, [secretBase64, events, context.hasher]);

  const redeem = async () => {
    if (!context.easyLink || !context.chainId) {
      console.log("redeem() context.easyLink", context.easyLink);
      console.log("redeem() context.chainId", context.chainId);
      return;
    }

    if (!secret || !nullifier) {
      console.log("redeem() nullifier", nullifier);
      console.log("redeem() secret", secret);
      return;
    }

    console.log("chainId", context.chainId);

    setRedeemLoading(true);
    const commitment = context.hasher
      .hash(BigNumber.from(nullifier), BigNumber.from(secret))
      .toString();
    console.log("cComm", commitment);

    // const tree = new MerkleTree(10, [], {
    //   hashFunction: (a, b) => context.hasher.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
    //   zeroElement: "12339540769637658105100870666479336797812683353093222300453955367174479050262"
    // });
    
    const tree = new MerkleTree(10, [], {
      hashFunction: (a, b) =>
        context.hasher.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
      zeroElement:
        "12339540769637658105100870666479336797812683353093222300453955367174479050262",
    });

    console.log("ev",events)
    // changedHere
    // events.map(it => {console.log(it.commitment); })
    tree.bulkInsert(events.map(it => it.commitment));
    // tree.insert(commitment.toString());

    const merkleProof = tree.proof(commitment);
    console.log("merkle Proof", merkleProof);

    const address = (await context.provider
      ?.getSigner(0)
      .getAddress()) as string;
    const root = merkleProof.pathRoot.toString();
    console.log("root", root);
    const proof = await generateProof({
      recipient: BigNumber.from(address).toString(),
      root: root,
      nullifier: nullifier,
      secret: secret,
      pathElements: [...merkleProof.pathElements].map((it) => it.toString()),
      pathIndices: [...merkleProof.pathIndices],
    });
    console.log("proof", proof);
    const pathAsNumber = [...merkleProof.pathIndices]
      .reverse()
      .reduce(
        (previousValue, currentValue) => previousValue * 2 + currentValue,
        0
      );
    const nullifierHash = context.hasher
      .hash(BigNumber.from(nullifier), BigNumber.from(pathAsNumber))
      .toString();
    console.log("NHash", nullifierHash);

    const transaction = await context.easyLink.withdraw(
      proof.a,
      proof.b,
      proof.c,
      nullifierHash,
      address,
      root
    );
    // const transaction = await context.easyLink.withdraw([proof.pi_a[0], proof.pi_a[1]], [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]] , [proof.pi_c[0], proof.pi_c[1]], nullifierHash, address, root);
    await transaction.wait(1);

    console.log(transaction);
    setRedeemLoading(false);
    setRedeemed(true);
  };

  const onSecretChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setSecretBase64(e.target.value);
  };

  return (
    <Center>
      <VStack w={"100%"}>
        <Box w={"50%"}>
          <Textarea
            onChange={onSecretChange}
            isDisabled={eventsLoading || !context.provider}
            placeholder="Please provider a secret to redeem tokens"
            textColor="white"
          />
        </Box>
        <Box>
          <Text textColor="white">{error}</Text>
        </Box>
        <Button
          isDisabled={
            !context.provider ||
            error !== undefined ||
            redeemed ||
            !secretBase64
          }
          onClick={redeem}
          isLoading={redeemLoading}
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
        >
          {redeemed ? <CheckIcon /> : "Redeem"}
        </Button>
      </VStack>
    </Center>
  );
};

export default Redeem;
