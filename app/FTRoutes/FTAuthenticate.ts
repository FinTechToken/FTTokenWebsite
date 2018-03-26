declare var sjcl: any;
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTWeb3Service } from '../FTServices/ft-web3';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-authenticate',
  templateUrl: '../../html/routes/authenticate.html'
})

export class FTAuthenticate {
  zone: NgZone;   
  isPreviousUser:boolean=false;

  AuthenticateTabs = {
        signIn:1,
        signUp:2,
        advanced:3
    }

  rememberedAddress;
  tabs = this.AuthenticateTabs.signIn;
  unlocking = false;

  constructor( private obs: FTObserver, private router: Router, private session: FTSession, private cache: FTCache, private FTlocalStorage:FTStorage, private web3:FTWeb3Service )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  ngOnInit(): void{ 
    if(this.obs.getObserver('isSignedIn').getValue()){
        this.router.navigate(['/myaccount']);
    }

    this.obs.getObserver('isPreviousUser')
    .forEach( (isPre) => {
      this.isPreviousUser = isPre;
      if(isPre){
        this.rememberedAddress = this.cache.getCache('encrypted_id').address;
      } else {
        this.tabs=this.AuthenticateTabs.signUp;
      }
    });

    this.obs.getObserver('deleteAccount')
    .forEach( (isDelete) => {
        if(isDelete){
            this.deleteAccount();
        }
    });
  }    

  createAccount(): void {
    document.getElementById('createbad').innerHTML = '';
    let privateKey = this.web3.getNewAccount().privateKey;
    let pw = (document.getElementById('PW') as HTMLInputElement).value;
    if(!pw) {
        document.getElementById('createbad').innerHTML = 'Enter 3 to 5 random words to create a passphrase'
        return;
    }
    let encrypted_id = this.web3.getEncryptedId(privateKey, pw);
    this.rememberedAddress = encrypted_id.address;
    this.FTlocalStorage.setItem('encrypted_id', JSON.stringify(encrypted_id));
    this.cache.putCache('encrypted_id', encrypted_id);
    this.cache.putCache('key', privateKey);
    this.obs.putObserver('isSignedIn', true);
    this.obs.putObserver('isPreviousUser', true);
    let keys = sjcl.encrypt(this.rememberedAddress, privateKey);
    this.session.setItem('k',keys); //security issue use for testing only
    (document.getElementById('PW') as HTMLInputElement).value = null;
    this.obs.putObserver('modal', 'authenticate.unlocked');
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
            this.tabs = 1;
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
    if(this.unlocking){return;}
    this.unlocking = true;
    document.getElementById('unlockbad').innerHTML = '';
    let pw = (document.getElementById('PWUnlock') as HTMLInputElement).value;
    
        try{
            let key = this.web3.decryptPrivateKey(JSON.stringify(this.cache.getCache('encrypted_id')),pw);
            this.cache.putCache('key',key);
            var keys = sjcl.encrypt(this.rememberedAddress, key);
            this.session.setItem('k',keys); //security issue use for testing only
            this.unlocking = false;
            this.obs.putObserver('modal', 'authenticate.unlocked');
            (document.getElementById('PWUnlock') as HTMLInputElement).value = null;
            document.getElementById('unlockbad').innerHTML = '';
            this.obs.putObserver('isSignedIn', true);
        }
        catch(e){
            document.getElementById('unlockbad').innerHTML = 'Wrong Password<br>';
            (document.getElementById('PWUnlock') as HTMLInputElement).value = '';
            this.unlocking = false;
            return;
        }   
    
    }

    deleteAccount(): void{
        this.FTlocalStorage.removeItem('encrypted_id');
        this.obs.putObserver('isSignedIn', false);
        this.obs.putObserver('isPreviousUser', false);
        this.cache.deleteCache('key');
        this.cache.deleteCache('encrypted_id');
        this.rememberedAddress = null;
        this.obs.putObserver('modal', '');
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

}
