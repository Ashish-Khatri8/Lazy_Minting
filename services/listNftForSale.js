import NFT from "../models/nftModel.js";
import findNft from "./findNft.js";

const listNftForSale = async (nftId, signature) => {
    // Lists an NFT for sale and returns true.
    const nft = await findNft(nftId);
    console.log(nft);
    nft.listedForSale = true;
    nft.signature = signature;
    await nft.save();
    return true;
};

export default listNftForSale;
