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
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Component({
  moduleId: module.id,
  selector: 'ft-sendToken',
  templateUrl: '../../html/components/ft-sendToken.html'
})

export class FTSendToken {
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
  tokenIndex;
  sendAmount="0";
  etherFee="100000000000000000";

  constructor( public ftToken: FTTokenWatchService, public ftNum: FTBigNumberService, public ftweb3: FTWeb3Service, private ftwallet: FTWalletService, private cache: FTCache, private text: FTText, 
    private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
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
    this.cache.putCache('maxNumber', this.ftToken.TokenWatch[this.tokenIndex].mine);
    this.obs.putObserver('modal','pickNumber');
  }

  sendToken() {
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
        var ABIdata = this.ftToken.TokenWatch[this.tokenIndex].contract.methods.approve('0x' + this.ftwallet.HashCollect.address, this.sendAmount).encodeABI();
        this.ftToken.TokenWatch[this.tokenIndex].contract.methods.approve('0x' + this.ftwallet.HashCollect.address, this.sendAmount).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.ftweb3.signAndSendTrans(gasEstimate, this.ftToken.TokenWatch[this.tokenIndex].address.substring(2), "0", ABIdata)
          .then(sent => {
            this.ftwallet.fundHash(JSON.parse(data),this.etherFee,this.ftToken.TokenWatch[this.tokenIndex].address, this.sendAmount);
            this.send_step = this.send_steps.success;
            return;
          })
          .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
      })
      .catch(err => null);
    } else {
      console.log('Must Enter Phone Number');
    }
  }

  private setText(): void {
  }
}
