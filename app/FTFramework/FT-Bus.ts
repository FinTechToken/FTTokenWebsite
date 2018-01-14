import { Injectable }     from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
//This service is a simple messagee. Any App can use to output values to the rest of the application.

@Injectable()
export class FTBus {
    msg: {sender:string,msg:any};
    private FTBus: BehaviorSubject<any>=new BehaviorSubject({sender:'',msg:''});
    constructor () {}
    getBus(){
        return this.FTBus;
    }
    setBus(sender:string,msg:any){
        this.FTBus.next({sender:sender,msg:msg});
    }
}
