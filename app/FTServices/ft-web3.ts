declare var Web3: any;
declare var web3: any;

declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;
declare var BigNumber: any;

import { Injectable }     from '@angular/core';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTBigNumberService } from './ft-bigNumber';

// Originally I thought the user would switch between blockchains. Why not be on all of them at once?
// Either this should be refactored to enable that - or this is the Ethereum instance that gets called by the global one that keeps track of everything.

@Injectable()
export class FTWeb3Service {
    private nets:string[]=[];
    private currentNetName: string;
    private currentWeb3;

    private zeroAddress="0000000000000000000000000000000000000000";
    private gasPrice=0;
    private chainId = "913945103463586943";

    constructor ( private cache: FTCache, private obs: FTObserver, private bigNum: FTBigNumberService ) { 
        if(typeof web3 !== 'undefined'){
            this.nets['existing'] = web3.currentProvider;
        }
        this.nets['testnet'] = 'wss://testmarket.fintechtoken.com';
        this.nets['local'] = 'ws://localhost:8545';
    }
    
    initializeWeb3(): void{
        if (typeof web3 !== 'undefined') {
            //Todo: use on realnet: this.setWeb3('existing');
            //this.setWeb3('local');
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
        this.checkReadyState(newWeb3);
    }

    private checkReadyState(newWeb3) {
        this.obs.putObserver('block', 'Connecting');
        this.currentWeb3 = newWeb3;
        if(newWeb3.currentProvider.connection.readyState){
            if(newWeb3.currentProvider.connection.readyState==1){
                this.configureBlock();
            } else {
                console.log('NotConnected:' + newWeb3.currentProvider.connection.readyState);
                this.obs.putObserver('block', 'Not Connected');
                setTimeout(()=> {
                    this.initializeWeb3();
                },5000);    
            }
        } else {
            setTimeout(()=> {
                this.checkReadyState(newWeb3);
            },500);
        }
    }

    isWeb3Loaded(): boolean {
        if(this.currentWeb3 && this.currentWeb3.connection && this.currentWeb3.connection.readyState)
            return true;
        else
            return false;
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

    getBalance(fromAddress): any {
        return this.currentWeb3.eth.getBalance(fromAddress)
        .then( (balance) => {
            return balance.toString(); 
        })
        .catch(console.log);
    }

    getMyBalance(): any {
        return this.getBalance(this.cache.getCache('encrypted_id').address);
    }

    createContractInterface(contractABI, contractAddress): any {
        return new this.currentWeb3.eth.Contract(contractABI, contractAddress, {
            gasPrice: '0' // default gas price in wei
          });
    }

    asciiToHex(myString): any {
        return this.currentWeb3.utils.asciiToHex(myString);
    }

    fromWei(amount, convertTo): any {
        if(!amount)
            amount = '0';
        return this.currentWeb3.utils.fromWei(amount, convertTo);
    }

    signTrans(gasEst, toAddress, sendValue, encodedABI): any {
        let fromAddress = this.cache.getCache('encrypted_id').address;
        let privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
        let maxGas = this.bigNum.multiplyBigNumber(gasEst,"2");
        return this.currentWeb3.eth.getTransactionCount('0x' + fromAddress)
        .then( (nonce) => {
            let txData;
            if(toAddress){
                if(encodedABI)
                    txData = {
                        nonce:    numberToHex(nonce),
                        gasPrice: numberToHex(this.gasPrice),
                        gasLimit: numberToHex(maxGas),
                        to:       '0x' + toAddress,
                        value:    numberToHex(sendValue),
                        data:     encodedABI,
                        chainId:  this.chainId.toString()
                    }
                else {
                    txData = {
                        nonce:    numberToHex(nonce),
                        gasPrice: numberToHex(this.gasPrice),
                        gasLimit: numberToHex(maxGas),
                        to:       '0x' + toAddress,
                        value:    numberToHex(sendValue),
                        chainId:  this.chainId.toString()
                    }
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
            return '0x' + tx.serialize().toString('hex');
        })
        .catch(err => {throw err;});
    }

    sendSignedTrans(signedTrans): any {
        return this.currentWeb3.eth.sendSignedTransaction(signedTrans);
    }

    sendEth(to, value): any {
        this.signAndSendTrans('21000',to, value, null);
    }

    estimateGas(to, tran) {
        return this.currentWeb3.eth.estimateGas({to:to, data:tran});
    }

    signAndSendTrans(gasEst, toAddress, sendValue, encodedABI): any {
        return this.signTrans(gasEst, toAddress, sendValue, encodedABI)
        .then(signedTran=>
            {return this.sendSignedTrans(signedTran);}
        )
        .catch(console.log);
    }

    compile(sourceCode): any{
        return this.currentWeb3.eth.compile.solidity(sourceCode);
    }

    estimateGasPublish(compiledCode, compiledABI): any{
        return this.deploy(compiledCode, compiledABI)
        .estimateGas();
    }

    PublishABI(compiledCode, compiledABI): any{
        return this.deploy(compiledCode, compiledABI)
        .encodeABI();
    }

    keccak256(hashMe:string): string {
        return this.currentWeb3.utils.sha3(hashMe);
    }

    private deploy(compiledCode, compiledABI): any{
        let myContract = new this.currentWeb3.eth.Contract(compiledABI);
        return myContract.deploy({data: compiledCode});
    }

    private setProvider( netName ): any {
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
        })
        .on( "error", err => {
            console.log(err);
            this.initializeWeb3();
        });
    }

}
