// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Client} from "@chainlink/contracts-ccip/src/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/applications/CCIPReceiver.sol";

/**
 * @title FestifyReceiver
 * @notice A contract for receiving festival data across chains using Chainlink CCIP
 * @dev This contract receives festival-related data from Sepolia on Avalanche
 */
contract FestifyReceiver is CCIPReceiver {
    // Custom errors
    error InvalidSourceChain(uint64 sourceChainSelector);
    error InvalidSender(address sender);

    // Events
    event FestivalDataReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string festivalData
    );

    // State variables
    uint64 private immutable i_sourceChainSelector;
    address private immutable i_sender;
    bytes32 private s_lastReceivedMessageId;
    string private s_lastReceivedFestivalData;

    /**
     * @notice Constructor initializes the contract with the router address and source chain details
     * @param router The address of the CCIP router contract
     * @param sourceChainSelector The chain selector for Sepolia
     * @param sender The address of the sender contract on Sepolia
     */
    constructor(
        address router,
        uint64 sourceChainSelector,
        address sender
    ) CCIPReceiver(router) {
        if (sourceChainSelector == 0) revert InvalidSourceChain(sourceChainSelector);
        if (sender == address(0)) revert InvalidSender(sender);

        i_sourceChainSelector = sourceChainSelector;
        i_sender = sender;
    }

    /**
     * @notice Handles incoming CCIP messages
     * @param any2EvmMessage The CCIP message containing the festival data
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        // Verify the source chain and sender
        if (any2EvmMessage.sourceChainSelector != i_sourceChainSelector)
            revert InvalidSourceChain(any2EvmMessage.sourceChainSelector);

        address sender = abi.decode(any2EvmMessage.sender, (address));
        if (sender != i_sender) revert InvalidSender(sender);

        // Decode and store the festival data
        s_lastReceivedMessageId = any2EvmMessage.messageId;
        s_lastReceivedFestivalData = abi.decode(any2EvmMessage.data, (string));

        emit FestivalDataReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector,
            sender,
            s_lastReceivedFestivalData
        );
    }

    /**
     * @notice Returns the details of the last received festival data
     * @return messageId The ID of the last received message
     * @return festivalData The last received festival data
     */
    function getLastReceivedFestivalData()
        external
        view
        returns (bytes32 messageId, string memory festivalData)
    {
        return (s_lastReceivedMessageId, s_lastReceivedFestivalData);
    }

    /**
     * @notice Returns the source chain selector
     */
    function getSourceChainSelector() external view returns (uint64) {
        return i_sourceChainSelector;
    }

    /**
     * @notice Returns the sender address
     */
    function getSender() external view returns (address) {
        return i_sender;
    }
} 