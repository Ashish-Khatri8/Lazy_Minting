// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/// @title LazyMinting
/// @author Ashish Khatri
contract LazyMinting is ERC721URIStorage, EIP712, ReentrancyGuard {

    /// @dev State variable to track tokenIds for minted NFTs.
    uint256 internal _tokenId;

    /// @dev Contract specific values for EIP-712 Domain Separator.
    string private Signing_Domain = "LazyMinting";
    string private Signing_Version = "1";

    /// @dev Mapping signatures to boolean, to keep track of signatures already used for minting.
    mapping(bytes => bool) private signatureUsed;

    /// @dev A struct on which EIP-712 Typed data is based upon.
    struct NFT {
        string name;
        uint256 price;
        address minter;
        string metadataURI;
    }

    /// @dev Event to emit when an NFT is minted with signature and sold.
    event NftSold(address indexed to, address indexed minter, uint256 indexed id, bytes signature);

    /// @dev Passing constructor values to ERC721 and EIP-712 contracts.
    constructor() ERC721("LazyMinting", "LM") EIP712(Signing_Domain, Signing_Version) {}


    /** 
     * @notice Function to mint NFT with lazy minting based signature.
     * @dev Mints an NFT to the signature signer and then transfers it to the buyer.
     * @param nft An array consisting values of NFT struct respectively.
     * @param signature An EIP-712 Typed Data based hash, signed by the off-chain nft minter.
     */
    function mintNFT(NFT calldata nft, bytes memory signature) public payable nonReentrant {

        /// @dev Checks whether the signature has already been used to mint an NFT.
        require(signatureUsed[signature] == false, "Already minted!");

        /// @dev Checks whether buyer has sent sufficient wei to buy the NFT.
        require(msg.value >= nft.price, "Insufficient amount!");

        /// @dev Verifies the signature validity.
        require(
            _verifySignature(nft, signature) == true,
            "Invalid Signature!"
        );

        // Increment the tokenId by 1.
        _tokenId += 1;

        // Set value for given signature to false in the signatureUsed mapping.
        signatureUsed[signature] = true;

        // Mint the NFT to the off-chain signer/ minter to set ownership provenance on-chain.
        _safeMint(nft.minter, _tokenId);

        // Set the metadata URI for the NFT minted above,
        _setTokenURI(_tokenId, nft.metadataURI);

        // Transfer the NFT from the signer to the buyer.
        _safeTransfer(nft.minter, msg.sender, _tokenId, "");

        // Send the NFT value to the minter from the buyer.
        payable(nft.minter).transfer(msg.value);

        // Emit the NftSold event.
        emit NftSold(msg.sender, nft.minter, _tokenId, signature);

    }


    /**
     * @dev Internal function to verify the nft signature.
     * @param nft An array consisting values of NFT struct respectively.
     * @param signature An EIP-712 Typed Data based hash, signed by the off-chain nft minter.
     * @return A boolean, true if signature valid, otherwise false.
     */
    function _verifySignature(NFT memory nft, bytes memory signature) internal view returns(bool) {
        /// @dev Gets the typed data hash for NFT struct based values.
        bytes32 digest = _getDigest(nft);

        /// @dev Gets the signer from the digest and signature by using ECDSA.recover() method.
        address signer = _getSigner(digest, signature);
        
        /// @dev Returns true if signer matches the off-chain minter, otherwise false.
        if (signer == nft.minter) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * @dev Creates and returns the EIP-712 based typed data hash for NFT struct values.
     * @param nft An array consisting values of NFT struct respectively.
     * @return A bytes32 typed data hash.
     */
    function _getDigest(NFT memory nft) internal view returns(bytes32) {
        return _hashTypedDataV4(
            keccak256(abi.encode(
                keccak256("NFT(string name,uint256 price,address minter,string metadataURI)"),
                keccak256(bytes(nft.name)),
                nft.price,
                nft.minter,
                keccak256(bytes(nft.metadataURI))
            ))
        );
    }


    /**
     * @dev Retrives signer address from the provided digest and signature.
     * @param digest A bytes32 hash for typed data based upon EIP-712.
     * @param signature An EIP-712 based signature signed by an EOA, with domain details and typed data.
     * @return The address of the signature signer.
     */
    function _getSigner(bytes32 digest, bytes memory signature) internal pure returns(address) {
        return ECDSA.recover(digest, signature);
    }

}
