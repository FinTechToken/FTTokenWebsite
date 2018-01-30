import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class FTHttpClient {
  constructor(private http: Http) {}
  options: RequestOptions;
  createAuthorizationHeader(headers: Headers, myType:string) {
    if(myType == 'post' || myType =='put'){
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    }else{
    }
    this.options = new RequestOptions({headers:headers,withCredentials:false});
  }

  get(url: any) {
    let headers = new Headers(); /* Read */
    return this.http.get(url, this.options)
    .map((res: any) => {
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
        return res.text();
    });
  }

  put(url: any, data:any) { /*Update */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'put');
    return this.http.put(url, data, this.options)
    .map((res:any) => {
        return res.text();
    });
  }

  delete(url: any) { /*Delete */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'delete');
    return this.http.delete(url, this.options)
    .map((res:any) => {
        return res.text();
    });
  }
}