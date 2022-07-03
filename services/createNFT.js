import NFT from "../models/nftModel.js";

const createNft = async (name, description, price, imageStaticUrl, imageIpfsUrl, minter, voucher, metadataUri) => {
   // Creates a new NFT entry in the database.
    const nft = new NFT({
        name: name,
        description: description,
        imageStaticUrl: imageStaticUrl,
        imageIpfsUrl: imageIpfsUrl,
        ethPrice: price,
        listedForSale: false,
        isSold: false,
        minter: minter,
        signature: voucher,
        metadataUri: metadataUri
    });
    return await nft.save();
    
};

export default createNft;
