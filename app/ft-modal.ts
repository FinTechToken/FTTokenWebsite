import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

import { FTCache } from './FTFramework/FT-Cache';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTText } from './FTFramework/FT-Text';

@Component({
  moduleId: module.id,
  selector: 'ft-modal',
  templateUrl: '../html/modal.html'
})

export class FTModal {
  texts=[];
  modal='';
  modalHeight;

  authenticate ={unlocked:''};

  constructor( private cache: FTCache, private text: FTText, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.obs.getObserver('modal')
    .forEach( (modal) => {
      this.modal = modal;
      if(modal='authenticate.unlocked'){
        this.authenticate.unlocked = JSON.stringify(this.cache.getCache('encrypted_id'));
      }
      this.showModal();
    });
  } 
  
  showModal(): void {
    this.modalHeight=((window.innerHeight-1)*1-100)*.8+'px';
  }

  close(): void {
    this.obs.putObserver('modal','');
  }

  deleteAccount(): void{
    this.obs.putObserver('deleteAccount', true);
  }

  private setText(): void {
    this.texts['footer.Code'] = this.text.getText('footer.Code');
    this.texts['footer.Community'] = this.text.getText('footer.Community');
    this.texts['footer.CodeSmall'] = this.text.getText('footer.CodeSmall');
    this.texts['footer.CommunitySmall'] = this.text.getText('footer.CommunitySmall');

    this.texts['footer.CodeLink'] = this.text.getText('footer.CodeLink');
    this.texts['footer.CommunityLink'] = this.text.getText('footer.CommunityLink');
  }
}
