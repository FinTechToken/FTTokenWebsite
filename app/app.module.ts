//ToDo: Calculate REM to PX conversions. Figure it out on load and store it.
import { NgModule } from '@angular/core'; 

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';

import { FTHttpClient } from './FTFramework/FT-HttpClient';
import { FTSession } from './FTFramework/FT-Session';
import { FTBus } from './FTFramework/FT-Bus';
import { FTCache } from './FTFramework/FT-Cache';
import { FTObserver } from './FTFramework/FT-Observer';
import { FTResolve } from './FTFramework/FT-Resolve';

import { FTHome } from './FTComponents/FThome';
import { FTTokenMarket } from './FTComponents/FTTokenMarket';
import { FTMarket } from './FTComponents/FTMarket';
import { FTStory } from './FTComponents/FTStory';
import { FTContact } from './FTComponents/FTcontact';
import { FTAuthenticate } from './FTComponents/FTAuthenticate';
import { FTTestNet } from './FTComponents/FTTestNet';
import { FTBlockchain } from './FTComponents/FTBlockchain';
import { FTAccount } from './FTComponents/FTAccount';
import { FTMyAccount } from './FTComponents/FTMyAccount';
import { FTAlerts } from './FTComponents/FTAlerts';
import { FTToken } from './FTComponents/FTToken';
import { FTTradeToken } from './FTComponents/FTTradeToken';
import { FTInvestCrypto } from './FTComponents/FTInvestCrypto';
import { FTAboutFTT } from './FTComponents/FTAboutFTT';

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule,
    AppRoutingModule ],
  declarations: [
    AppComponent,
    FTHome, FTTokenMarket, FTStory, FTContact, FTMarket, FTAuthenticate, FTTestNet, FTBlockchain,
    FTAccount, FTAlerts, FTMyAccount, FTToken, FTTradeToken, FTInvestCrypto, FTAboutFTT
  ],
  entryComponents: [ ],
  providers: [ FTHttpClient, FTSession, FTBus, FTCache, FTObserver, FTResolve],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
