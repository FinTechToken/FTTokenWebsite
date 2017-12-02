declare var getAPI: any;
import { Injectable }     from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx'; //behaviorsubject - like a subject but has past/initial value
//import 'rxjs/add/operator/map';

import { Response, Headers, RequestOptions } from '@angular/http';
import{ FTHttpClient } from '../FTFramework/FT-HttpClient';
import{ FTObserver } from '../FTFramework/FT-Observer';

//This service is to keep track of session.
//Session is stored in localstorage for long term.
//Any variable the app needs for state can be kept here. 
//The design is that you can subscribe to the ENTIRE Session - or just one variable
//Programmer can only update ONE variable and cannot update the ENTIRE session.
//Clear should clear EVERYTHING - LocalStorage - Server - SessionStore

//ToDo: check if performance is better having multiple observers for each element - or receiving the whole thing and processing it

//ToDo: check if we can remove email - everything else is okay not being secure.
//ToDo: store an encrypted id - send to server to get values to store here - but not in LocalStorage

@Injectable()
export class FTSession {
    private logOut = getAPI('logout');
    private sessionStruct= {user_id:'0',email:'',profile:'0',investortype:'',refitype:''};
    //private sessionStore: BehaviorSubject<any>=new BehaviorSubject('');
    //private sessionStoreUser_Id: BehaviorSubject<any>=new BehaviorSubject('0');
    //private sessionStoreEmail: BehaviorSubject<any>=new BehaviorSubject('');
    //private sessionStoreProfile: BehaviorSubject<any>=new BehaviorSubject('0');
    //private sessionStoreInvestorType: BehaviorSubject<any>=new BehaviorSubject('');
    //private sessionStoreRefiType: BehaviorSubject<any>=new BehaviorSubject('');
    constructor (private http: FTHttpClient,private sessionObserver:FTObserver) {
    //     this.loadInitialData();
    }
    loadInitialData() {
        if(localStorage.getItem('user_id')===null){
            localStorage.setItem('user_id','0');
        }else{
            this.sessionStruct.user_id = localStorage.getItem('user_id');
            this.sessionObserver.putObserver('session.user_id',this.sessionStruct.user_id);
        }
        if(localStorage.getItem('email')===null){
            localStorage.setItem('email','');
        }else{
            this.sessionStruct.email = localStorage.getItem('email');
            this.sessionObserver.putObserver('session.email',this.sessionStruct.email);
        }
        if(localStorage.getItem('profile')===null){
            localStorage.setItem('profile','0')
        }else{
            this.sessionStruct.profile = localStorage.getItem('profile');
            this.sessionObserver.putObserver('session.profile',this.sessionStruct.profile);
        }
        if(localStorage.getItem('investortype')===null){
            localStorage.setItem('investortype','');
        }else{
            this.sessionStruct.investortype = localStorage.getItem('investortype');
            this.sessionObserver.putObserver('session.investortype',this.sessionStruct.investortype);
        }
        if(localStorage.getItem('refitype')===null){
            localStorage.setItem('refitype','');
        }else{
            this.sessionStruct.refitype = localStorage.getItem('refitype');
            this.sessionObserver.putObserver('session.refitype',this.sessionStruct.refitype);
        }
        this.sessionObserver.putObserver('session.Store',this.sessionStruct);
    }
    getSession(sessionName:string){
        return this.sessionObserver.getObserver('session.'+sessionName);
    }
    
    setSession(sessionElement:string,elementValue:string){
        let update =0;
        if(sessionElement=='user_id'){
            if(this.sessionStruct.user_id!=elementValue){
                this.sessionStruct.user_id = elementValue;
                localStorage.setItem('user_id',elementValue);
                this.sessionObserver.putObserver('session.'+sessionElement,elementValue);
                update=1;
            }
        }
        if(sessionElement=='email'){
            if(this.sessionStruct.email!=elementValue){
                this.sessionStruct.email = elementValue;
                localStorage.setItem('email',elementValue);
                this.sessionObserver.putObserver('session.'+sessionElement,elementValue);
                update=1;
            }
        }
        if(sessionElement=='profile'){
            if(this.sessionStruct.profile!=elementValue){
                this.sessionStruct.profile = elementValue;
                localStorage.setItem('profile',elementValue);
                this.sessionObserver.putObserver('session.'+sessionElement,elementValue);
                update=1;
            }
        }
        if(sessionElement=='investortype'){
            if(this.sessionStruct.investortype!=elementValue){
                this.sessionStruct.investortype = elementValue;
                localStorage.setItem('investortype',elementValue);
                this.sessionObserver.putObserver('session.'+sessionElement,elementValue);
                update=1;
            }
        }
        if(sessionElement=='refitype'){
            if(this.sessionStruct.refitype!=elementValue){
                this.sessionStruct.refitype = elementValue;
                localStorage.setItem('refitype',elementValue);
                this.sessionObserver.putObserver('session.'+sessionElement,elementValue);
                update=1;
            }
        }
        if(update==1){
            this.sessionObserver.putObserver('session.Store',this.sessionStruct);
        }
    }

    clear(){
        localStorage.clear();//clear local storage     
        //clear sessionStore 
        this.sessionStruct= {user_id:'0',email:'',profile:'0',investortype:'',refitype:''};
        this.sessionObserver.putObserver('session.Store',this.sessionStruct);
        this.sessionObserver.putObserver('session.user_id','0');
        this.sessionObserver.putObserver('session.email','');
        this.sessionObserver.putObserver('session.profile','0');
        this.sessionObserver.putObserver('session.investortype','');
        this.sessionObserver.putObserver('session.refitype','');
        //clear Server
        this.http.get(this.logOut).subscribe(
            returns => {
                // console.log('Out');
            },
            err => console.log(err)
        );
    }
}