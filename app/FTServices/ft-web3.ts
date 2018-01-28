declare var Web3: any;
declare var web3: any;

import { Injectable }     from '@angular/core';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';

@Injectable()
export class FTWeb3 {
    private nets:string[]=[];
    private currentNetSeconds = 0;
    private interval = setInterval( () => {
        this.currentNetSeconds += 1;
        this.obs.putObserver('blockSeconds', this.currentNetSeconds);
    }, 1000); 

    constructor ( private cache: FTCache, private obs: FTObserver ) { 
        if(typeof web3 !== 'undefined'){
            this.nets['existing'] = web3.currentProvider;
        }
        this.nets['testnet'] = 'wss://testmarket.fintechtoken.com';
    }
    
    initializeWeb3(){
        if (typeof web3 !== 'undefined') {
            //Todo: use on realnet: this.setWeb3('existing');
            this.setWeb3('testnet');
        } 
        else {
            this.setWeb3('testnet');
        }
    }

    setWeb3( netName ) {
        let newWeb3 = this.setProvider( netName );
        this.cache.putCache('wb3', newWeb3);
        this.configureBlock( newWeb3 );
    }

    private setProvider( netName ) {
        let FTweb3 = new Web3();
        FTweb3.setProvider(new FTweb3.providers.WebsocketProvider(this.nets[netName]));
        return FTweb3;
    }

    private configureBlock( newWeb3 ) {
        newWeb3.eth.getBlockNumber()
        .then( (bn) => {
            this.obs.putObserver('block', bn);
        });
        newWeb3.eth.subscribe('newBlockHeaders', (error, result) => {})
        .on("data", (blockHeader) => { 
            this.obs.putObserver('block', blockHeader.number);
            this.currentNetSeconds = 0;
        });
    }

}
