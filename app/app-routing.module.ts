declare var getAPI: any; //ToDo: move declare into typedef files
//ToDo: load the js files for all links shown on a given page in the background. As opposed to waiting fo a click.

import { NgModule, EventEmitter } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { RouterModule, Routes, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { FTCache } from './FTFramework/FT-Cache';
import { FTHttpClient } from './FTFramework/FT-HttpClient';
import { FTResolve } from './FTFramework/FT-Resolve';
import { FTSession } from './FTFramework/FT-Session';

import { FTHome } from './FTComponents/FThome';
import { FTTokenMarket } from './FTComponents/FTTokenMarket';
import { FTStory } from './FTComponents/FTStory';
import { FTContact } from './FTComponents/FTcontact';
import { FTAuthenticate } from './FTComponents/FTAuthenticate';
import { FTTestNet } from './FTComponents/FTTestNet';
import { FTBlockchain } from './FTComponents/FTBlockchain';
import { FTAccount } from './FTComponents/FTAccount';
import { FTMyAccount } from './FTComponents/FTMyAccount';
import { FTAlerts } from './FTComponents/FTAlerts';
import { FTToken } from './FTComponents/FTToken';
import { FTTradeToken } from './FTComponents/FTTradeToken';
import { FTInvestCrypto } from './FTComponents/FTInvestCrypto';
import { FTAboutFTT } from './FTComponents/FTAboutFTT';

const routes: Routes = [ {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path:'home',
        component: FTHome
    },
    {
        path:'trade_tokens',
        component: FTTradeToken
    },
    {
        path:'invest_in_crypto_currency',
        component: FTInvestCrypto
    },
    {
        path:'about_fintech_token',
        component: FTAboutFTT
    },
    {
        path:'blockchain',
        component: FTBlockchain
    },
    {
        path:'blockchain/:id',
        component: FTBlockchain
    },
    {
        path:'account',
        component: FTAccount
    },
    {
        path:'account/:id',
        component: FTAccount
    },
    {
        path:'token',
        component: FTToken
    },
    {
        path:'token/:id',
        component: FTToken
    },
    {
        path:'alerts',
        component: FTAlerts
    },
    {
        path:'alerts/:id',
        component: FTAlerts
    },
    {
        path:'market',
        component: FTTokenMarket
    },
    {
        path:'market/:id',
        component: FTTokenMarket
    },
    {
        path:'market/:id/:id2',
        component: FTTokenMarket
    },
    {
        path:'story',
        component: FTStory
    },
    {
        path:'contact',
        component: FTContact
    },
    {
        path:'authenticate',
        component: FTAuthenticate
    },
    {
        path:'myaccount',
        component: FTMyAccount
    },
    {
        path:'TestNet',
        component: FTTestNet
    }];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
    //ToDo: add providers for GuardServices
})
export class AppRoutingModule {
    private TokenUrl = getAPI('getToken');
    private first = 1;
    constructor( router: Router, title: Title, private normhttp: Http, private http: FTHttpClient, private session: FTSession, private cache: FTCache) {
        router.events.forEach((event) => {
            if(event instanceof NavigationStart){
            }
            if(event instanceof NavigationEnd) {
                window.scrollTo(0,0);
                var mytitle = this.getDeepestTitle(router.routerState.snapshot.root);
                if(typeof mytitle !== 'undefined'){
                    title.setTitle(mytitle);
                }
                
                
                //ToDo: add last called timer so we don't call this if lots of quick routes.
                //ToDo: Add Timer for how long session is valid and display alert 1 minute to end
                //ToDo: This responds with session info like if you are authorized. I think it can be ignore.
                if(this.first==1){
                    this.first = null;
                    /* ToDo: load files example
                    this.normhttp.get('/json/overview.txt')
                    .subscribe(response=> {                    
                        cache.putCache('overview',response.text());
                    });
                    */
                }
            }
            if(event instanceof NavigationStart){               
            }
            //NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized
        });
    }

    private getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
        var title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
        if(routeSnapshot.firstChild){
            title = this.getDeepestTitle( routeSnapshot.firstChild ) || title;
        }
        return title;
    }
}