const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class Transaction{
    constructor(fromAddress, toAddress,amount){
        this.fromAddress    = fromAddress;
        this.toAddress      = toAddress;
        this.amount         = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets !');
        }

        const hastTx = this.calculateHash();
        const sig = signingKey.sign(hastTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.fromAddress || !this.signature.length ===0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}

class Block{
    constructor(timestamp,transactions,previousHash=''){
        this.timestamp      = timestamp;
        this.transactions   = transactions;
        this.previousHash   = previousHash;
        this.hash           = this.calculateHash();
        this.nonce          = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1 ).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED : "+this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
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
        return new Block(Date.parse('2021-07-01'),[],"0");
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
        const rewardTx = new Transaction(null,miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfuly mined ! ");
        this.chain.push(block);

       /* this.pendingTransactions = [
            new Transaction(null, miningRewardAddress,this.miningReward)
        ];*/

        this.pendingTransactions = [];
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must be include and address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }



    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
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

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

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


module.exports.BlockChain   = BlockChain;
module.exports.Transaction  = Transaction;