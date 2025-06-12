// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../contracts/festify-cross-chain/FestifyReceiverOnSubnet.sol";

contract DeployFestifyReceiver is Script {
    function run() external {
        // Get private key as string and convert to uint256
        string memory pkString = vm.envString("PK");
        console.log("Private key:", pkString);
        uint256 deployerPrivateKey = uint256(bytes32(bytes(pkString)));
        console.log("Private key as uint256:", deployerPrivateKey);
        
        // Get the deployer address
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployer);
        
        // Get the balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance, "wei");
        console.log("Deployer balance in AVAX:", balance / 1e18, "AVAX");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the receiver contract
        FestifyReceiverOnSubnet receiver = new FestifyReceiverOnSubnet();
        console.log("FestifyReceiverOnSubnet deployed at:", address(receiver));

        vm.stopBroadcast();
    }
} 