import { Component, OnInit } from '@angular/core';
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
import { FTCryptoPassService } from '../FTServices/ft-cryptoPass';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-importToken',
  templateUrl: '../../html/components/ft-importToken.html'
})

export class FTImportToken {
  texts=[];
  modalHeight;
  tokenIndex;
  tokenAddress;

  constructor(  public ftToken: FTTokenWatchService, public ftCrypto: FTCryptoPassService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    this.getImportAddress();
  }

  getImportAddress(){
    let token = this.session.getItem('token');
    let account = this.session.getItem('account');
    this.http.put("hashSend", JSON.stringify({
      "token" : token,
      "account": account,
      "import": true,
      "crypto": (this.tokenIndex+1).toString()
      })).toPromise()
    .then( data => 
      {
        this.tokenAddress = JSON.parse(data);
        if(this.tokenIndex==0) this.tokenAddress='0x' + this.tokenAddress;
      }
    )
    .catch( err => console.log(err));
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
