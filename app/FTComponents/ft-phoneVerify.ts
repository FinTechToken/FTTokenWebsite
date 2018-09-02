import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
import { FTSession } from '../FTFramework/FT-Session';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTWalletService } from '../FTServices/ft-wallet';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';

@Component({
  moduleId: module.id,
  selector: 'ft-phoneVerify',
  templateUrl: '../../html/components/ft-phoneVerify.html'
})

export class FTPhoneVerify {
  texts=[];
  modalHeight;
  verify_steps = {
    sendCode: 0,
    verifyCode: 1,
    verified: 2
  };
  verify_step = this.verify_steps.sendCode;
  tel1;
  tel2;
  tel3;
  code;

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

  verify(step): void {
    if(step == this.verify_steps.verifyCode) {
      if(this.tel1 && this.tel2 && this.tel3)
        this.callPhone(this.tel1 + this.tel2 + this.tel3); 
    } else if(step == this.verify_steps.verified) {
      this.verifyPhone(this.tel1 + this.tel2 + this.tel3, this.code);
    }
  }

  private callPhone(number):void {
    this.http.post("verifyPhone", this.callPhoneInfoToSend(number)).toPromise()
    .then( data => { 
        data = JSON.parse(data);
        if(data =='Sent_Code')
          this.verify_step = this.verify_steps.verifyCode;
        else if(data == 'AccountExists')
          this.accountExists();
    })
    .catch( err => {console.log(err);});
  }

    private callPhoneInfoToSend(number):string {
        return JSON.stringify({
            "phone" : number,
            "account" : this.session.getItem('account'),
            "token" : this.session.getItem( 'token')
        });
    }

    private verifyPhone(number, code):void {
      this.http.post("verifyPhone", this.verifyPhoneInfoToSend(number, code)).toPromise()
      .then( data => { 
          data = JSON.parse(data);
          if(data.token) {
            this.session.setItem('token', data.token);
            this.FTLocalStorage.setItem('token', data.token);
            this.obs.putObserver('isSignedIn', true);
            if(data.hash){
              this.ftwallet.fundHash(this.ftweb3.keccak256(data.token),"0", '0x' + this.ftNum.getZero(),"0");
              this.ftwallet.buildCollectHashTrans(data.token);
            }
            this.close();
          }
      })
      .catch( err => {console.log(err);});
    }
  
      private verifyPhoneInfoToSend(number, code):string {
          return JSON.stringify({
              "phone" : number,
              "account" : this.session.getItem('account'),
              "token" : this.session.getItem( 'token'),
              "code": code
          });
      }

    private accountExists() {
      this.obs.putObserver('isSignedIn', false);
      this.obs.putObserver('deleteAccount', true);
      this.obs.putObserver('modal', 'verify.PhoneExists');
    }

  private setText(): void {
  }
}
