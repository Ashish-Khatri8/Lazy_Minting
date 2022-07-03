// Import required services for CRUD operations.
import findNft from '../services/findNft.js';
import findUser from "../services/findUser.js";
import createNft from "../services/createNFT.js";
import findUserNfts from '../services/findUserNfts.js';
import findAllNfts from "../services/findAllNfts.js";
import listNftForSale from '../services/listNftForSale.js';
import sellNft from '../services/sellNft.js';

//Import dotenv for env variables.
import * as dotenv from 'dotenv';
dotenv.config();


// Imports for using web3.storage to upload files on IPFS.
import { Web3Storage, getFilesFromPath, File } from 'web3.storage';

// Get web3Storage token.
const token = process.env.WEB3_TOKEN;

// Create a web3Storage client.
const web3StorageClient = new Web3Storage({token});


export const getBuy = async (req, res, next) => {
    try {
        // Get all minted nfts from database.
        const nfts = await findAllNfts();

        // Get the user from database.
        const user = await findUser(req.session.userAddress);

        // Array to store nfts that are minted by other users and are listed for sale.
        const nftsUserCanBuy = [];
        
        // Push the eligible nfts to the array.
        for (const nft of nfts) {
            console.log(nft);
            if (
                nft.minter._id.toString() !== user._id.toString() &&
                nft.listedForSale == true
            ) {
                nftsUserCanBuy.push(nft);
            }
        }

        // Render the Buy page.
        res.render("user/buy", {
            pageTitle: "Buy",
            isAuthenticated: req.session.isAuthenticated,
            path: "/buy",
            address: req.session.userAddress,
            nfts: nftsUserCanBuy,
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
    
};


export const getMint = async (req, res, next) => {
    try {
        // Render the Mint page.
        res.render("user/mint", {
            pageTitle: "Mint",
            isAuthenticated: req.session.isAuthenticated,
            path: "/mint",
            address: req.session.userAddress
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
    
};


export const getNfts = async (req, res, next) => {
    try {
        // Get user from database.
        const user = await findUser(req.session.userAddress);

        // Get all nfts of current user from database.
        const nfts = await findUserNfts(user._id);

        // Render the My NFTS page with all nfts of current user.
        res.render("user/nfts", {
            pageTitle: "NFTs",
            isAuthenticated: req.session.isAuthenticated,
            path: "/nfts",
            address: req.session.userAddress,
            nfts: nfts,
            user: user,
        });

    } catch(error) {
        console.log(error);
        next(error);
    }

};


export const getNft = async (req, res, next) => {
    try {
        // Get nft id from the query params.
        const nftId = req.params.id;
        // Get the nft with above id from database.
        const nft = await findNft(nftId);

        // Render the single nft details page for above nft.
        res.render("user/nft", {
            pageTitle: "NFTs",
            isAuthenticated: req.session.isAuthenticated,
            path: `/nfts/${nftId}`,
            address: req.session.userAddress,
            nft: nft
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
};


export const postNftBuy = async (req, res, next) => {
    try {
        // Get nft id from request body.
        const id = req.body.nftId;
        // Get the nft buyer
        const buyer = await findUser(req.session.userAddress);
        // Sets isSold for this nft to true.
        const sold = await sellNft(id, buyer._id);
        if (sold) {
            res.status(200).redirect("/nfts");
        }
    } catch(error) {
        console.log(error);
        next(error);
    }
};


export const postMint = async (req, res, next) => {
    // Get NFT name, price, decription from the req body.
    const { name, price, description } = req.body;

    // Get the image file uploaded for nft.
    const image = req.file;

    // If any field is empty, redirect to mint page.
    if (!image || !name || !price || !description) {
        return res.status(400).redirect("/mint");
    }

    // Store image file to IPFS.
    const imageCid = await storeFiles(image.path);
    const imageUrl = `https://ipfs.io/ipfs/${imageCid}/${image.path.slice(7,)}`;

    // Store metadata to IPFS.
    const metadata = {
        "name": name,
        "description": description,
        "image": imageUrl
    };
    // Create a temp JSON file for metadata.
    const buffer = Buffer.from(JSON.stringify(metadata));
    const file = [
        new File([buffer], "metadata.json")
    ];
    const cid = await web3StorageClient.put(file);
    const metadataUri = `https://${cid}.ipfs.dweb.link/metadata.json`;

    if (metadataUri) {
        // Get user from database.
        const user = await findUser(req.session.userAddress);
        
        // Creates new NFT entry in the database with the provided details.
        const nft = await createNft(name, description, price, image.path, imageUrl, user._id, "0x00", metadataUri);
        // Update user's minted nft array.
        await user.nftsMinted.push(nft._id);
        await user.save();

        // Find all nfts for current user and display them on the "My NFTs" page.
        const nfts = await findUserNfts(user._id);

        res.render("user/nfts", {
            pageTitle: "NFTs",
            isAuthenticated: req.session.isAuthenticated,
            path: "/nfts",
            address: req.session.userAddress,
            nfts: nfts,
            user: user
        });
    }
};


export const postSaleListed = async (req, res, next) => {
    // Get nft id and signature from req body after it is listed for sale.
    const id = req.body.nftId;
    const signature = req.body.signature;

    // Change isListed value to true for this nft in database.
    const listed = await listNftForSale(id, signature);
    if (listed) {
        res.status(200).redirect("/nfts");
    }
};


async function storeFiles (path) {
    // Uploads the file at given path to IPFS and returns its CID.
    const file = await getFilesFromPath(path);
    return await web3StorageClient.put(file);
}
