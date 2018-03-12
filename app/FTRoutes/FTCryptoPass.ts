declare var sjcl: any;
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTWeb3 } from '../FTServices/ft-web3';
import { FTText } from '../FTFramework/FT-Text';

@Component({
  moduleId: module.id,
  selector: 'ft-cryptopass',
  templateUrl: '../../html/routes/cryptopass.html'
})

export class FTCryptoPass {
  zone: NgZone;   
  isPreviousUser:boolean=false;
  texts = [];
  rememberedAddress;
  processing = false;
  pwGroupStatus = '';
  AuthenticateTabs = {
        getStarted:0,
        signIn:1,
        signUp:2,
        advanced:3
    }
  tabs = this.AuthenticateTabs.getStarted;

  constructor( private obs: FTObserver, private router: Router, private session: FTSession, private cache: FTCache, private FTlocalStorage:FTStorage, private web3:FTWeb3,  private text: FTText )
  {   
    this.setText();
    this.zone = new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  ngOnInit(): void { 
    if(this.obs.getObserver('isSignedIn').getValue()) {
        this.router.navigate(['/myaccount']);
    }

    this.isPreviousUser = this.obs.getObserver('isPreviousUser').getValue();
    if(this.isPreviousUser){
        this.rememberedAddress = this.cache.getCache('encrypted_id').address;
        this.tabs=this.AuthenticateTabs.signIn;
    } else {
        this.tabs=this.AuthenticateTabs.getStarted;
    }
  }    

  createAccount(): void {
    if( !this.processing ) {
        this.processing = true;
        this.createAccountSetFieldsOnSubmit();
        let pw = (document.getElementById('PW') as HTMLInputElement).value;
        let pwc = (document.getElementById('PWc') as HTMLInputElement).value;
        if(!pw) {
            this.createAccountSetError('Enter 3 to 5 random words to create a passphrase');
        } else if(pw != pwc){
            this.createAccountSetError('Pass phrase needs to match');
        } else {
            setTimeout(()=> {
                this.createAccountNow(pw);
            },50);
        }
    }
  }

  private createAccountSetFieldsOnSubmit() {
    this.pwGroupStatus = '';
    document.getElementById('createbad').innerHTML = '<br>';
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
    this.rememberedAddress = encrypted_id.address;
    this.FTlocalStorage.setItem('encrypted_id', JSON.stringify(encrypted_id));
    this.cache.putCache('encrypted_id', encrypted_id);
    this.cache.putCache('key', privateKey);
    this.obs.putObserver('isSignedIn', true);
    this.obs.putObserver('isPreviousUser', true);
    let keys = sjcl.encrypt(this.rememberedAddress, privateKey);
    this.session.setItem('k',keys); //security issue use for testing only
    this.createAccountResetFeilds();
    this.obs.putObserver('modal', 'authenticate.unlocked');
    this.processing = false;
  }

  private createAccountResetFeilds() {
    (document.getElementById('PW') as HTMLInputElement).value = null;
    (document.getElementById('PWc') as HTMLInputElement).value = null;
    document.getElementById('launch').innerHTML = 'Launch CryptoPass';
  }

  import(): void{
    let key = (document.getElementById('importKey') as HTMLInputElement).value;
    let pw = (document.getElementById('importPW') as HTMLInputElement).value;
    let enc = (document.getElementById('importENC') as any).value;
    if(pw && key){
        try{
            let encrypted_id = this.web3.getEncryptedId( key, pw );
            this.rememberedAddress = encrypted_id.address;
            this.FTlocalStorage.setItem('encrypted_id',JSON.stringify(encrypted_id));
            this.cache.putCache('encrypted_id', encrypted_id);
            this.cache.putCache('key', key);
            this.obs.putObserver('isSignedIn', true);
            this.obs.putObserver('isPreviousUser', true);
            let keys = sjcl.encrypt(this.rememberedAddress, key);
            this.session.setItem('k',keys); //security issue use for testing only
            this.obs.putObserver('modal', 'authenticate.unlocked');
            (document.getElementById('importKey') as HTMLInputElement).value = null;
            (document.getElementById('importPW') as HTMLInputElement).value = null;
            document.getElementById('importwarning').innerHTML = '';
            return;
        }
        catch(e){
            (document.getElementById('importKey') as HTMLInputElement).value = null;
            (document.getElementById('importPW') as HTMLInputElement).value = null;
            document.getElementById('importwarning').innerHTML = 'bad key';
            return;
        }
    } else if(enc) {
        try{
            enc = JSON.parse(enc);
            if(enc.id && enc.address && enc.crypto && enc.crypto.ciphertext && enc.crypto.cipherparams && enc.crypto.cipher && enc.crypto.kdf && enc.crypto.kdfparams && enc.crypto.mac) {
                this.rememberedAddress = enc.address;
                this.FTlocalStorage.setItem('encrypted_id',JSON.stringify(enc));
                this.cache.putCache('encrypted_id',enc);
                this.obs.putObserver('isPreviousUser', true);
            }
            this.tabs = this.AuthenticateTabs.signIn;
            (document.getElementById('importENC') as HTMLInputElement).value = null;
            document.getElementById('importwarning2').innerHTML = '';
            return;
        }
        catch(e){
            (document.getElementById('importENC') as HTMLInputElement).value = null;
            document.getElementById('importwarning2').innerHTML = 'bad encrypted id';
            return;
        }
    }
    this.obs.putObserver('modal', 'authenticate.enterImport');
  }

  unlockAccount(): void{
    if(this.processing){return;}
    this.processing = true;
    setTimeout(()=> {
        document.getElementById('unlockbad').innerHTML = '';
        let pw = (document.getElementById('PWUnlock') as HTMLInputElement).value;
        
            try{
                let key = this.web3.decryptPrivateKey(JSON.stringify(this.cache.getCache('encrypted_id')),pw);
                this.cache.putCache('key',key);
                var keys = sjcl.encrypt(this.rememberedAddress, key);
                this.session.setItem('k',keys); //security issue use for testing only
                this.processing = false;
                this.obs.putObserver('modal', 'authenticate.unlocked');
                (document.getElementById('PWUnlock') as HTMLInputElement).value = null;
                document.getElementById('unlockbad').innerHTML = '';
                this.obs.putObserver('isSignedIn', true);
            }
            catch(e){
                document.getElementById('unlockbad').innerHTML = 'Wrong Password<br>';
                (document.getElementById('PWUnlock') as HTMLInputElement).value = '';
                this.processing = false;
                return;
            } 
        },50);  
    }
    
    showSignUpInfo(): void {
        this.obs.putObserver('modal', 'authenticate.signupInfo');
    }

    showVerifyDelete(): void{
        this.obs.putObserver('modal', 'authenticate.verifyDelete');
    }

    changeTabs(tab:number): void{
        this.tabs = tab;
    }

    private setText() {
        // this.texts['home.Hero1'] = this.text.getText('home.Hero1'); // example
    }

}
