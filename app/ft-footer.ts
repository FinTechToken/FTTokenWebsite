import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FTCache } from './FTFramework/FT-Cache';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTText } from './FTFramework/FT-Text';

@Component({
  moduleId: module.id,
  selector: 'ft-footer',
  templateUrl: '../html/footer.html'
})

export class FTFooter {
  blocknumber = 0;
  seconds = 0;
  texts=[];

  constructor( private cache: FTCache, private obs: FTObserver, private router: Router, private text: FTText ) 
  { 
    this.setText();
  }
  
  ngOnInit(): void {
  }    

  ngAfterViewInit(): void { } 

  ngOnDestroy(): void {}

  private setText(): void {
    this.texts['footer.Code'] = this.text.getText('footer.Code');
    this.texts['footer.Community'] = this.text.getText('footer.Community');
    this.texts['footer.CodeSmall'] = this.text.getText('footer.CodeSmall');
    this.texts['footer.CommunitySmall'] = this.text.getText('footer.CommunitySmall');

    this.texts['footer.CodeLink'] = this.text.getText('footer.CodeLink');
    this.texts['footer.CommunityLink'] = this.text.getText('footer.CommunityLink');
  }
}
