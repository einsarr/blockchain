const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress,amount){
        this.fromAddress    = fromAddress;
        this.toAddress      = toAddress;
        this.amount         = amount;
    }
}

class Block{
    constructor(timestamp,transaction,previousHash=''){
        this.timestamp      = timestamp;
        this.transaction           = transaction;
        this.previousHash   = previousHash;
        this.hash           = this.calculateHash();
        this.nonce          = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1 ).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Bloc mined : "+this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain                  = [this.createGenesisBlock()];
        this.difficulty             = 2;
        this.pendingTransactions    = [];
        this.miningReward           = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2021","Genesis block","0");
    }

    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }

    /*addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        //ewBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfuly mined ! ");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let saveBlock = new BlockChain();
saveBlock.createTransaction(new Transaction('address1','address2',100));
saveBlock.createTransaction(new Transaction('address2','address1',50));

console.log("\n Starting the miner...");
saveBlock.minePendingTransactions('mes-addresses');

console.log("\nBalance of Moussa is ", saveBlock.getBalanceOfAddress('mes-addresses'));

console.log("\n Starting the miner again...");
saveBlock.minePendingTransactions('mes-addresses');

console.log("\nBalance of Moussa is ", saveBlock.getBalanceOfAddress('mes-addresses'));








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