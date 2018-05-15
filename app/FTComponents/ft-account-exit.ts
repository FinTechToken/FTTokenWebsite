import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTObserver } from '../FTFramework/FT-Observer';

@Component({
  moduleId: module.id,
  selector: 'ft-accountExit',
  templateUrl: '../../html/components/ft-accountExit.html'
})

export class FTAccountExit {

  constructor( private router:Router, private obs: FTObserver ) 
  {}
  
  ngOnInit(): void {} 
  
  signOut(): void {
    this.obs.putObserver('isSignedIn', false);
    this.router.navigate(['/crypto_pass']);
  }

}
