const {BlockChain, Transaction} = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('9120c5e97fa54fa4210653f21653fc8096cb934b5699a07ad4601373e2c2b3a9');
const myWalletAddress = myKey.getPublic('hex');

let saveBlock = new BlockChain();

const tx1 = new Transaction(myWalletAddress,'public key goes here',10);
tx1.signTransaction(myKey);
saveBlock.addTransaction(tx1);

/*saveBlock.createTransaction(new Transaction('address1','address2',100));
saveBlock.createTransaction(new Transaction('address2','address1',50));*/

console.log("\n Starting the miner...");
saveBlock.minePendingTransactions(myWalletAddress);

console.log("\nBalance of Moussa is ", saveBlock.getBalanceOfAddress(myWalletAddress));

//saveBlock.chain[1].transactions[0].amount = 1;

console.log("\nIs chain valid ? ", saveBlock.isChainValid());










/*
console.log("Mining block 1...");
saveBlock.addBlock(new Block(1,"06/07/2021",{amount:4}));

console.log("Mining block 2...");
saveBlock.addBlock(new Block(2,"07/07/2021",{amount:8}));


/*console.log("Is blockchain is valide ?"+saveBlock.isChainValid());
saveBlock.chain[1].data = {amount:100};
saveBlock.chain[1].hash = saveBlock.chain[1].calculateHash();
console.log("Is blockchain is valide ?"+saveBlock.isChainValid());
//console.log(JSON.stringify(saveBlock,null,4));*/