import { Injectable, OnDestroy } from '@angular/core';

import { FTObserver } from '../FTFramework/FT-Observer';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Injectable()

export class FTWalletService {
  
  private accountBalance:string="0";
  private subscribeBlock; 

  constructor ( private ftTokenWatch: FTTokenWatchService, private ftweb3: FTWeb3Service, private ftNum: FTBigNumberService, private obs: FTObserver, private cache: FTCache ) { 
    
    this.obs.getObserver('isPreviousUser').forEach( isPrev => {
      if(isPrev){
        this.ftweb3.getMyBalance().then( (balance) => {
          this.accountBalance = balance.toString(); 
        });
        this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
          this.ftweb3.getMyBalance().then( (balance) => {
            this.accountBalance = balance.toString(); 
          });

          this.ftTokenWatch.TokenWatch.forEach( token => {
            token.contract.methods.balanceOf(this.cache.getCache('encrypted_id').address).call().then(
              result => { token.mine = result.toString();
            });
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    if(this.subscribeBlock){
      this.subscribeBlock.unsubscribe();
    }
  }

  getBalance(): string {
    return this.accountBalance;
  }
}
