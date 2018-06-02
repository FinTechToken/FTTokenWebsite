import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
import { FTSession } from '../FTFramework/FT-Session';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';

import { FTCryptoPassService } from '../FTServices/ft-cryptoPass';

@Component({
  moduleId: module.id,
  selector: 'ft-phoneSMS',
  templateUrl: '../../html/components/ft-phoneSMS.html'
})

export class FTPhoneSMS {
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
  pwUnlockGroupStatus;

  constructor( private cache: FTCache, private cryptoPassService: FTCryptoPassService, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
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
    this.http.put("SMSToken", this.callPhoneInfoToSend(number)).toPromise()
    .then( data => { 
        data = JSON.parse(data);
        if(data =='Sent_Code')
          this.verify_step = this.verify_steps.verifyCode;
    })
    .catch( err => {console.log(err);});
  }

    private callPhoneInfoToSend(number):string {
        return JSON.stringify({
            "phone" : number
        });
    }

    private verifyPhone(number, code):void {
      this.http.put("SMSToken", this.verifyPhoneInfoToSend(number, code)).toPromise()
      .then( data => { 
          data = JSON.parse(data);
          if(data.account && data.token) {
            this.pwUnlockGroupStatus = 'has-success';
            this.session.setItem('account', data.account);
            this.FTLocalStorage.setItem('account', data.account);
            this.cryptoPassService.sendToken(data.token, data.account);
            this.close();
          } else {
            this.pwUnlockGroupStatus = 'has-danger';
          }
      })
      .catch( err => {console.log(err);});
    }
  
      private verifyPhoneInfoToSend(number, code):string {
          return JSON.stringify({
              "phone" : number,
              "code": code
          });
      }

  private setText(): void {
  }
}
