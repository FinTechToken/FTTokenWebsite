import { Component, OnInit } from '@angular/core';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
import { FTSession } from '../FTFramework/FT-Session';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';

@Component({
  moduleId: module.id,
  selector: 'ft-buyEther',
  templateUrl: '../../html/components/ft-buyEther.html'
})

export class FTBuyEther {
  texts=[];
  modalHeight;

  constructor( public ftNum: FTBigNumberService, public ftweb3: FTWeb3Service, private ftwallet: FTWalletService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
    
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
  } 
  
  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }
}
