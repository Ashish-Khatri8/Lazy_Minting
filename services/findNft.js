import NFT from "../models/nftModel.js";

const findNft = async (nftId) => {
    // Finds and returns the NFT with provided id.
    return await NFT.findOne({_id: nftId});
};

export default findNft;
