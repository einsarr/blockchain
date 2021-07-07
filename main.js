const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index,timestamp,data,previousHash=''){
        this.index          = index;
        this.timestamp      = timestamp;
        this.data           = data;
        this.previousHash   = previousHash;
        this.hash           = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0,"01/01/2021","Genesis block","0");
    }

    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let savedBlock = new BlockChain();
savedBlock.addBlock(new Block(1,"06/07/2021",{amount:4}));
savedBlock.addBlock(new Block(2,"07/07/2021",{amount:4}));

console.log(JSON.stringify(savedBlock,null,4));