# Lazy Minting Task

- Deployed on [Heroku](https://lazy-minting-08.herokuapp.com/home)

## Workflow:

- User visits the Home page and clicks on **Connect Metamask** button to login with metamask.
  - If user is new, then a database entry is created.

- Upon connecting with metamask, user is shown the available nfts to buy on the platform which are lazy minted by other users.
  - User can click on the **Buy** button to buy the specific NFT.
  - This calls the contract's **mintNFT()** function with all the required argument values.
  - After transaction is successful, and **NftSold** event is emitted by the contract, the bought Nft is transferred to buyer's **My NFTs** page.

- User can go to **Mint** page to access the form for lazy minting a new nft off-chain.
  - It takes name, eth price, description and nft image as input.
  - If user enters valid inputs, and clicks on **Mint** button, then the NFT Metadata is uploaded on IPFS and the user is redirected to **My NFTs** page.
  - On the **My NFTs** page, user can click on **List for Sale** button to list the nft.
  On clicking this button, user is first prompted to sign an **EIP-712** based gasless transaction and this signature is used to verify nft details on-chain.

- User can visit the **My NFTs** page to see all of their own minted and bought nfts.

- User can click on the **Disconnect** button at any time to disconnect their metamask and end the current session.

---

## Requirements:

- Node and npm
- $npm install (to install dependencies) 
- Set values of environment variables in .env file.
- $npm start (to start/ run server)

### Also create a .env file with these details:

- MONGODB_URL="Your MongoDB Cluster URL"
- PORT="Port on which to run server"
- WEB3_TOKEN="Your token from web3.storage"


---

## Routes:

- Pass Authorization header value as: "Bearer JwtToken"

### Auth Routes

> /login
- Req: POST
- To login with metamask through "Connect Metamask" button.

> /logout
- Req: POST
- To logout from metamask through "Disconnect" button.

### Market Routes
> /home
- Req: GET
- Displays all the NFTs minted on the platform so far.


### User Routes
> /buy
- Req: GET
- Displays all the NFTs that are available for currently connected metamask account to purchase.

> /mint
- Req: GET
- Form to create a new Nft, takes nft input: name, eth price, description and image.
- All this metadata is then uploaded to IPFS.

> /nfts
- Req: GET
- Shows the "My NFTs" page where user can see all the nfts they have minted or bought.
- This is where user can list minted nft for sale, and is asked for the EIP-712 based signature.

> /nfts/:id
- Req: GET
- Page to show details of a particular NFT with given id.

> /buy/:id
- Req: POST
- Post request after user buys an nft, does all the database ownership changes.

> /mint
- Req: POST
- Post request after user mints an nft, uploads the metadata to IPFS and redirects to "My NFTs" page. => "/nfts".

> /nfts
- Req: POST
- Post request after an nft is listed for sale, does the required database updates and changes the Nft status to "Listed For Sale".
