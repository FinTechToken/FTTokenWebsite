
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';

import { FTBigNumberService } from '../FTServices/ft-bigNumber'; 
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch'; 
import { FTWeb3Service } from '../FTServices/ft-web3'; 
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-token',
  templateUrl: '../../html/routes/token.html'
})

export class FTToken {
  subscribeParam;
  tokenAddress = '0x00';
  tokenIndex = 0;
  tokenName = '';
  tokenTotalSupply = '0';
  tokenTotalOutstanding = '0';
  tokenMine='0';

  tokenLastPrice;
  tokenLactCount;

  fromAddress;
  tabs = 1;

  constructor( public ftweb3:FTWeb3Service, public ftNum: FTBigNumberService, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, public ftTokenWatch: FTTokenWatchService )
  {}

  getSortedKeys(map: any, direction: boolean): any{
    return this.ftNum.getSortedKeys(map, direction);
  }

  ngOnInit(): void{ 
    
    if(!this.cache.getCache('key')){
      this.router.navigate(['/crypto_pass']);
    }

    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the token passed in the route
      this.tokenAddress = params['id'];
      this.tokenIndex = this.ftTokenWatch.getTokenIndexByAddress('0x' + this.tokenAddress);
      this.tokenName = this.ftTokenWatch.TokenWatch[this.tokenIndex].name;
      this.tokenMine = this.ftNum.addBigNumber(this.ftTokenWatch.TokenWatch[this.tokenIndex].mine, this.ftTokenWatch.TokenWatch[this.tokenIndex].mineTrade);
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.name().call().then( 
        (result5) => {
          let tokenName = result5 == 0 ? "0" : result5.toString();
          if(tokenName != '32')
            this.tokenName = tokenName;
        });
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalSupply().call().then( 
        (result1) => {
          this.tokenTotalSupply = result1 == 0 ? "0" : result1.toString();
        }
      );
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.totalOutstanding().call().then( 
        (result2) => this.tokenTotalOutstanding = result2 == 0 ? "0" : result2.toString()
      );
    });
    
    this.fromAddress = this.cache.getCache('encrypted_id') ? this.cache.getCache('encrypted_id').address : this.fromAddress;
  }    

  ngAfterViewInit(): void{
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
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
