import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
import { FTSession } from '../FTFramework/FT-Session';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTMarketService } from '../FTServices/ft-market';
import { FTCryptoPassService } from '../FTServices/ft-cryptoPass';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-exportToken',
  templateUrl: '../../html/components/ft-exportToken.html'
})

export class FTExportToken {
  texts=[];
  modalHeight;
  tokenIndex;
  exportTokenAmount:string = "0";
  exportAddress;
  gasPrice="0";
  exportAddressStatus;

  constructor( public ftTokenWatch: FTTokenWatchService, public ftCrypto: FTCryptoPassService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    if(this.obs.getObserverValue('modalNumber')) {
      this.exportTokenAmount = this.obs.getObserverValue('modalNumber');
      this.obs.deleteObserver('modalNumber');
    } else {
      this.exportTokenAmount = this.ftTokenWatch.TokenWatch[this.tokenIndex].mine;
    }
    if(this.obs.getObserverValue('exportAddress')) {
      this.exportAddress = this.obs.getObserverValue('exportAddress');
      this.obs.deleteObserver('exportAddress');
    } else {
      this.exportAddress = '';
    }
    this.checkExportGas();
  }

  private exportAddressSetError(msg:string) {
    this.exportAddressStatus='has-danger';
    document.getElementById('exportAddressBad').innerHTML = msg;
  }

  private exportAddressClearError() {
    this.exportAddressStatus='';
    document.getElementById('exportAddressBad').innerHTML = '';
  }

  private checkExportGas() {
    try {
      var ABIdata = this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).encodeABI();
      this.exportAddressClearError();
      this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
      .then( (gasEstimate) => {
        this.gasPrice=gasEstimate;
      })
      .catch(err => {console.log(err.message);});
    } catch(err) { 
      this.exportAddressSetError(err.message);
    }
  }

  exportAddressChange(event) {
    this.checkExportGas();
  }

  changeExportToken(){
    this.cache.putCache('number', this.exportTokenAmount);
    this.cache.putCache('maxNumber', this.ftTokenWatch.TokenWatch[this.tokenIndex].mine);
    this.obs.putObserver('modal','pickNumber');
  }

  exportTokenConfirm(){
    var ABIdata = this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).encodeABI();
    this.ftTokenWatch.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
    .then( (gasEstimate) => {
      this.gasPrice=gasEstimate;
      //ToDo: Create And Send Transaction
    });
    //this.close(); // Only after trans sent.
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
