import { Injectable }     from '@angular/core';
/* This service will cache a name/value pair so that it can be grabbed later by any part of the app */
//ToDo: this should be stored in a java object instead of two parrallel arrays.
//note: TC-Cache should NOT be an observable. It's purpose is a key that can be grabbed at fixed point in time. Use TC-Observable for observables.
@Injectable()
export class FTCache {
    private cache = new Map();

    private name:string[]=[];
    private value:any[]=[];
    constructor () {}

    putCache(myName:string,myValue:any){
        this.cache.set(myName, myValue);
    }
    getCache(myName:string){
        return this.cache.get(myName);
    }
    hasCache(myName:string){
        return this.cache.has(myName);
    }
    deleteCache(myName:string){
        this.cache.delete(myName);
    }
}