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
  selector: 'ft-sendEther',
  templateUrl: '../../html/components/ft-sendEther.html'
})

export class FTSendEther {
  texts=[];
  modalHeight;
  send_steps = {
    enterInfo: 0,
    success: 1
  };
  send_step = this.send_steps.enterInfo;
  tel1="";
  tel2="";
  tel3="";

  sendAmount="0";

  constructor( public ftNum: FTBigNumberService, public ftweb3: FTWeb3Service, public ftwallet: FTWalletService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
    
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';

    if(this.obs.getObserverValue('modalNumber')) {
      if(this.cache.getCache('sendEther.type') == 'amount')
        this.cache.putCache('sendEther.amount', this.obs.getObserverValue('modalNumber'));
      this.tel1 = this.cache.getCache('tel1');
      this.tel2 = this.cache.getCache('tel2');
      this.tel3 = this.cache.getCache('tel3');
      this.cache.deleteCache('tel1');
      this.cache.deleteCache('tel2');
      this.cache.deleteCache('tel3');
      this.cache.deleteCache('sendEther.type');
      this.obs.deleteObserver('modalNumber');
    } 
    this.sendAmount = this.cache.getCache('sendEther.amount') ? this.cache.getCache('sendEther.amount') : "0";
  } 
  
  close(): void {
    this.obs.putObserver('modal','');
  }

  changeSendAmount(){
    this.cache.putCache('number', this.sendAmount);
    this.cache.putCache('tel1', this.tel1);
    this.cache.putCache('tel2', this.tel2);
    this.cache.putCache('tel3', this.tel3);
    this.cache.putCache('sendEther.type', 'amount');
    this.cache.putCache('maxNumber', this.ftwallet.getBalance());
    this.obs.putObserver('modal','pickNumber');
  }

  sendEther() {
    let token = this.session.getItem('token');
    let account = this.session.getItem('account');
    if(this.tel1.length==3 && this.tel2.length==3 && this.tel3.length==4) {
      let phone=this.tel1+this.tel2+this.tel3;
      this.http.put("hashSend", JSON.stringify({
        "token" : token,
        "account": account,
        "phone": phone
        })).toPromise()
      .then( data => {
        this.ftwallet.fundHash(JSON.parse(data),this.sendAmount, '0x' + this.ftNum.getZero(),"0");
        this.send_step = this.send_steps.success;
      });
    } else {
      console.log('Must Enter Phone Number');
    }
  }

  private setText(): void {
  }
}
