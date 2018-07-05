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
  selector: 'ft-referFriend',
  templateUrl: '../../html/components/ft-referFriend.html'
})

export class FTReferFriend {
  texts=[];
  modalHeight;
  send_steps = {
    enterInfo: 0,
    success: 1,
    badNumber: 2
  };
  send_step = this.send_steps.enterInfo;
  tel1="";
  tel2="";
  tel3="";

  sendAmount="0";

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

  sendInvite() {
    let token = this.session.getItem('token');
    let account = this.session.getItem('account');
    if(this.tel1.length==3 && this.tel2.length==3 && this.tel3.length==4) {
      let phone=this.tel1+this.tel2+this.tel3;
      this.http.put("hashSend", JSON.stringify({
        "token" : token,
        "account": account,
        "phone": phone,
        "refer": true
        })).toPromise()
      .then( data => {
        if(JSON.parse(data).errorMessage) {
          this.send_step = this.send_steps.badNumber;
        } else {
          this.ftwallet.fundHash(JSON.parse(data),"0", '0x' + this.ftNum.getZero(),"0");
          this.send_step = this.send_steps.success;
        }
      });
    } else {
      this.send_step = this.send_steps.badNumber;
    }
  }

  private setText(): void {
  }
}
