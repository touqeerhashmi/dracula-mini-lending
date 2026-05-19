import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import solc from 'solc';

const contractPath = 'contracts/DraculaProtocol.sol';
const sourceCode = readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'DraculaProtocol.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

console.log('Compiling contract...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => console.error(err.formattedMessage));
  const hasErrors = output.errors.some(err => err.severity === 'error');
  if (hasErrors) process.exit(1);
}

const contractName = 'DraculaProtocol';
const contract = output.contracts['DraculaProtocol.sol'][contractName];

if (!existsSync('build')) {
  mkdirSync('build');
}

writeFileSync(`build/${contractName}.abi.json`, JSON.stringify(contract.abi, null, 2));
writeFileSync(`build/${contractName}.bytecode.json`, JSON.stringify(contract.evm.bytecode.object));

console.log(`Compilation successful. ABI and Bytecode saved to build/`);
