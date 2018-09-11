import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTCache } from '../FTFramework/FT-Cache';

import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTMarketService } from '../FTServices/ft-market';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';
import { FTCryptoPassService } from '../FTServices/ft-cryptoPass';

@Component({
  moduleId: module.id,
  selector: 'ft-accountWallet',
  templateUrl: '../../html/components/ft-accountWallet.html'
})

export class FTAccountWallet {
  tabs = 1;
  action=[];
  maxGas;

  constructor( private ftCrypto: FTCryptoPassService, private ftTokenWatch: FTTokenWatchService, public ftMarket: FTMarketService, private ftNum: FTBigNumberService, public ftWallet: FTWalletService, private router:Router, private ftweb3: FTWeb3Service, private obs: FTObserver, private cache: FTCache, private http: FTHttpClient, private session:FTSession ) 
  {}
  
  ngOnInit(): void {
  } 

  ngAfterViewInit(): void {} 

  ngOnDestroy(): void {
  }

  changeTabs(tab:number): void {
    this.tabs = tab;
  }

  getftTokenWatch() {
    return this.ftTokenWatch.TokenWatch;
  }

  viewNumber(number:string): void {
    this.cache.putCache('number', number);
    this.obs.putObserver('modal', 'showNumber');
  }

  showOffersToBuy(number) {
    this.cache.putCache('number', number);
    this.obs.putObserver('modal', 'account-trade.buyOffers');
  }

  showOffersToSell(index, number) {
    this.cache.putCache('number', number);
    this.obs.putObserver('tokenIndex', index);
    this.obs.putObserver('modal', 'account-trade.sellOffers');
  }

  takeAction(index){
    this.obs.putObserver('tokenIndex', index);
    this.obs.putObserver('modal', 'account-wallet.actions');
  }
  
}
