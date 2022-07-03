import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        nftsMinted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "NFT",
        }]
    }
);

export default mongoose.model("User", userSchema);
