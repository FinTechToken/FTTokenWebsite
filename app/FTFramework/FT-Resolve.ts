import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { FTCache } from '../FTFramework/FT-Cache';

//Note:This is not being used. Keeping as example of resolver

@Injectable()
export class FTResolve implements Resolve<any> {
  myLocal:string;
  resolveObserve:Subject<any>;
  constructor(private cache:FTCache, private http:Http) {}
  
  resolve(route: ActivatedRouteSnapshot) {
      this.myLocal = route.url[0].path;
        this.resolveObserve = new Subject();
        if(this.cache.getCache(this.myLocal+'.js')){//if we already loaded the js file. respond with txt file content
            console.log('alread');
            let myObserve = new Observable<any>(observer => {
                    let page=this.cache.getCache(this.myLocal);
                    if(page ==null){//json is cached so it doesn't load on each visit
                        this.http.get('/json/'+this.myLocal+'.txt')
                            .subscribe(response=> {
                                this.cache.putCache(this.myLocal,response.text());
                                observer.next(JSON.parse(response.text()));
                                observer.complete();
                            });
                    }else{//json is cached so respond quickly.
                            observer.next(JSON.parse(page));
                            observer.complete();
                    }
                }
            );
            return myObserve;
        }
        else{            
            this.cache.putCache(this.myLocal+'.js',true)
            let url= '/json/'+this.myLocal+'.js';
            let node = document.createElement('script');
            node.src = url;
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            let TCel = this;
            try{
                node.onload= function(){
                    TCel.getPage();//set text file in observe AFTER js file loads.
                };
                document.getElementsByTagName('body')[0].appendChild(node);
                return this.resolveObserve.asObservable();
            } catch(e){}
        }
        
  }

  private getPage(){//only called when js script file loads.
      let page=this.cache.getCache(this.myLocal);      
         if(page ==null){//json is cached so it doesn't load on each visit
            this.http.get('/json/'+this.myLocal+'.txt')
                .subscribe(response=> {
                    this.cache.putCache(this.myLocal,response.text());
                    this.resolveObserve.next(JSON.parse(response.text()));
                    this.resolveObserve.complete();
                });
         }else{
             this.resolveObserve.next(JSON.parse(page));
             this.resolveObserve.complete();
         }
  }
}