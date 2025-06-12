// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * @title FestifySender
 * @notice A contract for sending festival data across chains using Chainlink CCIP
 * @dev This contract allows sending festival-related data from Sepolia to Avalanche
 */
contract FestifySender is OwnerIsCreator {
    // Custom errors
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error InvalidDestinationChain(uint64 chainSelector);
    error InvalidReceiverAddress(address receiver);

    // Events
    event FestivalDataSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string festivalData,
        address feeToken,
        uint256 fees
    );

    // State variables
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;
    uint64 private immutable i_destinationChainSelector;

    /**
     * @notice Constructor initializes the contract with the router and link token addresses
     * @param router The address of the CCIP router contract
     * @param link The address of the LINK token contract
     * @param destinationChainSelector The chain selector for Avalanche
     */
    constructor(
        address router,
        address link,
        uint64 destinationChainSelector
    ) {
        if (router == address(0)) revert InvalidReceiverAddress(router);
        if (link == address(0)) revert InvalidReceiverAddress(link);
        if (destinationChainSelector == 0) revert InvalidDestinationChain(destinationChainSelector);

        i_router = IRouterClient(router);
        i_linkToken = LinkTokenInterface(link);
        i_destinationChainSelector = destinationChainSelector;
    }

    /**
     * @notice Sends festival data to the receiver contract on Avalanche
     * @param receiver The address of the receiver contract on Avalanche
     * @param festivalData The festival data to be sent (JSON string)
     * @return messageId The ID of the CCIP message
     */
    function sendFestivalData(
        address receiver,
        string calldata festivalData
    ) external onlyOwner returns (bytes32 messageId) {
        if (receiver == address(0)) revert InvalidReceiverAddress(receiver);

        // Create the CCIP message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(festivalData),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.GenericExtraArgsV2({
                    gasLimit: 200_000,
                    allowOutOfOrderExecution: true
                })
            ),
            feeToken: address(i_linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = i_router.getFee(
            i_destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > i_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(i_linkToken.balanceOf(address(this)), fees);

        // Approve the router to spend LINK tokens
        i_linkToken.approve(address(i_router), fees);

        // Send the message
        messageId = i_router.ccipSend(i_destinationChainSelector, evm2AnyMessage);

        emit FestivalDataSent(
            messageId,
            i_destinationChainSelector,
            receiver,
            festivalData,
            address(i_linkToken),
            fees
        );

        return messageId;
    }

    /**
     * @notice Returns the router address
     */
    function getRouter() external view returns (address) {
        return address(i_router);
    }

    /**
     * @notice Returns the LINK token address
     */
    function getLinkToken() external view returns (address) {
        return address(i_linkToken);
    }

    /**
     * @notice Returns the destination chain selector
     */
    function getDestinationChainSelector() external view returns (uint64) {
        return i_destinationChainSelector;
    }
} 