import findAllNfts from "../services/findAllNfts.js";


export const getHome = async (req, res, next) => {
    // Display all NFTs minted till now on the Home page.
    try {
        // Get all nfts minted so far from database.
        const nfts = await findAllNfts();

        // Render the Home page.
        res.render("market/home", {
            pageTitle: "Lazy Minting",
            isAuthenticated: req.session.isAuthenticated,
            path: "/home",
            address: req.session.userAddress,
            nfts: nfts
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
};
