import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FTCache } from './FTFramework/FT-Cache';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTText } from './FTFramework/FT-Text';

@Component({
  moduleId: module.id,
  selector: 'ft-header',
  templateUrl: '../html/header.html'
})

export class FTHeader {
  blocknumber = 0;
  seconds = 0;
  texts=[];
  over=false;
  isSignedIn:boolean=false;
  isPreviousUser:boolean=false;

  constructor( private obs: FTObserver, private router: Router, private text: FTText ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.obs.getObserver('block')
    .forEach( (bn) => {
      this.blocknumber = bn;
    });
    
    this.obs.getObserver('blockSeconds')
    .forEach( (localseconds) => {
      this.seconds = localseconds;
    });

    this.obs.getObserver('isSignedIn')
    .forEach( (isSI) => {
      this.isSignedIn = isSI;
    });

    this.obs.getObserver('isPreviousUser')
    .forEach( (isPre) => {
      this.isPreviousUser = isPre;
    });
  }    

  private setText(): void {
    this.texts['header.FTTBlockName'] = this.text.getText('header.FTTBlockName');
    this.texts['header.accountName'] = this.text.getText('header.accountName');
    this.texts['header.messagesName'] = this.text.getText('header.messagesName');
    this.texts['header.accountOut'] = this.text.getText('header.accountOut');
    this.texts['header.accountNewUser'] = this.text.getText('header.accountNewUser');
    this.texts['header.accountIn'] = this.text.getText('header.accountIn');
  }
}
