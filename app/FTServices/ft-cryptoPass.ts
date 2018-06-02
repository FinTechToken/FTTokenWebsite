declare var sjcl:any;

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTStorage } from '../FTFramework/FT-Storage';
import { FTSession } from '../FTFramework/FT-Session';

@Injectable()
export class FTCryptoPassService {
    private expireToken = false;

    constructor ( private http: FTHttpClient, private cache: FTCache, private observer: FTObserver, private FTlocalStorage:FTStorage, private session:FTSession, private router: Router ) { 
    }
    
    initializeCryptoPass(): void{
        this.observer.getObserver('deleteAccount')
            .forEach( (isDelete) => {
                if(isDelete){
                    this.deleteAccount();
                }
            }
        );

        this.observer.getObserver('isSignedIn')
            .forEach( (isIn) => {
                if(isIn) {
                    this.expireToken = true;
                } else if(this.expireToken  && this.session.hasItem('token') && this.session.hasItem('account')) {
                    this.expireTheToken(this.session.getItem('token'), this.session.getItem('account'));
                    this.cache.deleteCache('key');
                    this.session.clear();
                }
            })

        if(this.FTlocalStorage.hasItem('token') && this.FTlocalStorage.hasItem('account')) {
            this.session.setItem( 'account', this.FTlocalStorage.getItem('account') );
            this.session.setItem( 'token', this.FTlocalStorage.getItem('token') );
            
            this.sendToken(this.session.getItem('token'), this.session.getItem('account'));
        }
    }

    destroyCryptoPass(): void {
        this.cache.deleteCache('key'); 
        this.session.clear();
        this.observer.deleteObserver('isSignedIn');
        this.observer.deleteObserver('isPreviousUser');
    }

    private expireTheToken(token, account) {
        this.http.put("refreshAccount", JSON.stringify({
            "account" : account,
            "token" : token,
            "expire" : true
            })).toPromise()
        .then( data => {
            data = JSON.parse(data);
            if(data.token) {
                this.FTlocalStorage.setItem('token', data.token);
            }
        })
        .catch( err => {console.log(err);});
    }

    sendToken(token, account) {
        this.http.put("refreshAccount", JSON.stringify({
            "account" : account,
            "token" : token
            })).toPromise()
        .then( data => {
            data = JSON.parse(data);
            if(data.token) {
                this.session.setItem( 'token', data.token );
                this.FTlocalStorage.setItem('token', data.token);
            }
            if(data.enc_id) {
                this.cache.putCache('encrypted_id', data.enc_id);
                this.observer.putObserver('isPreviousUser', true);
                if(data.privateKey) {
                    this.cache.putCache('key', data.privateKey);
                    this.observer.putObserver('isSignedIn', true);
                    this.router.navigate(['/myaccount']);
                } else {
                    this.router.navigate(['/crypto_pass']);
                }
            }
        })
        .catch( err => {console.log(err);});
    }

    unlockToken(phrase) {
        if(this.session.getItem('account') && this.session.getItem('token')) {
            this.http.put("refreshAccount", JSON.stringify({
                "account" : this.session.getItem('account'),
                "token" : this.session.getItem('token'),
                "phrase" : phrase
                })).toPromise()
            .then( data => {
                data = JSON.parse(data);
                if(data.token) {
                    this.session.setItem( 'token', data.token );
                    this.FTlocalStorage.setItem('token', data.token);
                    this.observer.putObserver('isSignedIn', true);
                    this.checkPhone(data.token);
                }
            })
            .catch( err => {console.log(err);});
        } else
            this.observer.putObserver('isSignedIn', true);
    }

        private checkPhone(mytoken):void {
            this.http.post("verifyPhone", this.getCheckPhoneInfoToSend(mytoken)).toPromise()
            .then( data => { 
                data = JSON.parse(data);
                if(data == false) 
                    this.observer.putObserver('modal', 'authenticate.unlocked');
            })
            .catch( err => {console.log(err);});
        }

            private getCheckPhoneInfoToSend(mytoken):string {
                return JSON.stringify({
                    "account" : this.session.getItem('account'),
                    "token" : mytoken
                });
            }

    private deleteAccount(): void{
        if(this.session.hasItem('token') && this.session.hasItem('account')) {
            this.expireTheToken(this.session.getItem('token'), this.session.getItem('account'));
        }
        this.FTlocalStorage.removeItem('account');
        this.FTlocalStorage.removeItem('token');
        this.observer.putObserver('isSignedIn', false);
        this.observer.putObserver('isPreviousUser', false);
        this.cache.deleteCache('key');
        this.cache.deleteCache('encrypted_id');
        this.observer.putObserver('modal', '');
        this.router.navigate(['/home']);
    } 
}
