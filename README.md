# LazyMinting

- The node.js based backend along with frontend ejs files is uploaded on the [node](https://github.com/Ashish-Khatri8/Lazy_Minting/tree/node) branch.

- And it is deployed on [Heroku](https://lazy-minting-08.herokuapp.com/home)

## Contract: LazyMinting.sol

- Contract deployed on [ropsten test network](https://ropsten.etherscan.io/address/0xD9cad0DF1038F4EfB5C04852009AC3833c790e78) at:

```script
0xD9cad0DF1038F4EfB5C04852009AC3833c790e78
```

- [Example Transaction](https://ropsten.etherscan.io/tx/0x4b87cc65f49575da1c70276cdb31e5e1d78f9e1c191dbe960232cecd7bf37610)

- This contract deploys an ERC721 token, with lazy minting functionality, meaning it could mint off-chain signed nfts to buyers and send the buy price to the signer.

- The **mintNFT()** function takes 2 arguments:
  - An array of NFT details, w.r.t. the NFT struct in the contract, and,
  - The off-chain signed signature for this nft.

- If the EIP712 based Typed Data signature is valid, then the NFT is minted and sold.

- The Nft is minted to the off-chain signer first to establish ownership on-chain and then it is transferred to the buyer.

- Transaction reverts if the signature is invalid.

- The same signature cannot be used twice to mint the same NFT again.

- EIP-712 based Typed Data Format is used to sign the Nft details off-chain to get the signature, and the signer is validated by the contract via using the **_hashTypedDataV4()** function of EIP-712 contract, which creates a bytes32 digest.

- This digest and the signature is passed to **ECDSA.recover()** which extracts the signer and returns its address.

---
---

## Creating signature on the frontend:-

- First, create the domain for the signature, as required by EIP-712.

```script
const domain = {
    name: "Domain Signing Name, as specified in your contract.",
    version: "Domain Signing Version, as specified in your contract.",
    verifyingContract: "Address of your contract, where this signature would be validated.",
    chainId: "Chain id of the network on which contract is deployed."
};
```

---

- Then, create a Types object based on Typed Data Structure format, supported by EIP-712.

```script
const types = {
    NFT: [
        {name: "name", type: "string"},
        {name: "price", type: "uint256"},
        {name: "minter", type: "address"},
        {name: "metadataURI", type: "string"}
    ]
};
const nft = {
    name: "Nft Name",
    price: ethers.utils.parseUnits("Nft Price in ethers", 18),
    minter: "Nft signer/ off-chain minter address",
    metadataURI: "Nft metadata URI link"
};
```

---

- Make sure you are connected to metamask and have the signer object.

```script
const provider = new ethers.providers.Web3Provider(window.ethereum)
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
await signer.getAddress();
```

---

- Finally, get the signer to sign the Typed data, which would provide us the signature.

```script
const signature = await signer._signTypedData(domain, types, nft);
```

---

### Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case.

```shell
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
