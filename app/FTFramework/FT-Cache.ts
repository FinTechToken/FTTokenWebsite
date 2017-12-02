import { Injectable }     from '@angular/core';
/* This service will cache a name/value pair so that it can be grabbed later by any part of the app */
//ToDo: this should be stored in a java object instead of two parrallel arrays.
//note: TC-Cache should NOT be an observable. It's purpose is a key that can be grabbed at fixed point in time. Use TC-Observable for observables.
@Injectable()
export class FTCache {
    private name:string[]=[];
    private value:any[]=[];
    constructor () {}

    putCache(myName:string,myValue:any){
        let pos =this.name.indexOf(myName);
        if(pos>=0){
            this.value[pos]=myValue;
        }else{
            this.name.push(myName);
            this.value.push(myValue);
        }
    }
    getCache(myName:string){
        let pos =this.name.indexOf(myName);
        if(pos>=0){
            return this.value[pos];
        }else{
            return null;//ToDo: should we return null?
        }
    }
    deleteCache(myName:string){
        let pos=this.name.indexOf(myName);
        if(pos>=0){
            this.name.splice(pos);
            this.value.splice(pos);
        }
    }


}