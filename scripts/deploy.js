const { ethers } = require("hardhat");

async function main() {
    const LazyMinting = await ethers.getContractFactory("LazyMinting");
    const lazyMinting = await LazyMinting.deploy();
    await lazyMinting.deployed();
    console.log("LazyMinting contract deployed at: ", lazyMinting.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
