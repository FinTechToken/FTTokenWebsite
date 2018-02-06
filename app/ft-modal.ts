import { Component, OnInit } from '@angular/core';

import { FTObserver } from './FTFramework/FT-Observer';
import { FTText } from './FTFramework/FT-Text';

@Component({
  moduleId: module.id,
  selector: 'ft-modal',
  templateUrl: '../html/modal.html'
})

export class FTModal {
  texts=[];
  modal = 0;

  constructor( private text: FTText, private obs: FTObserver ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
    this.obs.getObserver('modal')
    .forEach( (modal) => {
      this.modal = modal;
      this.showModal();
    });
  } 
  
  showModal(): void {
    let els = document.getElementsByClassName("modal-body");
    let x=(window.innerHeight-1)*1-100;
    for(let i = 0; i < els.length; i++)
    {
        let el:HTMLElement = els[i] as HTMLElement;
        el.style.height=x*.75+'px';
    }
  }

  close(): void {
    this.obs.putObserver('modal',0);
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
