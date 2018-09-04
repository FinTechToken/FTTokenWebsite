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
    if(this.action[index]=='send_ether'){
      this.obs.putObserver('modal', 'account-trade.sendEther');
    } else if(this.action[index]=='refer_friend') {
      this.obs.putObserver('modal', 'account-trade.referFriend');
    } else if(this.action[index]=='deposit_ftt') {
      if(this.ftCrypto.homeAddress == "" || this.ftCrypto.name == "" )
        this.obs.putObserver('modal', 'account-trade.setAddress');
      else
        this.obs.putObserver('modal', 'account-trade.depositFTT');
    } else if(this.action[index]=='withdraw_ftt') {
      if(this.ftCrypto.homeAddress == "" || this.ftCrypto.name == "" )
        this.obs.putObserver('modal', 'account-trade.setAddress');
      else
        this.obs.putObserver('modal', 'account-trade.withdrawFTT');
    } else if(this.action[index]=='send_token'){
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.sendToken');
    } else if(this.action[index]=='export_token'){
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.exportToken');
    } else if(this.action[index]=='import_token'){
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.importToken');
    } else if(this.action[index]=='trade_buy_token') {
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.buyToken');
    } else if(this.action[index]=='trade_sell_token') {
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.sellToken');
    } else if(this.action[index]=='view_token') 
      this.router.navigate(['/token/' + this.ftTokenWatch.TokenWatch[index-1].address.substring(2)]);
    this.action[index] = "";
  }
  
}
