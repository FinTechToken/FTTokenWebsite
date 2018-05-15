declare var Web3: any;
declare var web3: any;

declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;
declare var BigNumber: any;

import { Injectable }     from '@angular/core';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';

// Originally I thought the user would switch between blockchains. Why not be on all of them at once?
// Either this should be refactored to enable that - or this is the Ethereum instance that gets called by the global one that keeps track of everything.

@Injectable()
export class FTWeb3Service {
    private nets:string[]=[];
    private currentNetSeconds = 0;
    private interval;
    private currentNetName: string;
    private currentWeb3;

    private zeroAddress="0000000000000000000000000000000000000000";
    private gasPrice=0;
    private chainId = "913945103463586943";

    constructor ( private cache: FTCache, private obs: FTObserver ) { 
        if(typeof web3 !== 'undefined'){
            this.nets['existing'] = web3.currentProvider;
        }
        this.nets['testnet'] = 'wss://testmarket.fintechtoken.com';
        this.nets['local'] = 'http://localhost:8545';

        this.interval  = setInterval( () => {
            this.currentNetSeconds += 1;
            this.obs.putObserver('blockSeconds', this.currentNetSeconds);
        }, 1000); 
    }
    
    initializeWeb3(): void{
        if (typeof web3 !== 'undefined') {
            //Todo: use on realnet: this.setWeb3('existing');
            this.setWeb3('testnet');
        } 
        else {
            this.setWeb3('testnet');
        }
    }

    getWeb3Name(): string {
        return this.currentNetName;
    }

    setWeb3( netName ): void {
        let newWeb3 = this.setProvider( netName );
        this.currentNetName = netName;
        /* Currently we put wb3 instance in cache so any component can use it.
        Better to create functions in this service. 
        That way we have one place to update things like send transaction when we add BitCoin, LiteCoin, Monero, etc etc */
        this.cache.putCache('wb3', newWeb3); //Remove this once not used anywhere in code
        this.currentWeb3 = newWeb3;
        this.configureBlock();
    }

    getNewAccount(): any{
        return this.currentWeb3.eth.accounts.create();
    }

    getEncryptedId( privateKey, PW):any {
        return this.currentWeb3.eth.accounts.encrypt(privateKey, PW);
    }

    decryptPrivateKey(encryptedId, PW): any {
        return this.currentWeb3.eth.accounts.decrypt(encryptedId, PW).privateKey;
    }

    multiplyBigNumber(numberA: string, numberB: string): string {
        if(numberA == ""){
          numberA = "0";
        }
        if(numberB == ""){
          numberB = "0";
        }
        let x = new BigNumber(numberA);
        let y = new BigNumber(numberB);
        return x.times(y).toString(10);
      }

    signTrans(gasEst, toAddress, sendValue, encodedABI): any {
        let fromAddress = this.cache.getCache('encrypted_id').address;
        let privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
        let maxGas = this.multiplyBigNumber(gasEst,"2");
        return this.currentWeb3.eth.getTransactionCount('0x' + fromAddress)
        .then( (nonce) => {
            let txData;
            if(toAddress){
                txData = {
                    nonce:    numberToHex(nonce),
                    gasPrice: numberToHex(this.gasPrice),
                    gasLimit: numberToHex(maxGas),
                    to:       '0x' + toAddress,
                    value:    numberToHex(sendValue),
                    data:     encodedABI,
                    chainId:  this.chainId.toString()
                }
            }
            else{
                txData = {
                    nonce:    numberToHex(nonce),
                    gasPrice: numberToHex(this.gasPrice),
                    gasLimit: numberToHex(maxGas),
                    value:    numberToHex(sendValue),
                    data:     encodedABI,
                    chainId:  this.chainId.toString()
                }
            }
            var tx = new EthJS.Tx(txData);
            tx.sign(privateKey);
            return tx.serialize();
        })
        .catch(console.log);
    }

    compile(sourceCode): any{
        return this.currentWeb3.eth.compile.solidity(sourceCode);
    }

    publishContract(compiledCode, gasEst){
        return this.signTrans(gasEst, null, 0, compiledCode)
        .then(signedTran=>
            this.currentWeb3.eth.sendSignedTransaction('0x' + signedTran.toString('hex'))
                /* .once('transactionHash', (hash) => { console.log('hash:' + hash) })
                .once('receipt', (receipt) =>{ console.log('receipt:' + JSON.stringify(receipt) + ' contractAddr:' + receipt.contractAddress) })
                .on('confirmation', (confNumber, receipt) => { console.log('confNumber: '+ confNumber); })
                .on('error', (error) => { console.log('ERROR' + error);}) */
                .then(newContractInstance=>{
                    return newContractInstance.contractAddress;})
                .catch(console.log) // instance with the new contract address
        )
        .catch(console.log);
    }
    
    estimateGasPublish(compiledCode, compiledABI): any{
        return this.deploy(compiledCode, compiledABI)
        .estimateGas();
    }

    PublishABI(compiledCode, compiledABI): any{
        return this.deploy(compiledCode, compiledABI)
        .encodeABI();
    }

    private deploy(compiledCode, compiledABI): any{
        let myContract = new this.currentWeb3.eth.Contract(compiledABI);
        return myContract.deploy({data: compiledCode});
    }

    private setProvider( netName ): void {
        let FTweb3 = new Web3();
        FTweb3.setProvider(new FTweb3.providers.WebsocketProvider(this.nets[netName]));
        //FTweb3.setProvider(new FTweb3.providers.HttpProvider(this.nets[netName]));
        return FTweb3;
    }

    private configureBlock(): void {
        this.currentWeb3.eth.getBlockNumber()
        .then( (bn) => {
            this.obs.putObserver('block', bn);
        });
        this.currentWeb3.eth.subscribe('newBlockHeaders', (error, result) => {})
        .on("data", (blockHeader) => { 
            this.obs.putObserver('block', blockHeader.number);
            this.currentNetSeconds = 0;
            this.obs.putObserver('blockSeconds', 0);
        });
    }

}
