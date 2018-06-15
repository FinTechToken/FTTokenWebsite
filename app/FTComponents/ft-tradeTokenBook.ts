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
  @Input() modal: number = 1;
  objectKeys = Object.keys;

  constructor( public ftTokenWatch: FTTokenWatchService, private ftweb3: FTWeb3Service, public ftNum: FTBigNumberService, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
  } 

  ngOnDestroy(): void {

  }

  private setPrice(price) {
    if(this.modal)
      this.obs.putObserver('tradeSetPrice', this.ftNum.multiplyBigNumber(price,"1000000000000"));
    else {
      this.obs.putObserver('tokenIndex', this.tokenIndex);
      this.obs.putObserver('tradeSetPrice', this.ftNum.multiplyBigNumber(price,"1000000000000"));
      this.obs.putObserver('modal', 'account-trade.buyToken');
    }
  }

  private setText(): void {
  }
}
