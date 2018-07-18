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

@Component({
  moduleId: module.id,
  selector: 'ft-depositFTT',
  templateUrl: '../../html/components/ft-depositFTT.html'
})

export class FTDepositFTT {
  texts=[];
  modalHeight;

  constructor( public ftCrypto: FTCryptoPassService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
  }

  depositFTT(){
    let token = this.session.getItem('token');
    let account = this.session.getItem('account');
    this.http.put("hashSend", JSON.stringify({
      "token" : token,
      "account": account,
      "deposit": true
      })).toPromise()
    .then( data => {
    })
    .catch( err => console.log(err));
    this.close();
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
