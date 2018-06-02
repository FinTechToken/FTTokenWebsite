import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTObserver } from '../FTFramework/FT-Observer';


@Component({
  moduleId: module.id,
  selector: 'ft-tradeTokenBook',
  templateUrl: '../../html/components/ft-tradeTokenBook.html'
})

export class FTTradeTokenBook {
  @Input() tokenIndex: number;
  objectKeys = Object.keys;

  constructor( private ftTokenWatch: FTTokenWatchService, private ftweb3: FTWeb3Service, private ftNum: FTBigNumberService, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
  } 

  ngOnDestroy(): void {

  }

  getSortedKeys(map: any, direction: boolean): any{
    if(!direction) {
        return this.objectKeys(map).sort((a,b) => {return this.ftNum.compareBigNumber(b,a)})
    } else {
        return this.objectKeys(map).sort((a,b) => {return this.ftNum.compareBigNumber(a,b)})
    }
  }

  private setPrice(price) {
    this.obs.putObserver('tradeSetPrice', this.ftNum.multiplyBigNumber(price,"1000000000000"));
  }

  private setText(): void {
  }
}
