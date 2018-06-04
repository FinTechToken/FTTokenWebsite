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
import { FTBigNumberService } from './FTServices/ft-bigNumber';
import { FTCryptoPassService } from './FTServices/ft-cryptoPass';
import { FTWalletService } from './FTServices/ft-wallet';
import { FTMarketService } from './FTServices/ft-market';
import { FTTokenWatchService } from './FTServices/ft-tokenWatch';

import { FTBlockchain } from './FTRoutes/FTBlockchain';
import { FTCryptoPass } from './FTRoutes/FTCryptoPass';
import { FTHome } from './FTRoutes/FThome';
import { FTMessages } from './FTRoutes/FTMessages';
import { FTMyAccount } from './FTRoutes/FTMyAccount';
import { FTToken } from './FTRoutes/FTToken';

import { FTPhoneVerify } from './FTComponents/ft-phoneVerify';
import { FTPhoneSMS } from './FTComponents/ft-phoneSMS';
import { FTAccountExit } from './FTComponents/ft-account-exit';
import { FTAccountCreate } from './FTComponents/ft-account-create';
import { FTAccountWallet } from './FTComponents/ft-account-wallet';
import { FTAccountTrade } from './FTComponents/ft-account-trade';
import { FTEnterImport } from './FTComponents/ft-enterImport';
import { FTVerifyDelete } from './FTComponents/ft-verifyDelete';
import { FTVerifyPhoneExists } from './FTComponents/ft-verifyPhoneExists';
import { FTSignUpInfo } from './FTComponents/ft-signUpInfo';
import { FTDepositEtherToTrade } from './FTComponents/ft-depositEtherToTrade';
import { FTWithdrawEtherFromTrade } from './FTComponents/ft-withdrawEtherFromTrade';
import { FTDepositTokenToTrade } from './FTComponents/ft-depositTokenToTrade';
import { FTWithdrawTokenFromTrade } from './FTComponents/ft-withdrawTokenFromTrade';
import { FTTradeBuyToken } from './FTComponents/ft-tradeBuyToken';
import { FTTradeSellToken } from './FTComponents/ft-tradeSellToken';
import { FTTradeTokenBook } from './FTComponents/ft-tradeTokenBook';
import { FTTradeTokenTrades } from './FTComponents/ft-tradeTokenTrades';
import { FTTradeBuyOffers } from './FTComponents/ft-tradeBuyOffers';
import { FTTradeSellOffers } from './FTComponents/ft-tradeSellOffers';

import { FTMyAccountOld } from './FTRoutes/FTMyAccountOld';

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
    FTBlockchain,
    FTCryptoPass,
    FTFooter,
    FTMessages, 
    FTModal,
    FTMyAccount, 
    FTMyAccountOld,
    FTToken,
    FTPhoneVerify,
    FTPhoneSMS,
    FTAccountExit,
    FTAccountCreate,
    FTAccountWallet,
    FTAccountTrade,
    FTEnterImport,
    FTVerifyDelete,
    FTVerifyPhoneExists,
    FTSignUpInfo,
    FTDepositEtherToTrade,
    FTWithdrawEtherFromTrade,
    FTDepositTokenToTrade,
    FTWithdrawTokenFromTrade,
    FTTradeBuyToken,
    FTTradeSellToken,
    FTTradeTokenBook,
    FTTradeTokenTrades,
    FTTradeBuyOffers,
    FTTradeSellOffers
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
    FTBigNumberService,
    FTCryptoPassService,
    FTWalletService,
    FTMarketService,
    FTTokenWatchService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
