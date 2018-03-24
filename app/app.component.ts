import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, HostListener } from '@angular/core';

import { FTText } from './FTFramework/FT-Text';
import { FTWeb3Service } from './FTServices/ft-web3';
import { FTCryptoPassService } from './FTServices/ft-cryptoPass';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: '../html/app.component.html',
})

export class AppComponent {
  zone: NgZone;   
  name = 'FTTokenWebsite';

  constructor( private FTweb3: FTWeb3Service, private FTCryptoPass: FTCryptoPassService ) 
  {   
    // Zone used for old version of IPad. Doesn't update without it.
    this.zone = new NgZone( { enableLongStackTrace : false } );
  }
  
  ngOnInit(): void {
    this.FTweb3.initializeWeb3();
    this.FTCryptoPass.initializeCryptoPass();
  }    

  ngAfterViewInit(): void{} 
  
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
      this.onDestroyApp();
  }

  ngOnDestroy(): void{ 
    this.onDestroyApp();
  }

  private onDestroyApp(): void {
    this.FTCryptoPass.destroyCryptoPass();
  }
}
