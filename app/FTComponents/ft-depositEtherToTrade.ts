//ToDo: Remove component
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
  selector: 'ft-depositEtherToTrade',
  templateUrl: '../../html/components/ft-depositEtherToTrade.html'
})

export class FTDepositEtherToTrade {
  texts=[];
  modalHeight;
  depositEtherAmount:string = "0";
  gasPrice="0";

  constructor( public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    if(this.obs.getObserverValue('modalNumber')) {
      this.depositEtherAmount = this.obs.getObserverValue('modalNumber');
      this.obs.deleteObserver('modalNumber');
    } else {
      this.depositEtherAmount = this.ftWallet.getBalance();
    }
    // this.ftNum.subtractBigNumber(this.ftWallet.getBalance(),"100000000000000000");
    //this.ftMarket.buildDepositEtherTrans(this.depositEtherAmount);
  } 

  changeEtherDeposit(){
    this.cache.putCache('number', this.depositEtherAmount);
    this.cache.putCache('maxNumber', this.ftWallet.getBalance());
    this.obs.putObserver('modal','pickNumber');
  }

  depositEtherConfirm(){
    this.ftMarket.confirmTrans();
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
