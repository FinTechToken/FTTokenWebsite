declare var onResize: any;

import { NgModule, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, Routes, Router, NavigationEnd, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';

import { FTHome } from './FTRoutes/FThome';
import { FTAuthenticate } from './FTRoutes/FTAuthenticate';
import { FTBlockchain } from './FTRoutes/FTBlockchain';
import { FTMyAccount } from './FTRoutes/FTMyAccount';
import { FTMessages } from './FTRoutes/FTMessages';
import { FTToken } from './FTRoutes/FTToken';

const routes: Routes = [ {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path:'home',
        data: {title: 'FinTechToken - a blockchain marketplace'},
        component: FTHome
    },
    {
        path:'authenticate',
        data: {title: 'Authenticate to get on the blockchain'},
        component: FTAuthenticate
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
        path:'messages',
        data: {title: 'Blockchain transactions and messages'},
        component: FTMessages
    },
    {
        path:'messages/:id',
        component: FTMessages
    },
    {
        path:'token',
        data: {title: 'Blockchain tokens'},
        component: FTToken
    },
    {
        path:'token/:id',
        data: {title: 'A blockchain token'},
        component: FTToken
    },
    {
        path:'myaccount',
        data: {title: 'My FinTechToken account'},
        component: FTMyAccount
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