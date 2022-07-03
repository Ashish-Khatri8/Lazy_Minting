import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageStaticUrl: {
        type: String,
        required: true,
    },
    imageIpfsUrl: {
        type: String,
        required: true,
    },
    ethPrice: {
        type: Number,
        required: true,
    },
    listedForSale: {
        type: Boolean,
        required: true,
    },
    isSold: {
        type: Boolean,
        required: true,
    },
    minter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    signature: {
        type: String,
        required: true,
    },
    metadataUri: {
        type: String,
        required: true
    },

});

export default mongoose.model("NFT", nftSchema);
