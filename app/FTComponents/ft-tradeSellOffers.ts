import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';

import { FTMarketService } from '../FTServices/ft-market';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTCache } from '../FTFramework/FT-Cache';



@Component({
  moduleId: module.id,
  selector: 'ft-tradeSellOffers',
  templateUrl: '../../html/components/ft-tradeSellOffers.html'
})

export class FTTradeSellOffers {
  tokenIndex:0;
  modalHeight;
  number = '0';

  constructor( private cache: FTCache, public ftTokenWatch: FTTokenWatchService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, public ftNum: FTBigNumberService, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.number = this.cache.getCache('number');
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    this.ftMarket.resetTrans();
  } 

  ngOnDestroy(): void {
    this.ftMarket.resetTrans();
  }

  close(): void {
    this.obs.putObserver('modal', '');
  }

  cancelTokenSellOffer(token,amount) {
    this.ftMarket.buildCancelOffer(token, amount, false);
  }

  cancelOfferConfirm() {
    this.ftMarket.confirmTrans();
    this.ftMarket.returnToken=true;
    this.close();
  }

  private setText(): void {
  }
}
