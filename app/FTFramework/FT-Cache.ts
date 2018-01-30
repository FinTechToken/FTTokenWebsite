import { Injectable }     from '@angular/core';
/* This service will cache a name/value pair so that it can be grabbed later by any part of the app */
//note: TC-Cache should NOT be an observable. It's purpose is a key that can be grabbed at fixed point in time. Use TC-Observable for observables.

@Injectable()
export class FTCache {
    private cache = new Map();

    constructor () {}

    putCache(myName:string, myValue:any): void{
        this.cache.set(myName, myValue);
    }
    getCache(myName:string): any {
        return this.cache.get(myName);
    }
    hasCache(myName:string): any {
        return this.cache.has(myName);
    }
    deleteCache(myName:string): void{
        this.cache.delete(myName);
    }
}