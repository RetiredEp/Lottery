// Import the 'path' module to handle and transform file paths
const path = require('path');

// Import the 'fs' (file system) module to interact with the file system
const fs = require('fs');

// Import the 'solc' (Solidity compiler) module to compile Solidity code
const solc = require('solc');

// Define the path to the Lottery.sol file
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

// Read the contents of the Lottery.sol file
const source = fs.readFileSync(lotteryPath, 'utf8');

// Create an input object for the Solidity compiler
const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Compile the Solidity code and export the compiled contract
// 1. JSON.stringify(input): Converts the input object to a JSON string
// 2. solc.compile(JSON.stringify(input)): Compiles the Solidity code using the JSON string
// 3. JSON.parse(...): Parses the JSON string returned by the compiler into a JavaScript object
// 4. .contracts['Lottery.sol'].Lottery: Accesses the 'Lottery' contract within the 'Lottery.sol' file from the parsed output
// 5. module.exports: Exports the 'Lottery' contract object so it can be required and used in other files

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery.evm.bytecode.object);
// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery.abi);

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;
