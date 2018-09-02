import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
import { FTSession } from '../FTFramework/FT-Session';
import { FTStorage } from '../FTFramework/FT-Storage';
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

  HashCollect = {
    address: '5dA0448e07bD2fC17115b006dbA3A26D130e139b',
    abi:[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newTransactionFixedFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function","signature":"0x123fcde6"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"sendAmount","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function","signature":"0x2b592622"},{"constant":true,"inputs":[],"name":"transactionFixedFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x47fca313"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x62a5af3b"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"getOwnerBalance","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7fcf440a"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9ed3edf0"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa6f9dae1"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getNeverCached","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb2caffe5"},{"constant":false,"inputs":[{"name":"_hashKey","type":"string"}],"name":"getAmount","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe35cf0ca"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf5fccae2"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mHash","type":"bytes32"},{"indexed":true,"name":"mToken","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"HashSent","type":"event","signature":"0xa595818c9d4b46ea72fbf14cb1e6573fcb7eb0722abbb9e16736b461dffb80cd"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mHash","type":"bytes32"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"HashCached","type":"event","signature":"0x99840862eecd61b78ec947ae70419d187baf3c6f89f0bfb5c311b5f0fccaf3cf"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mHash","type":"bytes32"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"HashNeverCached","type":"event","signature":"0xe72702c36317763472847b2ffc1757bd0ffaab814be916bdcf71197aadcc3cfc"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mTransFlatFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event","signature":"0xe422d31ad0a7139b58a00a7ad71cefc619bdf5e99c4698efc980d2414ab0e620"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event","signature":"0x4acad4a82756afd37e2d2e935cd96aa2d8c97634700f991592f3b977d6dc7d80"}],
    contract:{} as any,
    estimate:"0",
    receipt:null,
    transaction:'',
    confirmed:0,
    error:'',
    serializedTx:null
  };

  constructor( private ftNum: FTBigNumberService, private ftweb3: FTWeb3Service, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
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
              this.HashCollect.contract = this.ftweb3.createContractInterface(this.HashCollect.abi, "0x" + this.HashCollect.address);
              this.buildFundHashAndSend(data.token);
            }
            this.close();
          }
      })
      .catch( err => {console.log(err);});
    }

    private buildFundHashAndSend(hash) {
      let hashed = this.ftweb3.keccak256(hash);
      var ABIdata = this.HashCollect.contract.methods.sendAmount(hashed,  '0x' + this.ftNum.getZero(),"0").encodeABI();
      this.HashCollect.contract.methods.sendAmount(hashed,  '0x' + this.ftNum.getZero(),"0").estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
      .then( (gasEstimate) => {
        this.ftweb3.signAndSendTrans(gasEstimate, this.HashCollect.address, "0", ABIdata)
        .then(data => {
          this.buildCollectHashTrans(hash);
        })
        .catch(err => console.log(err));
        });
    }

    private buildCollectHashTrans( hashToCollect) {
      var ABIdata = this.HashCollect.contract.methods.getAmount(hashToCollect ).encodeABI();
      this.HashCollect.contract.methods.getAmount(hashToCollect).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
      .then( (gasEstimate) => {
        this.ftweb3.signAndSendTrans(gasEstimate, this.HashCollect.address, "0", ABIdata)
        .then(data => {
          return;
        })
        .catch(err => console.log(err));
        });
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
