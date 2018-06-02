import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-my-account',
  templateUrl: '../../html/routes/myaccount.html',
})

export class FTMyAccount {
  tabs = 1;
  fromAddress = '0x';
   
  constructor( private router: Router, private cache: FTCache ) {}

  ngOnInit(): void{
    if(!this.cache.getCache('key')){
      this.router.navigate(['/crypto_pass']);
    }

    this.fromAddress = this.cache.getCache('encrypted_id') ? this.cache.getCache('encrypted_id').address : this.fromAddress;
  }    

  ngAfterViewInit(): void{} 

  ngOnDestroy(): void{}

  changeTabs(tab:number): void {
    this.tabs = tab;
  }

}