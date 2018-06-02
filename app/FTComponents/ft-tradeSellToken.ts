import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'ft-tradeSellToken',
  templateUrl: '../../html/components/ft-tradeSellToken.html'
})

export class FTTradeSellToken {
  texts=[];
  modalHeight;
  sellTabs=1;
  tokenIndex;

  sellToken="0";
  sellPrice="0";

  withdrawTokenAmount:string = "0";
  gasPrice="0";

  constructor( private ftTokenWatch: FTTokenWatchService, private ftNum: FTBigNumberService, private ftWallet: FTWalletService, private ftweb3: FTWeb3Service, private ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';

    this.tokenIndex = this.obs.getObserver('tokenIndex').getValue();
    
    if(this.obs.getObserver('modalNumber').getValue()) {
      if(this.cache.getCache('tradeSellToken.type') == 'token')
        this.cache.putCache('tradeSellToken.token', this.obs.getObserver('modalNumber').getValue());
      else if(this.cache.getCache('tradeSellToken.type') == 'price')
        this.cache.putCache('tradeSellToken.price', this.obs.getObserver('modalNumber').getValue());
      this.cache.deleteCache('tradeSellToken.type');
      this.obs.deleteObserver('modalNumber');
    } 
    this.sellPrice = this.cache.getCache('tradeSellToken.price') ? this.cache.getCache('tradeSellToken.price') : "0";
    this.sellToken = this.cache.getCache('tradeSellToken.token') ? this.cache.getCache('tradeSellToken.token') : "0";

    this.tryBuildSellOfferTrans();

    this.obs.getObserver('tradeSetPrice')
    .forEach( newPrice => {
      if(newPrice){
        this.obs.putObserver('tradeSetPrice','');
        this.cache.putCache('tradeSellToken.price', newPrice);
        this.sellPrice = newPrice;
        this.tryBuildSellOfferTrans();
        this.changeSellTabs(1);
      }
    })
  } 

  ngOnDestroy() {
    this.obs.deleteObserver('tradeSetPrice');
  }

  sellOfferConfirm(){
    this.ftMarket.confirmTrans();
    this.close();
  }

  tryBuildSellOfferTrans() {
    if(this.sellPrice != "0" && this.sellToken != "0")
      this.ftMarket.buildSellOfferTrans(this.sellPrice, this.sellToken, this.tokenIndex);
    else
      this.ftMarket.resetTrans();
  }

  changeSellToken() {
    this.cache.putCache('number', this.sellToken);
    this.cache.putCache('tradeSellToken.type', 'token');
    this.cache.putCache('maxNumber', this.ftTokenWatch.TokenWatch[this.tokenIndex].mineTrade);
    this.obs.putObserver('modal','pickNumber');
  }

  changeSellPrice(){
    this.cache.putCache('number', this.sellPrice);
    this.cache.putCache('tradeSellToken.type', 'price');
    this.cache.putCache('maxNumber', "0");
    this.obs.putObserver('modal','pickNumberSmall');
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  changeSellTabs(num) {
    this.sellTabs = num;
  }

  private setText(): void {
  }
}
