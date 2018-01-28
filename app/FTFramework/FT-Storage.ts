import { Injectable }     from '@angular/core';
/* This service will store a name/value pair in localStorage if HTML5 browser or cookies if not HTML5 */
// from https://gist.github.com/remy/350433

// As long as we have localStorage.js this won't actually be used. 
// The try block will always work because localStorage creates the function if it would have failed.
// When we pull all the external js files that depend on localStorage into angular we can delete localStorage.js

@Injectable()
export class FTStorage {
    private localStorageData;
    private useBrowserFunction = true;

    constructor () {
        try {
            if (!window.localStorage) {
                throw "exception";
            }
            localStorage.setItem('storage_test', '1');
            localStorage.removeItem('storage_test');
        } catch(e) {
            this.useBrowserFunction = false;
            this.localStorageData = this.getLocalStorageData();
        }
    }

    clear(): void {
        if(this.useBrowserFunction){
            localStorage.clear();
        } else {
            this.localStorageData = {};
            this.clearLocalStorageData();
        }
    }

    getItem(key): string {
        if(this.useBrowserFunction){
            return localStorage.getItem(key);
        } else{
            return this.localStorageData[key] === undefined ? null : this.localStorageData[key];
        }
    }

    key(i): string {
        if(this.useBrowserFunction){
            return localStorage.key(i);
        } else {
            let ctr = 0;
            for (let k in this.localStorageData) {
                if (ctr == i) return k;
                else ctr++;
            }
            return null;
        }
    }

    removeItem(key): void {
        if(this.useBrowserFunction){
            localStorage.removeItem(key);
        } else{
            delete this.localStorageData[key];
            this.setLocalStorageData(this.localStorageData);
        }
    }

    setItem(key, value): void {
        if(this.useBrowserFunction){
            localStorage.setItem(key, value);
        } else {
            this.localStorageData[key] = value+'';
            this.setLocalStorageData(this.localStorageData);
        }
    }

    hasItem(key): boolean {
        if(this.useBrowserFunction) {
            return !(localStorage.getItem(key) === undefined || localStorage.getItem(key) === null);
        } else{
            return !(this.localStorageData[key] === undefined || this.localStorageData[key] === null);
        }
    }

    private setCookie(name, value, days) {
        let date, expires;
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/; secure; SameSite=strict";
    }

    private getCookie(name) {
        let nameEQ = name + "=",
            ca = document.cookie.split(';'),
            i, c;
        for (i=0; i < ca.length; i++) {
            c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }

    private setLocalStorageData(data) {
        data = encodeURIComponent(JSON.stringify(data));
        this.setCookie('localStorage', data, 90);
    }

    private clearLocalStorageData() {
        this.setCookie('localStorage', '', 90);
    }
    
    private getLocalStorageData() {
        let data = this.getCookie('localStorage');
        return data ? JSON.parse(decodeURIComponent(data)) : {};
    }
}