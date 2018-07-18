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
  selector: 'ft-setAddress',
  templateUrl: '../../html/components/ft-setAddress.html'
})

export class FTSetAddress {
  texts=[];
  modalHeight;
  phone_steps = {
    enter: 0,
    submitted: 1
  };
  phone_step = this.phone_steps.enter;
  myAddress;
  myName;

  constructor( private cache: FTCache, private ftCrypto: FTCryptoPassService, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    if(this.ftCrypto.homeAddress != "" && this.ftCrypto.name != "" )
        this.obs.putObserver('modal', '');
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
  } 
  
  close(): void {
    this.obs.putObserver('modal','');
  }

  submitInfo(): void {
    let token = this.session.getItem('token');
    let account = this.session.getItem('account');
    if(this.myAddress && this.myName)
      this.http.put("hashSend", JSON.stringify({
        "token" : token,
        "account": account,
        "homeAddress": this.myAddress,
        "name": this.myName
        })).toPromise()
      .then( data => {
        if(JSON.parse(data) == "Inserted") {
          this.ftCrypto.homeAddress = this.myAddress;
          this.ftCrypto.name = this.myName;
          this.phone_step = this.phone_steps.submitted;
        } else
          console.log(data);
      })
      .catch(err => console.log(err));
    else 
      console.log('Enter Info');
  }

  private setText(): void {
  }
}
