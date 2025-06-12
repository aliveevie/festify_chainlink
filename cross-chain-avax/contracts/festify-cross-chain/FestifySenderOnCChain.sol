// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@teleporter/ITeleporterMessenger.sol";

contract FestifySenderOnCChain {
    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf);

    event CrossChainMintRequested(
        address indexed recipient,
        string festival,
        string metadataURI,
        bytes32 destinationChainId,
        address destinationAddress
    );

    /**
     * @dev Sends a cross-chain mint request to the receiver contract on the destination chain.
     * @param destinationChainId The chain ID of the destination chain (e.g., subnet)
     * @param destinationAddress The FestifyReceiverOnSubnet contract address on the destination chain
     * @param recipient The address to receive the NFT on the destination chain
     * @param festival The festival type
     * @param metadataURI The metadata URI for the NFT
     */
    function sendMintRequest(
        bytes32 destinationChainId,
        address destinationAddress,
        address recipient,
        string calldata festival,
        string calldata metadataURI
    ) external {
        require(destinationChainId != bytes32(0), "Invalid destination chain ID");
        require(destinationAddress != address(0), "Invalid destination address");
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(festival).length > 0, "Festival type required");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        bytes memory message = abi.encode(recipient, festival, metadataURI);

        messenger.sendCrossChainMessage(
            TeleporterMessageInput({
                destinationBlockchainID: destinationChainId,
                destinationAddress: destinationAddress,
                feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}),
                requiredGasLimit: 200000,
                allowedRelayerAddresses: new address[](0),
                message: message
            })
        );

        emit CrossChainMintRequested(recipient, festival, metadataURI, destinationChainId, destinationAddress);
    }
} 