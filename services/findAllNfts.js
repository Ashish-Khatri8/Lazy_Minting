import NFT from "../models/nftModel.js";

const findAllNfts = async () => {
    // Finds and returns all nfts minted on platform so far. 
    return await NFT.find().populate("minter");
};

export default findAllNfts;
