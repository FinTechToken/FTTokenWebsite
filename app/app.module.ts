import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FTHeader } from './ft-header';
import { FTFooter } from './ft-footer';
import { FTModal } from './ft-modal';

import { FTCache } from './FTFramework/FT-Cache';
import { FTHttpClient } from './FTFramework/FT-HttpClient';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTSession } from './FTFramework/FT-Session';
import { FTStorage } from './FTFramework/FT-Storage';
import { FTText } from './FTFramework/FT-Text';

import { FTWeb3Service } from './FTServices/ft-web3';
import { FTCryptoPassService } from './FTServices/ft-cryptoPass';

import { FTAuthenticate } from './FTRoutes/FTAuthenticate';
import { FTBlockchain } from './FTRoutes/FTBlockchain';
import { FTCryptoPass } from './FTRoutes/FTCryptoPass';
import { FTHome } from './FTRoutes/FThome';
import { FTMessages } from './FTRoutes/FTMessages';
import { FTMyAccount } from './FTRoutes/FTMyAccount';
import { FTToken } from './FTRoutes/FTToken';

@NgModule({
  imports: [ 
    AppRoutingModule, 
    BrowserModule, 
    FormsModule, 
    HttpModule, 
  ],
  declarations: [
    AppComponent,
    FTHeader,
    FTHome, 
    FTAuthenticate, 
    FTBlockchain,
    FTCryptoPass,
    FTFooter,
    FTMessages, 
    FTModal,
    FTMyAccount, 
    FTToken
  ],
  entryComponents: [ ],
  providers: [ 
    FTCache, 
    FTHttpClient, 
    FTObserver, 
    FTSession,
    FTStorage,
    FTText,
    FTWeb3Service,
    FTCryptoPassService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
