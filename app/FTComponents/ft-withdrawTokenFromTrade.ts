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
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-withdrawTokenFromTrade',
  templateUrl: '../../html/components/ft-withdrawTokenFromTrade.html'
})

export class FTWithdrawTokenFromTrade {
  texts=[];
  modalHeight;
  withdrawTokenAmount:string = "0";
  gasPrice="0";
  tokenIndex;

  constructor( public ftTokenWatch: FTTokenWatchService, public ftNum: FTBigNumberService, private ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserver('tokenIndex').getValue();
    if(this.obs.getObserver('modalNumber').getValue()) {
      this.withdrawTokenAmount = this.obs.getObserver('modalNumber').getValue();
      this.obs.deleteObserver('modalNumber');
    } else {
      this.withdrawTokenAmount = this.ftTokenWatch.TokenWatch[this.tokenIndex].mineTrade;
    }
    this.ftMarket.buildWithdrawTokenTrans(this.withdrawTokenAmount, this.tokenIndex);
  } 

  changeTokenWithdraw(){
    this.cache.putCache('number', this.withdrawTokenAmount);
    this.cache.putCache('maxNumber', this.ftTokenWatch.TokenWatch[this.tokenIndex].mineTrade);
    this.obs.putObserver('modal','pickNumber');
  }

  withdrawTokenConfirm(){
    this.ftMarket.confirmTrans();
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
