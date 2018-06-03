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
  selector: 'ft-depositTokenToTrade',
  templateUrl: '../../html/components/ft-depositTokenToTrade.html'
})

export class FTDepositTokenToTrade {
  texts=[];
  modalHeight;
  depositTokenAmount:string = "0";
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
      this.depositTokenAmount = this.obs.getObserver('modalNumber').getValue();
      this.obs.deleteObserver('modalNumber');
    } else {
      this.depositTokenAmount = this.ftTokenWatch.TokenWatch[this.tokenIndex].mine;
    }
    this.ftMarket.buildDepositTokenTrans(this.depositTokenAmount, this.tokenIndex);
  } 

  changeTokenDeposit(){
    this.cache.putCache('number', this.depositTokenAmount);
    this.cache.putCache('maxNumber', this.ftTokenWatch.TokenWatch[this.tokenIndex].mine);
    this.obs.putObserver('modal','pickNumber');
  }

  depositTokenConfirm(){
    this.ftMarket.confirmApprovalAndSendTrans(this.depositTokenAmount, this.tokenIndex);
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
