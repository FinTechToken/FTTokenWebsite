import { Injectable }     from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx'; //behaviorsubject - like a subject but has past/initial value

/* This service creates an array of observer - such that users can subscribe to them */
@Injectable()
export class FTObserver {
    private myObserver:BehaviorSubject<any>[]=[];
    constructor () {}

    //to update element in the content part of the type/content structure.
    putObserverValue(myName:string,myArray:number,myElement:string,myValue:any){
        if(this.myObserver[myName]===undefined){
            //do nothing as no observer exists.
        }else{
            let temp = this.myObserver[myName].getValue();
            temp[myArray]['content'][myElement]=myValue;//observer is an array of type/content pairs.
            this.myObserver[myName].next(temp);
        }
    }

    getObserverValue(myName:string,myArray:number,myElement:string){
        if(this.myObserver[myName]===undefined){return null;}
        else{
            let temp = this.myObserver[myName].getValue();
            if(temp[myArray]===undefined){return null;}
            else if(temp[myArray][myElement]===undefined){return null;}
            else {return temp[myArray][myElement];}
        }
    }

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