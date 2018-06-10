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
import { FTMarketService } from '../FTServices/ft-market';

@Component({
  moduleId: module.id,
  selector: 'ft-accountHistory',
  templateUrl: '../../html/components/ft-accountHistory.html'
})

export class FTAccountHistory {

  constructor( public ftMarket: FTMarketService, public ftTokenWatch: FTTokenWatchService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, private router:Router, public ftweb3: FTWeb3Service, private obs: FTObserver, private cache: FTCache, private http: FTHttpClient, private session:FTSession ) 
  {}
  
  ngOnInit(): void {} 

  ngAfterViewInit(): void {} 

  ngOnDestroy(): void {
  }

  getTrades() {
    return this.ftNum.getSortedKeys(this.ftMarket.myTradesMap,false);
  }
  
}
