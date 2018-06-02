import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTSession } from '../FTFramework/FT-Session';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTMarketService } from '../FTServices/ft-market';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-accountTrade',
  templateUrl: '../../html/components/ft-accountTrade.html'
})

export class FTAccountTrade {

  action=[];

  constructor( private ftTokenWatch: FTTokenWatchService, private ftNum: FTBigNumberService, private ftMarket: FTMarketService, private ftWallet: FTWalletService, private router:Router, private obs: FTObserver,  private cache: FTCache, private web3: FTWeb3Service, private http: FTHttpClient, private session:FTSession ) 
  {}
  
  ngOnInit(): void {
  } 

  ngAfterViewInit(): void {
  } 

  viewNumber(number:string): void {
    this.cache.putCache('number', number);
    this.obs.putObserver('modal', 'showNumber');
  }

  takeAction(index){
    if(this.action[index]=='move_ether_to_wallet'){
      this.obs.putObserver('modal', 'account-trade.withdrawEther');
    } else if(this.action[index]=='move_token_to_wallet'){
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.withdrawToken');
    } else if(this.action[index]=='trade_buy_token') {
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.buyToken');
    } else if(this.action[index]=='trade_sell_token') {
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.sellToken');
    }
    this.action[index] = "";
  }
  
}
