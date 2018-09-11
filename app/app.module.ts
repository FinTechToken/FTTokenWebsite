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
import { FTMyAccount } from './FTRoutes/FTMyAccount';
import { FTToken } from './FTRoutes/FTToken';

import { FTPhoneVerify } from './FTComponents/ft-phoneVerify';
import { FTPhoneSMS } from './FTComponents/ft-phoneSMS';
import { FTSetAddress } from './FTComponents/ft-setAddress';
import { FTAccountExit } from './FTComponents/ft-account-exit';
import { FTAccountCreate } from './FTComponents/ft-account-create';
import { FTAccountWallet } from './FTComponents/ft-account-wallet';
import { FTAccountWalletActions } from './FTComponents/ft-account-wallet-actions';
import { FTAccountHistory } from './FTComponents/ft-account-history';
import { FTEnterImport } from './FTComponents/ft-enterImport';
import { FTVerifyDelete } from './FTComponents/ft-verifyDelete';
import { FTVerifyPhoneExists } from './FTComponents/ft-verifyPhoneExists';
import { FTTokenInfo } from './FTComponents/ft-tokenInfo';
import { FTExportToken } from './FTComponents/ft-exportToken';
import { FTImportToken } from './FTComponents/ft-importToken';
import { FTSendEther } from './FTComponents/ft-sendEther';
import { FTSendToken } from './FTComponents/ft-sendToken';
import { FTDepositFTT } from './FTComponents/ft-depositFTT';
import { FTWithdrawFTT } from './FTComponents/ft-withdrawFTT';
import { FTReferFriend } from './FTComponents/ft-referFriend';
import { FTTradeBuyToken } from './FTComponents/ft-tradeBuyToken';
import { FTTradeSellToken } from './FTComponents/ft-tradeSellToken';
import { FTTradeTokenBook } from './FTComponents/ft-tradeTokenBook';
import { FTTradeTokenTrades } from './FTComponents/ft-tradeTokenTrades';
import { FTTradeBuyOffers } from './FTComponents/ft-tradeBuyOffers';
import { FTTradeSellOffers } from './FTComponents/ft-tradeSellOffers';

import { FTMessagesOld } from './FTRoutes/FTMessagesOld';

@NgModule({
  imports: [ 
    AppRoutingModule, 
    BrowserModule, 
    FormsModule, 
    HttpModule, 
  ],
  declarations: [
    FTMessagesOld, 

    AppComponent,
    FTHeader,
    FTHome, 
    FTBlockchain,
    FTCryptoPass,
    FTFooter,
    FTModal,
    FTMyAccount, 
    FTToken,
    FTSetAddress,
    FTPhoneVerify,
    FTPhoneSMS,
    FTAccountExit,
    FTAccountCreate,
    FTAccountWallet,
    FTAccountWalletActions,
    FTAccountHistory,
    FTEnterImport,
    FTVerifyDelete,
    FTVerifyPhoneExists,
    FTTokenInfo,
    FTExportToken,
    FTImportToken,
    FTSendEther,
    FTDepositFTT,
    FTWithdrawFTT,
    FTReferFriend,
    FTSendToken,
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
