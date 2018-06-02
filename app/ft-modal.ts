import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { ReplaySubject } from 'rxjs';

import { FTCache } from './FTFramework/FT-Cache';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTText } from './FTFramework/FT-Text';

import { FTBigNumberService } from './FTServices/ft-bigNumber';
import { FTWeb3Service } from './FTServices/ft-web3';

@Component({
  moduleId: module.id,
  selector: 'ft-modal',
  templateUrl: '../html/modal.html'
})

export class FTModal {
  texts=[];
  prevModal='';
  modal='';
  modalHeight;
  number="0";
  maxNumber="0";

  constructor( private ftweb3: FTWeb3Service, private ftNum: FTBigNumberService, private cache: FTCache, private text: FTText, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.obs.getObserver('modal')
    .forEach( (modal) => {
      this.prevModal=this.modal;
      this.modal = modal;
      if(modal=='showNumber' || modal=='pickNumber' || modal=='pickNumberSmall'){
        this.number = this.cache.getCache('number');
      }
      if(modal=='pickNumber' || modal=='pickNumberSmall') {
        this.maxNumber = this.cache.getCache('maxNumber');
      }
      this.showModal();
    });
  } 
  
  showModal(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
  }

  close(): void {
    if(this.modal=='pickNumber' || this.modal=='pickNumberSmall')
      this.obs.putObserver('modalNumber', this.number);
    this.obs.putObserver('modal',this.prevModal);
  }

  private setText(): void {
    this.texts['footer.Code'] = this.text.getText('footer.Code');
    this.texts['footer.Community'] = this.text.getText('footer.Community');
    this.texts['footer.CodeSmall'] = this.text.getText('footer.CodeSmall');
    this.texts['footer.CommunitySmall'] = this.text.getText('footer.CommunitySmall');

    this.texts['footer.CodeLink'] = this.text.getText('footer.CodeLink');
    this.texts['footer.CommunityLink'] = this.text.getText('footer.CommunityLink');
  }


  private updateModalNumber(): void {
    let newNum = (document.getElementById('modalNumberEther') as HTMLFormElement).value;
    if( +newNum >= 0 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.ftNum.getEther(this.number);
      return;
    }
    let oldNumber = this.number;
    if( +newNum != this.ftNum.getEther(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getEther(this.number).toString(),"1000000000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalNumberFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.number);
      return;
    }
    if( +newNum != this.ftNum.getFinney(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getFinney(this.number).toString(),"1000000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalNumberSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.number);
      return;
    }
    if( +newNum != this.ftNum.getSzabo(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getSzabo(this.number).toString(),"1000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000"));
    }
    newNum = (document.getElementById('modalNumberGwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.ftNum.getGwei(this.number);
      return;
    }
    if( +newNum != this.ftNum.getGwei(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getGwei(this.number).toString(),"1000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000"));
    }
    newNum = (document.getElementById('modalNumberMwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.ftNum.getMwei(this.number);
      return;
    }
    if( +newNum != this.ftNum.getMwei(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getMwei(this.number).toString(),"1000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000"));
    }
    newNum = (document.getElementById('modalNumberKwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.ftNum.getKwei(this.number);
      return;
    }
    if( +newNum != this.ftNum.getKwei(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getKwei(this.number).toString(),"1000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000"));
    }
    newNum = (document.getElementById('modalNumberWei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.ftNum.getWei(this.number);
      return;
    }
    if( +newNum != this.ftNum.getWei(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.getWei(this.number).toString());
      this.number = this.ftNum.addBigNumber(this.number, newNum);
    }
    if(this.maxNumber != "0") {
      if(this.ftNum.compareBigNumber(this.number, this.maxNumber)==1){
        this.number = oldNumber;
        (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.ftNum.getEther(this.number);
        (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.number);
        (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.number);
        (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.ftNum.getGwei(this.number);
        (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.ftNum.getMwei(this.number);
        (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.ftNum.getKwei(this.number);
        (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.ftNum.getWei(this.number);
      }
    }
  }

  private updateModalPrice(): void {
    let newNum = (document.getElementById('modalPriceEther') as HTMLFormElement).value;
    if( +newNum >= 0 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.ftNum.getEther(this.number);
      return;
    }
    let oldNumber = this.number;
    if( +newNum != this.ftNum.getEther(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getEther(this.number).toString(),"1000000000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalPriceFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.number);
      return;
    }
    if( +newNum != this.ftNum.getFinney(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getFinney(this.number).toString(),"1000000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalPriceSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.number);
      return;
    }
    if( +newNum != this.ftNum.getSzabo(this.number)) {
      this.number = this.ftNum.subtractBigNumber(this.number, this.ftNum.multiplyBigNumber(this.ftNum.getSzabo(this.number).toString(),"1000000000000"));
      this.number = this.ftNum.addBigNumber(this.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000"));
    }
    if(this.maxNumber != "0") {
      if(this.ftNum.compareBigNumber(this.number, this.maxNumber)==1){
        this.number = oldNumber;
        (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.ftNum.getEther(this.number);
        (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.number);
        (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.number);
      }
    }
  }

}
