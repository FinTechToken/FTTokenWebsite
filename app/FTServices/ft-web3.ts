declare var Web3: any;
declare var web3: any;

import { Injectable }     from '@angular/core';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTObserver } from '../FTFramework/FT-Observer';

@Injectable()
export class FTWeb3 {
    private nets:string[]=[];
    private currentNetSeconds = 0;
    private interval;
    private currentNetName: string;

    constructor ( private cache: FTCache, private obs: FTObserver ) { 
        if(typeof web3 !== 'undefined'){
            this.nets['existing'] = web3.currentProvider;
        }
        this.nets['testnet'] = 'wss://testmarket.fintechtoken.com';

        this.interval  = setInterval( () => {
            this.currentNetSeconds += 1;
            this.obs.putObserver('blockSeconds', this.currentNetSeconds);
        }, 1000); 
    }
    
    initializeWeb3(): void{
        if (typeof web3 !== 'undefined') {
            //Todo: use on realnet: this.setWeb3('existing');
            this.setWeb3('testnet');
        } 
        else {
            this.setWeb3('testnet');
        }
    }

    getWeb3Name(): string {
        return this.currentNetName;
    }

    setWeb3( netName ): void {
        let newWeb3 = this.setProvider( netName );
        this.currentNetName = netName;
        /* Currently we put wb3 instance in cache so any component can use it.
        Might be better to create functions in this service. 
        That way we have one place to update things like send transaction when we add BitCoin, LiteCoin, Monero, etc etc */
        this.cache.putCache('wb3', newWeb3);
        this.configureBlock( newWeb3 );
    }

    private setProvider( netName ): void {
        let FTweb3 = new Web3();
        FTweb3.setProvider(new FTweb3.providers.WebsocketProvider(this.nets[netName]));
        return FTweb3;
    }

    private configureBlock( newWeb3 ): void {
        newWeb3.eth.getBlockNumber()
        .then( (bn) => {
            this.obs.putObserver('block', bn);
        });
        newWeb3.eth.subscribe('newBlockHeaders', (error, result) => {})
        .on("data", (blockHeader) => { 
            this.obs.putObserver('block', blockHeader.number);
            this.currentNetSeconds = 0;
            this.obs.putObserver('blockSeconds', 0);
        });
    }

}
