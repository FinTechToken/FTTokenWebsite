//ToDo remove component
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

@Component({
  moduleId: module.id,
  selector: 'ft-withdrawEtherFromTrade',
  templateUrl: '../../html/components/ft-withdrawEtherFromTrade.html'
})

export class FTWithdrawEtherFromTrade {
  texts=[];
  modalHeight;
  withdrawEtherAmount:string = "0";
  gasPrice="0";

  constructor( public ftNum: FTBigNumberService, private ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    if(this.obs.getObserverValue('modalNumber')) {
      this.withdrawEtherAmount = this.obs.getObserverValue('modalNumber');
      this.obs.deleteObserver('modalNumber');
    } else {
      this.withdrawEtherAmount = this.ftMarket.getAccountBalance();
    }
  } 

  changeEtherWithdraw(){
    this.cache.putCache('number', this.withdrawEtherAmount);
    this.cache.putCache('maxNumber', this.ftMarket.getAccountBalance());
    this.obs.putObserver('modal','pickNumber');
  }

  withdrawEtherConfirm(){
    this.ftMarket.buildAndSendWithdrawEtherTrans(this.withdrawEtherAmount);
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
