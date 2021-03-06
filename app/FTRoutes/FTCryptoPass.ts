declare var sjcl: any;
declare var onResize: any;
import { AfterViewInit, Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observer, BehaviorSubject } from 'rxjs';

import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTText } from '../FTFramework/FT-Text';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTCryptoPassService } from '../FTServices/ft-cryptoPass';

@Component({
  moduleId: module.id,
  selector: 'ft-cryptopass',
  templateUrl: '../../html/routes/cryptopass.html'
})

export class FTCryptoPass {
  zone: NgZone;   
  texts = [];
  processing = false;
  pwGroupStatus = '';
  pwUnlockGroupStatus = '';
  AuthenticateTabs = {
        getStarted:0,
        signIn:0,
        import:2,
        clear:3
    };
    ImportList = {
        list:0,
        import:1,
        phone:2,
        email:3
    };
    importCryptoList = this.ImportList.list;
  tabs = this.AuthenticateTabs.getStarted;

  constructor( private http:FTHttpClient, private cryptoPassService: FTCryptoPassService, private obs: FTObserver, private router: Router, private session: FTSession, private cache: FTCache, private FTlocalStorage:FTStorage, private web3:FTWeb3Service,  private text: FTText )
  {   
    this.setText();
    this.zone = new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  ngOnInit(): void { 
    if(this.obs.getObserverValue('isSignedIn')) {
        this.router.navigate(['/myaccount']);
    }

    if(this.obs.getObserverValue('isPreviousUser')){
        this.tabs=this.AuthenticateTabs.signIn;
    } else {
        this.tabs=this.AuthenticateTabs.getStarted;
    }
    onResize();
  }    

  ngAfterViewInit(): void{} 

  ngOnDestroy(): void{
  }

  isPreviousUser() {
      return this.obs.getObserverValue('isPreviousUser');
  }

  getRememberedAddress() {
      return this.cache.getCache('encrypted_id').address;
  }

  createAccount(): void {
    if( !this.processing ) {
        this.processing = true;
        this.createAccountSetFieldsOnSubmit();
        let pw = (document.getElementById('PW') as HTMLInputElement).value;
        let pwc = (document.getElementById('PWc') as HTMLInputElement).value;
        if(!pw) {
            this.createAccountSetError('Enter password');
        } else if(pw != pwc){
            this.createAccountSetError('Password needs to match');
        } else {
            setTimeout(()=> {
                this.createAccountNow(pw);
            },50);
        }
    }
  }

  private createAccountSetFieldsOnSubmit() {
    this.pwGroupStatus = '';
    document.getElementById('createbad').innerHTML = '';
    document.getElementById('launch').innerHTML = 'Encrypting - Wait';
  }

  private createAccountSetError(msg:string) {
    this.pwGroupStatus='has-danger';
    document.getElementById('createbad').innerHTML = msg;
    this.createAccountResetFeilds();
    this.processing = false;
  }

  private createAccountNow(pw:string){
    this.pwGroupStatus='has-success';
    let privateKey = this.web3.getNewAccount().privateKey;
    let encrypted_id = this.web3.getEncryptedId(privateKey, pw);
    this.cache.putCache('encrypted_id', encrypted_id);
    this.session.setItem( 'account', encrypted_id.address );
    this.FTlocalStorage.setItem('account', this.cache.getCache('encrypted_id').address);
    this.cache.putCache('key', privateKey);
    this.obs.putObserver('isSignedIn', true);
    this.obs.putObserver('isPreviousUser', true);
    this.putCryptoPass(pw);
    this.createAccountResetFeilds();
    this.obs.putObserver('modal', 'authenticate.unlocked');
    this.processing = false;
  }

  private putCryptoPass(pw) {
    this.http.post("createAccount", this.getAccountInfoToSend(pw)).toPromise()
    .then( data => { 
        this.session.setItem( 'token', JSON.parse(data) );
        this.FTlocalStorage.setItem('token', JSON.parse(data) );
        this.router.navigate(['/myaccount']);
    })
    .catch( err => {console.log(err);});
  }

  private getAccountInfoToSend(pw) {
    return JSON.stringify({
        "account" : this.cache.getCache('encrypted_id').address,
        "privateKey" : this.cache.getCache('key'),
        "phrase" : pw,
        "enc_id" : this.cache.getCache('encrypted_id')});
  }

  private createAccountResetFeilds() {
    (document.getElementById('PW') as HTMLInputElement).value = null;
    (document.getElementById('PWc') as HTMLInputElement).value = null;
    document.getElementById('launch').innerHTML = 'Create CryptoPass';
  }

  unlockAccount(): void{
    if( !this.processing ) {
        this.processing = true;
        this.unlockSetFieldsOnSubmit();
        let pw = (document.getElementById('PWUnlock') as HTMLInputElement).value;
        if(!pw) {
            this.unlockAccountSetError('Enter passphrase to unlock CryptoPass. It\'s usually 3 to 5 random words');
        } else {
            setTimeout(()=> {
                this.unlockAccountNow(pw);
            },50);
        }
    }
}

private unlockSetFieldsOnSubmit() {
    this.pwUnlockGroupStatus = '';
    document.getElementById('unlockbad').innerHTML = '';
    document.getElementById('unlockButton').innerHTML = 'Decrypting - Wait';
}

private unlockAccountSetError(msg:string) {
    this.pwUnlockGroupStatus='has-danger';
    document.getElementById('unlockbad').innerHTML = msg;
    this.unlockResetFeilds();
    this.processing = false;
}

private unlockResetFeilds() {
    (document.getElementById('PWUnlock') as HTMLInputElement).value = null;
    document.getElementById('unlockButton').innerHTML = 'Unlock CryptoPass';
}

private unlockAccountNow(pw:string){
    try{
        let key = this.web3.decryptPrivateKey(JSON.stringify(this.cache.getCache('encrypted_id')),pw);
        this.cache.putCache('key',key);
        this.pwUnlockGroupStatus = 'has-success';
        this.unlockResetFeilds();
        document.getElementById('unlockbad').innerHTML = '';
        this.cryptoPassService.unlockToken(pw);
        // this.obs.putObserver('isSignedIn', true);
        this.router.navigate(['/myaccount']);
        this.processing = false;
    }
    catch(e){
        this.unlockAccountSetError('Wrong Pass Phrase');
        return;
    }
}
        
  import(): void{
    let enc = (document.getElementById('importENC') as any).value;
    if(enc) {
        try{
            enc = JSON.parse(enc);
            if(enc.id && enc.address && enc.crypto && enc.crypto.ciphertext && enc.crypto.cipherparams && enc.crypto.cipher && enc.crypto.kdf && enc.crypto.kdfparams && enc.crypto.mac) {
                this.cache.putCache('encrypted_id',enc);
                this.obs.putObserver('isPreviousUser', true);
            }
            (document.getElementById('importENC') as HTMLInputElement).value = null;
            document.getElementById('importwarning2').innerHTML = '';
            this.obs.putObserver('modal', 'authenticate.enterImport');
            return;
        }
        catch(e){
            (document.getElementById('importENC') as HTMLInputElement).value = null;
            document.getElementById('importwarning2').innerHTML = 'bad encrypted id';
            return;
        }
    }
  }

    showVerifyDelete(): void{
        this.obs.putObserver('modal', 'authenticate.verifyDelete');
    }

    SMSPhone(): void{
        this.obs.putObserver('modal', 'authenticate.SMS');
    }

    changeTabs(tab:number): void{
        this.tabs = tab;
        document.getElementsByClassName('setheighttab')[0].scrollTop = 0;
    }

    private setText() {
        // this.texts['home.Hero1'] = this.text.getText('home.Hero1'); // example
    }

}
