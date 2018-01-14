import { Injectable }     from '@angular/core';
/* This service will store a name/value pair in sessionStorage if HTML5 browser or cookies if not HTML5 */
// from https://gist.github.com/remy/350433

@Injectable()
export class FTSession {
    private sessionStorageData;
    private useBrowserFunction = true;

    constructor () {
        try {
            if (!window.sessionStorage) {
                throw "exception";
            }
            sessionStorage.setItem('storage_test', '1');
            sessionStorage.removeItem('storage_test');
        } catch(e) {
            this.useBrowserFunction = false;
            this.sessionStorageData = this.getSessionStorageData();
        }
    }

    clear(): void {
        if(this.useBrowserFunction){
            sessionStorage.clear();
        } else {
            this.sessionStorageData = {};
            this.clearSessionStorageData();
        }
    }

    getItem(key): string {
        if(this.useBrowserFunction){
            return sessionStorage.getItem(key);
        } else{
            return this.sessionStorageData[key] === undefined ? null : this.sessionStorageData[key];
        }
    }

    key(i): string {
        if(this.useBrowserFunction){
            return sessionStorage.key(i);
        } else {
            let ctr = 0;
            for (let k in this.sessionStorageData) {
                if (ctr == i) return k;
                else ctr++;
            }
            return null;
        }
    }

    removeItem(key): void {
        if(this.useBrowserFunction){
            sessionStorage.removeItem(key);
        } else{
            delete this.sessionStorageData[key];
            this.setSessionStorageData(this.sessionStorageData);
        }
    }

    setItem(key, value): void {
        if(this.useBrowserFunction){
            sessionStorage.setItem(key, value);
        } else {
            this.sessionStorageData[key] = value+'';
            this.setSessionStorageData(this.sessionStorageData);
        }
    }

    hasItem(key): boolean {
        if(this.useBrowserFunction) {
            return !(sessionStorage.getItem(key) === undefined || sessionStorage.getItem(key) === null)
        } else{
            return !(this.sessionStorageData[key] === undefined || this.sessionStorageData[key] === null)
        }
    }

    private setCookie(name, value) {
        document.cookie = name+"="+value+"; path=/; secure; SameSite=strict";
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

    private setSessionStorageData(data) {
        data = encodeURIComponent(JSON.stringify(data));
        this.setCookie('sessionStorage', data);
    }

    private clearSessionStorageData() {
        this.setCookie('sessionStorage', '');
    }
    
    private getSessionStorageData() {
        let data = this.getCookie('sessionStorage');
        return data ? JSON.parse(decodeURIComponent(data)) : {};
    }
}