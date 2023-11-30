# Easy private payments protocol

This payment protocol is focusing on hiding the recipient's address and, as result, hiding all financial history from the sender.

## Build the project

```
yarn
yarn run circuit:build
yarn run build
```

## Run smart contract tests

```
yarn run test
```

## Build frontend

```
cd frontend && yarn
rm -rf ./src/contracts && cp -r ../artifacts/contracts ./src
```

## Start app locally

Start local blockchain:

```
npx hardhat node
```

Deploy smart contracts

```
npx hardhat run scripts/deploy.ts --network localhost
```

Start local frontend

```
cd frontend && yarn dev
```
