/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    async generateGenesisBlock(){
        // Add your code here
        const block = new Block("Genesis block");
        const height = await getBlockHeight();
        if (height === -1)
            this.addBlock(block);
    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    async getBlockHeight() {
        // Add your code here
        return await this.bd.getBlocksCount();
    }

    // Add new block
    async addBlock(block) {
        // Add your code here
        let self = this, height = await this.getBlockHeight();
        await (async () => {
            if (height > -1) {
                previousBlock = await self.bd.getLevelDBData(height);
                block.previousblockhash = previousBlock.hash;
            }
        });
    }

    // Get Block By Height
    async getBlock(height) {
        // Add your code here
        return await this.bd.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        // Add your code here
        let self = this;
        const block = await this.getBlock(height);
        const newBlock = {...block};
        newBlock.hash = '';
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return await (block.hash === newBlock.hash);

    }

    // Validate Blockchain
    async validateChain() {
        // Add your code here
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;