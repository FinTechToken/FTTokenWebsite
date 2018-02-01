declare var sjcl: any;
import { Component, trigger, state, style, transition, animate, OnInit, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTStorage } from '../FTFramework/FT-Storage';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-authenticate',
  templateUrl: '../../html/routes/authenticate.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTAuthenticate {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  encrypted_id;
  key;
  modal=0;
  tabs=1;
  popover='';
  unlocking = false;
  newAccount;

  constructor( private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http, private FTlocalStorage:FTStorage )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  ngOnInit(): void{ 
      //ToDo: on realnet move this into Else of web3
      if(this.cache.hasCache('key')){
        this.router.navigate(['/myaccount']);
      }
      if(this.cache.hasCache('encrypted_id')){
        this.encrypted_id = this.cache.getCache('encrypted_id');
        //document.getElementById('unlockaccount').innerHTML = this.encrypted_id.address;
      } else{
          this.tabs=2;
      }
      /*
      var coinbase = "b4f0d18df34fbb96d80b1f2d21ac5675ff7dccd6";
      web3.eth.getBalance(coinbase).then( x => {
          let originalBalance = web3.utils.fromWei(x,'ether');
          document.getElementById('origbalance').innerHTML = 'Balance: ' + originalBalance;
          return null;
      });
      */
  }    
  showModal(modal: number): void {
    this.modal = modal;
    let els = document.getElementsByClassName("modal-body");
    let x=(window.innerHeight-1)*1-100;
    for(let i = 0; i < els.length; i++)
    {
       let el:HTMLElement = els[i] as HTMLElement;
       el.style.height=x*.75+'px';
    }
    try{
        if(modal === 4) { //use account
            document.getElementById('enc_id').innerHTML = JSON.stringify(this.cache.getCache('encrypted_id'));
        }
    }
    catch(e){
        alert("Your browser is not supported. Please try chrome");
        this.modal=0;
    }
  }
  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  createAccount(): void{
    document.getElementById('createbad').innerHTML = '';
    this.newAccount = this.cache.getCache('wb3').eth.accounts.create();
    let pw = (document.getElementById('PW') as HTMLInputElement).value;
    if(!pw) {
        document.getElementById('createbad').innerHTML = 'Enter 3 to 5 random words to create a passphrase'
        return;
    }
    this.encrypted_id = this.cache.getCache('wb3').eth.accounts.encrypt(this.newAccount.privateKey, pw);
    this.FTlocalStorage.setItem('encrypted_id',JSON.stringify(this.encrypted_id));
    this.cache.putCache('encrypted_id', this.encrypted_id);
    this.cache.putCache('key', this.newAccount.privateKey);
    this.obs.putObserver('isSignedIn', true);
    this.obs.putObserver('isPreviousUser', true);
    var keys = sjcl.encrypt(this.encrypted_id.address, this.cache.getCache('key'));
    this.session.setItem('k',keys); //security issue use for testing only
    this.newAccount = '';
    (document.getElementById('PW') as HTMLInputElement).value = null;
    this.showModal(4);
  }

  import(): void{
    let key = (document.getElementById('importKey') as HTMLInputElement).value;
    let pw = (document.getElementById('importPW') as HTMLInputElement).value;
    let enc = (document.getElementById('importENC') as any).value;
    if(pw && key){
        try{
            this.encrypted_id = this.cache.getCache('wb3').eth.accounts.encrypt(key, pw);
            this.FTlocalStorage.setItem('encrypted_id',JSON.stringify(this.encrypted_id));
            this.cache.putCache('encrypted_id',this.encrypted_id);
            this.cache.putCache('key',key);
            this.obs.putObserver('isSignedIn', true);
            this.obs.putObserver('isPreviousUser', true);
            var keys = sjcl.encrypt(this.encrypted_id.address, key);
            this.session.setItem('k',keys); //security issue use for testing only
            this.showModal(4);
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
                this.encrypted_id = enc;
                this.FTlocalStorage.setItem('encrypted_id',JSON.stringify(this.encrypted_id));
                this.cache.putCache('encrypted_id',this.encrypted_id);
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
    this.showModal(5);
  }
  unlockAccount(): void{
    if(this.unlocking){return;}
    this.unlocking = true;
    document.getElementById('unlockbad').innerHTML = '';
    let pw = (document.getElementById('PWUnlock') as HTMLInputElement).value;
    setTimeout(() => {
        try{
            this.cache.putCache('key',this.cache.getCache('wb3').eth.accounts.decrypt(JSON.stringify(this.encrypted_id),pw).privateKey);
            var keys = sjcl.encrypt(this.encrypted_id.address, this.cache.getCache('key'));
            this.session.setItem('k',keys); //security issue use for testing only
            this.unlocking = false;
            this.obs.putObserver('isSignedIn', true);
            this.showModal(4);
            (document.getElementById('PWUnlock') as HTMLInputElement).value = null;
            document.getElementById('unlockbad').innerHTML = '';
        }
        catch(e){
            document.getElementById('unlockbad').innerHTML = 'Wrong Password<br>';
            (document.getElementById('PWUnlock') as HTMLInputElement).value = '';
            this.unlocking = false;
            return;
        }   
        },0);
    }
  deleteAccount(): void{
    this.FTlocalStorage.removeItem('encrypted_id');
    this.obs.putObserver('isSignedIn', false);
    this.obs.putObserver('isPreviousUser', false);
    this.cache.deleteCache('key');
    this.cache.deleteCache('encrypted_id');
    this.encrypted_id = null;
    this.key = null;
    this.showModal(0);
}

  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }
}
