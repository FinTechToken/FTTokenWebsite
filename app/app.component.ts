declare var sjcl: any;

import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { FTCache } from './FTFramework/FT-Cache';
import { FTStorage } from './FTFramework/FT-Storage';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTSession } from './FTFramework/FT-Session';
import { FTText } from './FTFramework/FT-Text';
import { FTWeb3 } from './FTServices/ft-web3';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: '../html/app.component.html',
})

export class AppComponent {
  zone: NgZone;   
  name = 'FTTokenWebsite';

  constructor( private cache: FTCache, private FTweb3: FTWeb3, private FTlocalStorage:FTStorage, private session:FTSession, private observer:FTObserver ) 
  {   
    // Zone used for old version of IPad. Doesn't update without it.
    this.zone = new NgZone( { enableLongStackTrace : false } );
  }
  
  ngOnInit(): void {
    this.FTweb3.initializeWeb3();
    
    if(this.FTlocalStorage.hasItem('encrypted_id')){
      this.cache.putCache('encrypted_id', JSON.parse(this.FTlocalStorage.getItem('encrypted_id')));
      this.observer.putObserver('isPreviousUser', true);
      //ToDo: remove
      if(this.session.hasItem('k')) {
        this.cache.putCache('key', sjcl.decrypt(this.cache.getCache('encrypted_id').address, this.session.getItem('k')));
        this.observer.putObserver('isSignedIn', true);
      }
    }
  }    

  ngAfterViewInit(): void{} 
  
  ngOnDestroy(): void{ 
    this.cache.deleteCache('key'); 
    this.observer.deleteObserver('isSignedIn');
    this.observer.deleteObserver('isPreviousUser');
  }

}
