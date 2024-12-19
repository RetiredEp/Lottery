// SPDX License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    // The address of the manager who deployed the contract
    address public manager;
    // An array of addresses representing the players who have entered the lottery
    address[] public players;

    // Constructor function that sets the manager to the address that deployed the contract
    constructor() {
        manager = msg.sender;
    }

    // Function to enter the lottery
    // The function is payable, meaning it can receive Ether
    function enter() public payable {
        // Require that the value sent is greater than 0.01 Ether
        require(msg.value > 0.01 ether);
        // Add the address of the sender to the players array
        players.push(msg.sender);
    }

    // Private function to generate a random number
    // The function is view, meaning it does not modify the state
    function random() private view returns (uint) {
        // Generate a pseudo-random number using keccak256 and block properties
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    // Function to pick a winner
    // Only the manager can call this function, and there must be at least one player
    function pickWinner() public {
        // Require that the sender is the manager and there is at least one player
        require(msg.sender == manager && players.length > 0);
        // Generate a random index based on the number of players
        uint index = random() % players.length;
        // Get the address of the winner
        address payable winner = payable(players[index]);
        // Transfer the entire balance of the contract to the winner
        winner.transfer(address(this).balance);
        // Reset the players array
        players = new address[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}