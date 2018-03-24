declare var getAPI: any;

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
    }
    
    this.options = new RequestOptions({headers:headers,withCredentials:false});
  }

  get(urlName: any) { /* Read */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'get');

    return this.http.get(getAPI(urlName), this.options)
      .map((res: any) => {
        return res.text();
      });
  }

  post(urlName: any, data:any) { /* Create */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'post');
    
    return this.http.post(getAPI(urlName), data, this.options)
      .map((res:any) => {
          return res.text();
      });
  }

  put(urlName: any, data:any) { /*Update */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'put');

    return this.http.put(getAPI(urlName), data, this.options)
      .map((res:any) => {
          return res.text();
      });
  }

  delete(urlName: any) { /*Delete */
    let headers = new Headers();
    this.createAuthorizationHeader(headers,'delete');

    return this.http.delete(getAPI(urlName), this.options)
      .map((res:any) => {
          return res.text();
      });
  }
}