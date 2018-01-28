import { Injectable }     from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

/* This service creates an array of observer - such that users can subscribe to them */
@Injectable()
export class FTObserver {
    private myObserver:BehaviorSubject<any>[]=[];
    constructor () {}

    putObserver(myName:string,myValue:any){
        if(this.myObserver[myName]===undefined){
            this.myObserver[myName]=new BehaviorSubject(myValue);
        }else{
            this.myObserver[myName].next(myValue);
        }
    }
    getObserver(myName:string):BehaviorSubject<any>{
        if(this.myObserver[myName]===undefined){
            this.myObserver[myName]=new BehaviorSubject('');
        }
        return this.myObserver[myName];
    }
    deleteObserver(myName:string){
        if(this.myObserver[myName]===undefined){}
        else{
            this.myObserver[myName].unsubscribe();
            this.myObserver[myName]=undefined;
        }
    }
}