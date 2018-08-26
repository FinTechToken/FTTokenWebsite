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

  constructor( public ftTokenWatch: FTTokenWatchService, public ftNum: FTBigNumberService, private ftWallet: FTWalletService, private ftweb3: FTWeb3Service, private ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';

    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    
    if(this.obs.getObserverValue('modalNumber')) {
      if(this.cache.getCache('tradeSellToken.type') == 'token')
        this.cache.putCache('tradeSellToken.token', this.obs.getObserverValue('modalNumber'));
      else if(this.cache.getCache('tradeSellToken.type') == 'price')
        this.cache.putCache('tradeSellToken.price', this.obs.getObserverValue('modalNumber'));
      this.cache.deleteCache('tradeSellToken.type');
      this.obs.deleteObserver('modalNumber');
    } 
    this.sellPrice = this.cache.getCache('tradeSellToken.price') ? this.cache.getCache('tradeSellToken.price') : "0";
    this.sellToken = this.cache.getCache('tradeSellToken.token') ? this.cache.getCache('tradeSellToken.token') : "0";
    this.obs.getObserver('tradeSetPrice')
    .forEach( newPrice => {
      if(newPrice){
        this.obs.putObserver('tradeSetPrice','');
        this.cache.putCache('tradeSellToken.price', newPrice);
        this.sellPrice = newPrice;
        this.changeSellTabs(1);
      }
    })
  } 

  buy() {
    this.cache.putCache('tradeBuyToken.price', this.sellPrice);
    this.obs.putObserver('modal', 'account-trade.buyToken');
  }

  ngOnDestroy() {
    this.obs.deleteObserver('tradeSetPrice');
  }

  sellOfferConfirm(){
    this.ftMarket.buildAndSellDepositTokenTrans(this.sellToken,this.tokenIndex, this.sellPrice);
    this.close();
  }

  amtToReceive() {
    return this.ftNum.subtractBigNumber(
      this.ftNum.divideBigNumber(
          this.ftNum.multiplyBigNumber(
              this.sellToken,
              this.ftNum.divideBigNumber(
                  this.sellPrice,
                  "1000000000000"
              )
          ),
          "1000000"
      ),
      this.ftNum.addBigNumber(
          this.ftNum.divideBigNumber(
              this.ftNum.multiplyBigNumber(
                  this.sellToken,
                  this.ftNum.divideBigNumber(
                      this.sellPrice,
                      "1000000000000"
                  )       
              ),
              "1000000000"
          ),
          "1000000000000000"
      )
    )
  }

  changeSellToken() {
    this.cache.putCache('number', this.sellToken);
    this.cache.putCache('tradeSellToken.type', 'token');
    this.cache.putCache('maxNumber', this.ftTokenWatch.TokenWatch[this.tokenIndex].mine);
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
