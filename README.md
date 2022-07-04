# NodeJS-Wallet-Task

## Requirements: 
- Node and npm
- $npm install (to install dependencies) 
- Set values of environment variables in .env file.
- $npm start (to start/ run server)

### Also create a .env file with these details: 
- MONGODB_URL="Your MongoDB Cluster URL"
- PORT="Port on which to run server"
- WEB3_TOKEN="Your token from web3.storage"

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
