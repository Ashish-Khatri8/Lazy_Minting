const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LazyMinting", () => {

    let LazyMinting, lazyMinting, minter, buyer;

    beforeEach(async () => {
        [minter, buyer] = await ethers.getSigners();
        
        // Deploy the LazyMinting contract.
        LazyMinting = await ethers.getContractFactory("LazyMinting");
        lazyMinting = await LazyMinting.deploy();
        await lazyMinting.deployed();

    });

    it("Buyer with valid signature can buy the NFT.", async () => {

        // First create a signature for Nft by minter address.
        const domain = {
            name: "LazyMinting",
            version: "1",
            verifyingContract: lazyMinting.address,
            chainId: "31337"
        };
        const types = {
            NFT: [
                {name: "name", type: "string"},
                {name: "price", type: "uint256"},
                {name: "minter", type: "address"},
                {name: "metadataURI", type: "string"}
            ]
        };
        const nft = {
            name: "MintedLazy",
            price: ethers.utils.parseUnits("1", 18),
            minter: minter.address,
            metadataURI: ""
        };
        
        const signature = await minter._signTypedData(domain, types, nft);

        // Now buy the nft onchain with buyer address.
        const txn = await lazyMinting.connect(buyer).mintNFT(
            [
                "MintedLazy",
                ethers.utils.parseUnits("1", 18),
                minter.address,
                ""
            ],
            signature,
            {value: ethers.utils.parseEther("1.0")}
        );
        await txn.wait();
        
        // Now if txn is successful, then buyer's balance should be 1.
        expect(await lazyMinting.balanceOf(buyer.address)).to.be.equal(1);

    });

});
