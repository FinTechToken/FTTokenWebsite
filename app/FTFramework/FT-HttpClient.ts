import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class FTHttpClient {
  //ToDo: Add error handling
  constructor(private http: Http) {}
  //Auth1: string;
  //Auth2: string;
  //Auth3: string;
  options: RequestOptions;
  createAuthorizationHeader(headers: Headers, myType:string) {
      //This isn't really needed as we use CoRS now. Keep comments as this will help when using tokens
    //this.Auth1 = JSON.parse(localStorage.getItem('Auth1'));
    //this.Auth2 = JSON.parse(localStorage.getItem('Auth2'));
    //this.Auth3 = JSON.parse(localStorage.getItem('Auth3'));
   //     headers.append('Auth1', this.Auth1);
   //     headers.append('Auth2', this.Auth2);
   //     headers.append('Auth3', this.Auth3);
    if(myType == 'post' || myType =='put'){
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    }else{
    }
    //headers.append('Content-Type', 'application/json' );
    /*this.options = new RequestOptions({headers:headers,withCredentials:true});*/
    this.options = new RequestOptions({headers:headers,withCredentials:false});
  }
//ToDo: This is based on text response and form-urlencoded - have JSON response and Json encoded.
  get(url: any) {
    let headers = new Headers(); /* Read */
    //this.createAuthorizationHeader(headers,'get');
    return this.http.get(url, this.options)
    .map((res: any) => {
        //if(res.headers.get('Auth1') || res.headers.get('Auth2') || res.headers.get('Auth3') ){
            /* ToDo: when auth1 is global only write on change */
        //    localStorage.setItem('Auth1',JSON.stringify(res.headers.get('Auth1')));
        //    localStorage.setItem('Auth2',JSON.stringify(res.headers.get('Auth2')));
        //    localStorage.setItem('Auth3',JSON.stringify(res.headers.get('Auth3')));
        //}
        return res.text();
    })
  }

  post(url: any, data:any) { /* Create */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'post');
    return this.http.post(url, data, this.options /*{
      headers: headers
    }*/)
    .map((res:any) => {
        //if(res.headers.get('Auth1') || res.headers.get('Auth2') || res.headers.get('Auth3') ){
        //    localStorage.setItem('Auth1',JSON.stringify(res.headers.get('Auth1')));
        //    localStorage.setItem('Auth2',JSON.stringify(res.headers.get('Auth2')));
        //    localStorage.setItem('Auth3',JSON.stringify(res.headers.get('Auth3')));
       // }
        return res.text();
    });
  }

  put(url: any, data:any) { /*Update */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'put');
    return this.http.put(url, data, this.options)
    .map((res:any) => {
        //if(res.headers.get('Auth1') || res.headers.get('Auth2')|| res.headers.get('Auth3') ){
        //    localStorage.setItem('Auth1',JSON.stringify(res.headers.get('Auth1')));
        //    localStorage.setItem('Auth2',JSON.stringify(res.headers.get('Auth2')));
        //    localStorage.setItem('Auth3',JSON.stringify(res.headers.get('Auth3')));
       // }
        return res.text();
    });
  }

  delete(url: any) { /*Delete */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'delete');
    return this.http.delete(url, this.options)
    .map((res:any) => {
        //if(res.headers.get('Auth1') || res.headers.get('Auth2') || res.headers.get('Auth3') ){
        //    localStorage.setItem('Auth1',JSON.stringify(res.headers.get('Auth1')));
        //    localStorage.setItem('Auth2',JSON.stringify(res.headers.get('Auth2')));
        //    localStorage.setItem('Auth3',JSON.stringify(res.headers.get('Auth3')));
       // }
        return res.text();
    });
  }
}