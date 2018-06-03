import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTCache } from '../FTFramework/FT-Cache';

import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-accountWallet',
  templateUrl: '../../html/components/ft-accountWallet.html'
})

export class FTAccountWallet {

  action=[];
  maxGas;

  constructor( public ftTokenWatch: FTTokenWatchService, private ftNum: FTBigNumberService, public ftWallet: FTWalletService, private router:Router, private ftweb3: FTWeb3Service, private obs: FTObserver, private cache: FTCache, private http: FTHttpClient, private session:FTSession ) 
  {}
  
  ngOnInit(): void {
  } 

  ngAfterViewInit(): void {} 

  ngOnDestroy(): void {
  }

  viewNumber(number:string): void {
    this.cache.putCache('number', number);
    this.obs.putObserver('modal', 'showNumber');
  }

  takeAction(index){
    if(this.action[index]=='move_ether_to_trade'){
      this.obs.putObserver('modal', 'account-trade.depositEther');
    } else if(this.action[index]=='move_token_to_trade'){
      this.obs.putObserver('tokenIndex', index-1);
      this.obs.putObserver('modal', 'account-trade.depositToken');
    }
    this.action[index] = "";
  }
  
}
