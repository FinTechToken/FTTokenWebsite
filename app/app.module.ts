import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FTHeader } from './ft-header';
import { FTFooter } from './ft-footer';

import { FTCache } from './FTFramework/FT-Cache';
import { FTHttpClient } from './FTFramework/FT-HttpClient';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTSession } from './FTFramework/FT-Session';
import { FTStorage } from './FTFramework/FT-Storage';
import { FTText } from './FTFramework/FT-Text';

import { FTWeb3 } from './FTServices/ft-web3';

import { FTAuthenticate } from './FTRoutes/FTAuthenticate';
import { FTBlockchain } from './FTRoutes/FTBlockchain';
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
    FTFooter,
    FTMessages, 
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
    FTWeb3
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
