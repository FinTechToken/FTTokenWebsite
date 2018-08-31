declare var sha256:any;
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
  selector: 'ft-exportToken',
  templateUrl: '../../html/components/ft-exportToken.html'
})

export class FTExportToken {
  texts=[];
  modalHeight;
  tokenIndex;
  exportTokenAmount:string = "0";
  exportAddress;
  gasPrice="0";
  exportAddressStatus;
  private ABIdata;
  ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  ALPHABET_MAP = {}

  constructor( public ftToken: FTTokenWatchService, public ftCrypto: FTCryptoPassService, public ftNum: FTBigNumberService, public ftWallet: FTWalletService, public ftweb3: FTWeb3Service, public ftMarket: FTMarketService, private cache: FTCache, private text: FTText, private obs: FTObserver, private http: FTHttpClient, private session: FTSession, private FTLocalStorage: FTStorage ) 
  { 
    this.setText();
    for(let i = 0; i < this.ALPHABET.length; i++) {
      this.ALPHABET_MAP[this.ALPHABET.charAt(i)] = i
    }
  }
  
  ngOnInit(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
    this.tokenIndex = this.obs.getObserverValue('tokenIndex');
    if(this.obs.getObserverValue('modalNumber')) {
      this.exportTokenAmount = this.obs.getObserverValue('modalNumber');
      this.obs.deleteObserver('modalNumber');
    } else {
      this.exportTokenAmount = this.ftToken.TokenWatch[this.tokenIndex].mine;
    }
    if(this.obs.getObserverValue('exportAddress')) {
      this.exportAddress = this.obs.getObserverValue('exportAddress');
      this.obs.deleteObserver('exportAddress');
    } else {
      this.exportAddress = '';
    }
    this.checkExportGas();
  }

  private exportAddressSetError(msg:string) {
    this.exportAddressStatus='has-danger';
    document.getElementById('exportAddressBad').innerHTML = msg;
  }

  private exportAddressClearError() {
    this.exportAddressStatus='';
    document.getElementById('exportAddressBad').innerHTML = '';
  }

  private checkExportGas() {
    try {
      this.gasPrice='0';
      this.ABIdata = this.ftToken.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).encodeABI();
      this.exportAddressClearError();
      this.ftToken.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
      .then( (gasEstimate) => {
        console.log('working');
        this.gasPrice=gasEstimate;
      })
      .catch(err => {console.log(err.message);});
    } catch(err) { 
      this.exportAddressSetError(err.message);
    }
  }

  exportAddressChange(event) {
    if(this.tokenIndex==1){
      if(this.checkBTC(this.exportAddress))
        this.checkExportGas();
      else {
        this.gasPrice = '0';
        this.exportAddressSetError('Not BitCoin Address');
      }
    } else if(this.tokenIndex==0)
      this.checkExportGas();
  }

  changeExportToken(){
    this.cache.putCache('number', this.exportTokenAmount);
    this.cache.putCache('maxNumber', this.ftToken.TokenWatch[this.tokenIndex].mine);
    this.obs.putObserver('exportAddress',this.exportAddress);
    this.obs.putObserver('modal','pickNumber');
  }

  exportTokenConfirm(){
    this.ABIdata = this.ftToken.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).encodeABI();
    this.ftToken.TokenWatch[this.tokenIndex].contract.methods.export(this.exportAddress, this.exportTokenAmount ).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
    .then( (gasEstimate) => {
      this.gasPrice=gasEstimate;
      this.ftweb3.signAndSendTrans(gasEstimate, this.ftToken.TokenWatch[this.tokenIndex].address.slice(2), '0', this.ABIdata)
      .then(data=> {
        this.close();
      })
      .catch(err=> console.log(err));
    });
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  private setText(): void {
  }

  checkBTC(address) {
    try{
      var decoded = this.a2hex(this.base58_decode(address));
    } catch {
      return false;
    }
    if (decoded.length != 50) return false;
    var cksum = decoded.toString().substr(decoded.length - 8); 
    var rest = decoded.toString().substr(0, decoded.length - 8);  
    var sha1 = sha256(Buffer.from(rest,"hex"));
    var sha2 = sha256(Buffer.from(sha1,"hex"));
    var good_cksum = sha2.substr(0,8);
    if (cksum != good_cksum) return false;
    return true;
  }

  private base58_decode(string) {
  // from https://github.com/cryptocoinjs/bs58
  // Base58 encoding/decoding
  // Originally written by Mike Hearn for BitcoinJ
  // Copyright (c) 2011 Google Inc
  // Ported to JavaScript by Stefan Thomas
  // Merged Buffer refactorings from base58-native by Stephen Pair
  // Copyright (c) 2013 BitPay Inc
    var BASE = 58;
    if (string.length === 0) return []
    var i, j, bytes = [0]
    for (i = 0; i < string.length; i++) {
      var c = string[i]
      if (!(c in this.ALPHABET_MAP)) throw new Error('Non-base58 character')
      for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
      bytes[0] += this.ALPHABET_MAP[c]
      var carry = 0
      for (j = 0; j < bytes.length; ++j) {
        bytes[j] += carry
        carry = bytes[j] >> 8
        bytes[j] &= 0xff
      }
      while (carry) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }
    // deal with leading zeros
    for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)
    bytes = bytes.reverse()
    let output = '';
    for (i=0; i<bytes.length; i++) {
        output += String.fromCharCode(bytes[i]);
    }
    return output;
  }

  private hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }

  private a2hex(str) {
    var aHex = "0123456789abcdef";
    var l = str.length;
    var nBuf;
    var strBuf;
    var strOut = "";
    for (var i = 0; i < l; i++) {
      nBuf = str.charCodeAt(i);
      strBuf = aHex[Math.floor(nBuf/16)];
      strBuf += aHex[nBuf % 16];
      strOut += strBuf;
    }
    return strOut;
  }
}
