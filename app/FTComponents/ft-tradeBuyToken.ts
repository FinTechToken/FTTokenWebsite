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
  selector: 'ft-tradeBuyToken',
  templateUrl: '../../html/components/ft-tradeBuyToken.html'
})

export class FTTradeBuyToken {
  texts=[];
  modalHeight;
  buyTabs=1;
  tokenIndex;

  buyToken="0";
  buyPrice="0";

  withdrawTokenAmount:string = "0";
  gasPrice="0";

  constructor( public ftTokenWatch: FTTokenWatchService, private ftNum: FTBigNumberService, public ftWallet: FTWalletService, private ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';

    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    
    if(this.obs.getObserverValue('modalNumber')) {
      if(this.cache.getCache('tradeBuyToken.type') == 'token')
        this.cache.putCache('tradeBuyToken.token', this.obs.getObserverValue('modalNumber'));
      else if(this.cache.getCache('tradeBuyToken.type') == 'price')
        this.cache.putCache('tradeBuyToken.price', this.obs.getObserverValue('modalNumber'));
      this.cache.deleteCache('tradeBuyToken.type');
      this.obs.deleteObserver('modalNumber');
    } 
    this.buyPrice = this.cache.getCache('tradeBuyToken.price') ? this.cache.getCache('tradeBuyToken.price') : "0";
    this.buyToken = this.cache.getCache('tradeBuyToken.token') ? this.cache.getCache('tradeBuyToken.token') : "0";

    this.obs.getObserver('tradeSetPrice')
    .forEach( newPrice => {
      if(newPrice){
        this.obs.putObserver('tradeSetPrice','');
        this.cache.putCache('tradeBuyToken.price', newPrice);
        this.buyPrice = newPrice;
        if(this.ftNum.compareBigNumber(this.calculateMaxTokens(), this.buyToken) == -1) {
          this.cache.putCache('tradeBuyToken.token', this.calculateMaxTokens());
          this.buyToken = this.cache.getCache('tradeBuyToken.token');
        } 
        this.changeBuyTabs(1);
      }
    })
  } 

  ngOnDestroy() {
    this.obs.deleteObserver('tradeSetPrice');
  }

  sell() {
    this.cache.putCache('tradeSellToken.price', this.buyPrice);
    this.obs.putObserver('modal', 'account-trade.sellToken');
  }

  buyOfferConfirm(){
    this.ftMarket.buildAndSendDepositBuyTokenTrans(this.buyPrice, this.buyToken, this.tokenIndex, this.calculateEtherNeeded());
    this.close();
  }

  changeBuyToken() {
    this.cache.putCache('number', this.buyToken);
    this.cache.putCache('tradeBuyToken.type', 'token');
    this.cache.putCache('maxNumber', this.buyPrice != "0" ? this.calculateMaxTokens() : "0");
    this.obs.putObserver('modal','pickNumber');
  }

  changeBuyPrice(){
    this.cache.putCache('number', this.buyPrice);
    this.cache.putCache('tradeBuyToken.type', 'price');
    this.cache.putCache('maxNumber', this.buyToken != "0" ? this.calculateMaxPrice() : "0");
    this.obs.putObserver('modal','pickNumberSmall');
  }

  private calculateEtherNeeded() {
    return this.ftNum.addBigNumber(this.ftNum.divideBigNumber(this.ftNum.multiplyBigNumber(this.buyToken,this.ftNum.divideBigNumber(this.buyPrice,"1000000000000")),"1000000"),"1000000000000000")
  }

  private calculateMaxTokens() {
    let accountMinusBookFee = this.ftNum.subtractBigNumber(this.ftWallet.getBalance(),"1000000000000000");
    return this.ftNum.multiplyBigNumber(this.ftNum.divideBigNumber(accountMinusBookFee,this.ftNum.divideBigNumber(this.buyPrice,"1000000000000")),"1000000");
  }

  private calculateMaxPrice() {
    let accountMinusBookFee = this.ftNum.subtractBigNumber(this.ftWallet.getBalance(),"1000000000000000");
    return this.ftNum.divideBigNumber(this.ftNum.multiplyBigNumber(accountMinusBookFee,"1000000000000000000"),this.buyToken);
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  changeBuyTabs(num) {
    this.buyTabs = num;
  }

  private setText(): void {
  }
}
