import NFT from "../models/nftModel.js";

const findUserNfts = async (userId) => {
    // Returns all NFTs minted and bought by an user whose id is provided.
    const mintedNfts = await NFT.find({minter: userId});
    const boughtNfts = await NFT.find({buyer: userId});
    const nfts = mintedNfts.concat(boughtNfts);
    return nfts;
};

export default findUserNfts;
