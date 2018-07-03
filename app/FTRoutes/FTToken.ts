
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';

import { FTBigNumberService } from '../FTServices/ft-bigNumber'; 
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch'; 
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTWeb3Service } from '../FTServices/ft-web3'; 
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-token',
  templateUrl: '../../html/routes/token.html'
})

export class FTToken {
  subscribeParam;
  subscribeAmount;
  tokenAddress = '0x00';
  tokenIndex = 0;
  tokenName = '';
  tokenTotalSupply = '0';
  tokenTotalOutstanding = '0';
  tokenMine='0';
  etherBalance='0';

  tokenLastPrice;
  tokenLactCount;

  fromAddress;
  tabs = 1;

  amountToSend=[];
  abi=[];
  signTrans=[];
  inputs=[[]];
  inputsProcessed=[[]];
  gasEst=[];
  results=[];
  errMessage=[];

  constructor( public ftWallet:FTWalletService, public ftweb3:FTWeb3Service, public ftNum: FTBigNumberService, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, public ftTokenWatch: FTTokenWatchService )
  {
    if(!this.cache.getCache('key')){
      this.router.navigate(['/crypto_pass']);
    }

    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the token passed in the route
      let fromValue = {from:'0x'+this.cache.getCache('encrypted_id').address};
      this.tokenAddress = params['id'];
      this.tokenIndex = this.ftTokenWatch.getTokenIndexByAddress('0x' + this.tokenAddress);
      if(!this.ftTokenWatch.TokenWatch[this.tokenIndex])
        this.router.navigate(['/myaccount']);
      this.tokenName = this.ftTokenWatch.TokenWatch[this.tokenIndex].name;
      this.tokenMine = this.ftNum.addBigNumber(this.ftTokenWatch.TokenWatch[this.tokenIndex].mine, this.ftTokenWatch.TokenWatch[this.tokenIndex].mineTrade);
      if(this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.name)
        this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.name().call(fromValue).then( 
          (result5) => {
            let tokenName = result5 == 0 ? "0" : result5.toString();
            if(tokenName != '32')
              this.tokenName = tokenName;
          });
      if(this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalSupply)
        this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalSupply().call(fromValue).then( 
          (result1) => {
            this.tokenTotalSupply = result1 == 0 ? "0" : result1.toString();
          }
        );
      if(this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalOutstanding)
        this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalOutstanding().call(fromValue).then( 
          (result2) => this.tokenTotalOutstanding = result2 == 0 ? "0" : result2.toString()
        );
      this.ftweb3.getBalance(this.tokenAddress).then(value=>this.etherBalance=value);
      
      //console.log(this.ftTokenWatch.TokenWatch[this.tokenIndex].abi);
      
      this.getABI().forEach( (element, myindex) => {
        this.getGasEst(myindex);
      });
    });

  }

  getABI() {
    return this.ftTokenWatch.TokenWatch[this.tokenIndex].abi;
  }

  getSortedKeys(map: any, direction: boolean): any{
    return this.ftNum.getSortedKeys(map, direction);
  }

  changeAmountToSend(index) {
    this.cache.putCache('number', this.amountToSend[index]);
    this.cache.putCache('maxNumber', this.ftWallet.getBalance());
    this.obs.putObserver('modal','pickNumber');

    this.subscribeAmount = this.obs.getObserver('modalNumber').subscribe(amount=> {
      if(amount != ''){
        this.amountToSend[index]=amount;
        this.obs.deleteObserver('modalNumber');
        this.subscribeAmount.unsubscribe();
        this.getGasEst(index);
      }
    });
  }

  changeInputAmount(index,index2) {
    this.cache.putCache('number', this.inputs[index][index2]);
    this.cache.putCache('maxNumber', '0');
    this.obs.putObserver('modal','pickNumber');

    this.subscribeAmount = this.obs.getObserver('modalNumber').subscribe(amount=> {
      if(amount != ''){
        this.inputs[index][index2]=amount;
        this.obs.deleteObserver('modalNumber');
        this.subscribeAmount.unsubscribe();
        this.getGasEst(index);
      }
    });
  }

  ngOnInit(): void{ 
    this.fromAddress = this.cache.getCache('encrypted_id') ? this.cache.getCache('encrypted_id').address : this.fromAddress;
  }    

  ngAfterViewInit(): void{
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
    if(this.subscribeAmount)
      this.subscribeAmount.unsubscribe();
  }

  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  viewNumber(number:string): void {
    this.cache.putCache('number', number);
    this.obs.putObserver('modal', 'showNumber');
  }

  showTokenInfo(): void {
    this.obs.putObserver('modal', 'token.info');
  }

  getGasEst(index) {
    this.gasEst[index]=0;
    if(this.getABI()[index].type=='fallback') {
      this.errMessage[index] = '';
      if(!this.amountToSend[index])
        this.amountToSend[index] = '0';
      this.ftweb3.signTrans("15000", this.tokenAddress, this.amountToSend[index], '' )
      .then(value=>
        {
          this.signTrans[index] = value;
          this.ftweb3.estimateGas(this.tokenAddress,value).then(value2=>{
            this.gasEst[index] = value2;
        })
        .catch(err=>{this.errMessage[index]=err.message;});
      });
    }

    if(this.getABI()[index].type=='function') {
      this.errMessage[index] = '';
      
      //var ABIdata = this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods[this.getABI()[index].name]('0x' + this.ftNum.getZero(), "0").encodeABI();
      if(!this.amountToSend[index])
          this.amountToSend[index]='0';
      var fromValue;
      if(this.getABI()[index].payable){
        fromValue = {from:'0x'+this.cache.getCache('encrypted_id').address, value:this.amountToSend[index]};
      }
      else
        fromValue = {from:'0x'+this.cache.getCache('encrypted_id').address};
      if(!this.inputs[index])
        this.inputs[index] = [];
      if(!this.inputsProcessed[index])
        this.inputsProcessed[index] = [];
      this.getABI()[index].inputs.forEach((input, input_index) => {
        if(input.type=='address') {
          this.inputs[index][input_index] = this.inputs[index][input_index] ? this.inputs[index][input_index] : '0x' + this.ftNum.getZero();
          this.inputsProcessed[index][input_index] = this.inputs[index][input_index];
        }
        else if(input.type.substring(0,4) == 'uint') {
          this.inputs[index][input_index] = this.inputs[index][input_index] ? this.inputs[index][input_index] : '0';
          this.inputsProcessed[index][input_index] = this.inputs[index][input_index];
        }
        else {
          this.inputs[index][input_index] = this.inputs[index][input_index] ? this.inputs[index][input_index] : '';
          this.inputsProcessed[index][input_index] = this.inputs[index][input_index];
        }
      });
try {
      this.abi[index] = this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods[this.getABI()[index].name](...this.inputsProcessed[index]).encodeABI();
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods[this.getABI()[index].name](...this.inputsProcessed[index]).estimateGas(fromValue)
      .then( (gasEstimate) => {
        if(this.getABI()[index].constant)
          this.gasEst[index] = 0;
        else
          this.gasEst[index] = gasEstimate;
        this.ftweb3.signTrans(gasEstimate,this.tokenAddress,this.amountToSend[index],this.abi[index])
          .then(signedTrans => {
            this.signTrans[index] = signedTrans;
            return null;
          })
          .catch(err => {this.errMessage[index]=err.message;});
      })
      .catch(err => {this.errMessage[index]=err.message;}); 
    }
  catch(e){console.log(e.message);}
  }
}

  callFunction(index) {
    var fromValue;
      if(this.getABI()[index].payable){
        fromValue = {from:'0x'+this.cache.getCache('encrypted_id').address, value:this.amountToSend[index]};
      }
      else
        fromValue = {from:'0x'+this.cache.getCache('encrypted_id').address};
    if(this.getABI()[index].constant)
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods[this.getABI()[index].name](...this.inputsProcessed[index]).call(fromValue).then(response =>    
        {this.results[index] = response;})
        .catch(err => {this.errMessage[index]=err.message});
    else
      this.ftweb3.sendSignedTrans(this.signTrans[index]).then(response => 
        {
          this.results[index] = 'TransactionComplete: Gasused: ' + response.gasUsed;
          this.getABI().forEach( (element, myindex) => {
            this.getGasEst(myindex);
          });
        })
        .catch(err => {this.errMessage[index]=err.message;});
  }

/*
  getFreeToken(): void {
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.token.contract.methods.getFreeToken().encodeABI();
    var chainId = "913945103463586943";
    this.token.contract.methods.gotFree('0x'+this.fromAddress).call().then( (returns) => {
      this.gotFree = returns;
      }
    );
    this.token.contract.methods.getFreeToken().estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.token.estimate = returns;
      this.maxGas = this.multiplyBigNumber(this.token.estimate,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
            to:       '0x' + this.token.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.token.serializedTx = tx.serialize();
        this.token.receipt = null;
        this.token.transaction = '';
        this.token.confirmed = 0;
        this.token.error = '';
        return null;
      });
    });
    this.showModal(3);
  }

  getFreeTokenConfirm(): void {
    if(this.token.subscription){
      this.token.subscription.removeAllListeners();
    }
    this.token.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.token.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.token.transaction = hash; this.updateTutorial();})
    .once('receipt', (receipt) =>{ this.token.receipt = receipt;})
    .on('confirmation', (confNumber, receipt) => { this.token.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.token.error = error;})
    this.showModal(4);
  }
*/
}
