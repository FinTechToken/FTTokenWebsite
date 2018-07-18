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

@Component({
  moduleId: module.id,
  selector: 'ft-withdrawFTT',
  templateUrl: '../../html/components/ft-withdrawFTT.html'
})

export class FTWithdrawFTT {
  texts=[];
  modalHeight;
  withdrawEtherAmount:string = "0";
  gasPrice="0";

  constructor( public ftCrypto: FTCryptoPassService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    if(this.obs.getObserverValue('modalNumber')) {
      this.withdrawEtherAmount = this.obs.getObserverValue('modalNumber');
      this.obs.deleteObserver('modalNumber');
    } else {
      this.withdrawEtherAmount = this.ftWallet.getBalance();
    }
    this.gasPrice="21000";
  }

  changeEtherWithdraw(){
    this.cache.putCache('number', this.withdrawEtherAmount);
    this.cache.putCache('maxNumber', this.ftWallet.getBalance());
    this.obs.putObserver('modal','pickNumber');
  }

  withdrawEtherConfirm(){
    this.ftWallet.withdrawTrans(this.withdrawEtherAmount);
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
