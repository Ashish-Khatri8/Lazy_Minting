import User from "../models/userModel.js";

const findUser = async (address) => {
    // Finds and returns an user with provided address.
    return await User.findOne({address: address});
};

export default findUser;
