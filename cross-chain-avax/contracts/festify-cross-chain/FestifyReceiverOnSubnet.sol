// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@teleporter/ITeleporterMessenger.sol";
import "@teleporter/ITeleporterReceiver.sol";

contract FestifyReceiverOnSubnet is ERC721URIStorage, Ownable, ITeleporterReceiver {
    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf);

    uint256 private _nextTokenId = 1;
    mapping(uint256 => string) private _tokenFestivals;
    mapping(uint256 => address) private _tokenSenders;
    mapping(address => uint256[]) private _receivedTokens;

    event GreetingCardMinted(
        uint256 indexed tokenId,
        address indexed sender,
        address indexed recipient,
        string festival,
        string metadataURI
    );

    constructor() ERC721("Festival Greetings", "FGRT") Ownable() {}

    /**
     * @dev Receives a cross-chain mint request and mints the NFT to the recipient.
     * @param originSenderAddress The address of the sender on the source chain
     * @param message The encoded message containing recipient, festival, and metadataURI
     */
    function receiveTeleporterMessage(
        bytes32 /* sourceBlockchainID */,
        address originSenderAddress,
        bytes calldata message
    ) external override {
        require(msg.sender == address(messenger), "Only Teleporter messenger can call this function");

        (address recipient, string memory festival, string memory metadataURI) = abi.decode(message, (address, string, string));
        require(recipient != address(0), "Invalid recipient");
        require(bytes(festival).length > 0, "Festival required");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        uint256 newTokenId = _nextTokenId++;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        _tokenFestivals[newTokenId] = festival;
        _tokenSenders[newTokenId] = originSenderAddress;
        _receivedTokens[recipient].push(newTokenId);

        emit GreetingCardMinted(newTokenId, originSenderAddress, recipient, festival, metadataURI);
    }

    // View functions
    function getGreetingFestival(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Festival query for nonexistent token");
        return _tokenFestivals[tokenId];
    }

    function getGreetingSender(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Sender query for nonexistent token");
        return _tokenSenders[tokenId];
    }

    function getReceivedGreetings(address recipient) public view returns (uint256[] memory) {
        return _receivedTokens[recipient];
    }
} 