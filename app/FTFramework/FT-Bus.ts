import { Injectable }     from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx'; //behaviorsubject - like a subject but has past/initial value
//import 'rxjs/add/operator/map';

//This service is a simple messagee. Any App can use to output values to the rest of the application.

@Injectable()
export class FTBus {
    msg: {sender:string,msg:any};
    private TCBus: BehaviorSubject<any>=new BehaviorSubject({sender:'',msg:''});
    constructor () {}
    getBus(){
        return this.TCBus;
    }
    setBus(sender:string,msg:any){
        this.TCBus.next({sender:sender,msg:msg});
    }
}