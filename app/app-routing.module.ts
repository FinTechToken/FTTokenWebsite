declare var onResize: any;

import { NgModule, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, Routes, Router, NavigationEnd, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';

import { FTHome } from './FTRoutes/FThome';
import { FTBlockchain } from './FTRoutes/FTBlockchain';
import { FTCryptoPass } from './FTRoutes/FTCryptoPass';
import { FTMyAccount } from './FTRoutes/FTMyAccount';

import { FTMessagesOld } from './FTRoutes/FTMessagesOld';
import { FTMyAccountOld } from './FTRoutes/FTMyAccountOld';
import { FTTokenOld } from './FTRoutes/FTTokenOld';

const routes: Routes = [ {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path:'home',
        data: {title: 'FinTechToken - access all blockchains'},
        component: FTHome
    },
    {
        path:'crypto_pass',
        data: {title: 'Crypto pass is one wallet to get on any blockchain'},
        component: FTCryptoPass
    },
    {
        path:'blockchain',
        data: {title: 'Blockchains supported by FinTechToken'},
        component: FTBlockchain
    },
    {   //ToDo: Add direct link paths for search engine ranking
        path:'blockchain/:id',
        component: FTBlockchain
    },
    {
        path:'messagesOld',
        data: {title: 'Blockchain transactions and messages'},
        component: FTMessagesOld
    },
    {
        path:'messagesOld/:id',
        component: FTMessagesOld
    },
    {
        path:'tokenOld',
        data: {title: 'Blockchain tokens'},
        component: FTTokenOld
    },
    {
        path:'tokenOld/:id',
        data: {title: 'A blockchain token'},
        component: FTTokenOld
    },
    {
        path:'myaccount',
        data: {title: 'My FinTechToken account'},
        component: FTMyAccount
    },
    {
        path:'myaccountold',
        data: {title: 'My FinTechToken Old Account'},
        component: FTMyAccountOld
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
    //ToDo: add providers for GuardServices
})
export class AppRoutingModule {
    constructor( router: Router, title: Title ) {
        router.events.forEach((event) => {
            if(event instanceof NavigationEnd) {
                window.scrollTo(0,0);
                let mytitle = this.getDeepestTitle(router.routerState.snapshot.root);
                if(typeof mytitle !== 'undefined'){
                    title.setTitle(mytitle);
                }
                onResize();                
                //ToDo: Add Timer for how long session is valid and display alert 1 minute to end
            }
        });
    }

    private getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
        if(routeSnapshot.firstChild) {
            title = this.getDeepestTitle( routeSnapshot.firstChild ) || title;
        }
        return title;
    }
}