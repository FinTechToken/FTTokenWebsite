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
  selector: 'ft-accountWalletActions',
  templateUrl: '../../html/components/ft-accountWalletActions.html'
})

export class FTAccountWalletActions {
  modalHeight;
  tokenIndex;

  constructor( private ftCrypto: FTCryptoPassService, private ftToken: FTTokenWatchService, public ftMarket: FTMarketService, private ftNum: FTBigNumberService, public ftWallet: FTWalletService, private router:Router, private ftweb3: FTWeb3Service, private obs: FTObserver, private cache: FTCache, private http: FTHttpClient, private session:FTSession ) 
  {}
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
  } 

  ngAfterViewInit(): void {} 

  ngOnDestroy(): void {
  }

  close(): void {
    this.obs.putObserver('tokenIndex','');
    this.obs.putObserver('modal','');
  }

  takeAction(command){
    if(command=='send_ether'){
      this.obs.putObserver('modal', 'account-trade.sendEther');
    } else if(command=='refer_friend') {
      this.obs.putObserver('modal', 'account-trade.referFriend');
    } else if(command=='deposit_ftt') {
      if(this.ftCrypto.homeAddress == "" || this.ftCrypto.name == "" )
        this.obs.putObserver('modal', 'account-trade.setAddress');
      else
        this.obs.putObserver('modal', 'account-trade.depositFTT');
    } else if(command=='withdraw_ftt') {
      if(this.ftCrypto.homeAddress == "" || this.ftCrypto.name == "" )
        this.obs.putObserver('modal', 'account-trade.setAddress');
      else
        this.obs.putObserver('modal', 'account-trade.withdrawFTT');
    } else if(command=='send_token'){
      this.obs.putObserver('modal', 'account-trade.sendToken');
    } else if(command=='export_token'){
      this.obs.putObserver('modal', 'account-trade.exportToken');
    } else if(command=='import_token'){
      this.obs.putObserver('modal', 'account-trade.importToken');
    } else if(command=='trade_buy_token') {
      this.obs.putObserver('modal', 'account-trade.buyToken');
    } else if(command=='trade_sell_token') {
      this.obs.putObserver('modal', 'account-trade.sellToken');
    } else if(command=='view_token') {
      this.close();
      this.router.navigate(['/token/' + this.ftToken.TokenWatch[this.tokenIndex].address.substring(2)]);
    }
  }
  
}
