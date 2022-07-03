import findNft from "./findNft.js";

const sellNft = async (nftId, buyerId) => {
    // Database changes when an NFT is sold on-chain.
    const nft = await findNft(nftId);
    nft.listedForSale = false;
    nft.isSold = true;
    nft.buyer = buyerId;
    await nft.save();
    return true;
};

export default sellNft;
