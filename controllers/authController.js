import findUser from "../services/findUser.js";
import createUser from "../services/createUser.js"


export const postLogin = async (req, res, next) => {
    try {
        /*
            For the current user session, set : 
                - userAddress to address to wallet currently connected and,
                - isAuthenticated to true.
        */
        req.session.userAddress = req.body.address;
        req.session.isAuthenticated = true;
        
        // Check if the address currently connected exists in database.
        const userFound = await findUser(req.session.userAddress);
        
        // If it does not exist in database, create a new entry for it.
        if (!userFound) {
           await createUser(req.session.userAddress);
        }
   
        // Redirect to Buy page.
        res.redirect("/buy");

    } catch(error) {
        console.log(error);
        next(error);
    }
};


export const postLogout = async (req, res, next) => {
    try {
        /*
            For the current user session, set : 
                - userAddress to an empty string, and
                - isAuthenticated to false, as wallet is disconnected.
        */
        req.session.userAddress = "";
        req.session.isAuthenticated = false;

        // Redirect to home page.
        res.redirect("/home");
        
    } catch(error) {
        console.log(error);
        next(error);
    }
};
