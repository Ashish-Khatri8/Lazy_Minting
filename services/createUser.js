import User from "../models/userModel.js";

const createUser = async (address) => {
    // Creates a new user in the database.
    const user = new User({
        address: address,
        nftsMinted: []
    });
    await user.save();
    return user;
};

export default createUser;
