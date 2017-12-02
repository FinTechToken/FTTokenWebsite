declare var scaleVideoContainer: any;
declare var Web3: any;
declare var sjcl: any;

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from './FTFramework/FT-Bus';
import { FTCache } from './FTFramework/FT-Cache';
import { FTSession } from './FTFramework/FT-Session';
import { FTObserver } from './FTFramework/FT-Observer';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: '../html/app.component.html',
})

export class AppComponent {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  blocknumber=0;
  seconds=0;
  subscription;
  myRouter;

  constructor( private bus: FTBus, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, public cache: FTCache, private http:Http )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
    this.bus.getBus()
    .subscribe(res => {
    });
  }
  
  ngOnInit(): void{ 
    this.myRouter = this.router;
    if (typeof web3 !== 'undefined') {
      // this.wb3 = new Web3(web3.currentProvider); ToDo: use on realnet
      var web3 = new Web3();
      web3.setProvider(new web3.providers.WebsocketProvider('wss://testmarket.fintechtoken.com'));
      this.cache.putCache('wb3',web3);
    } else {
      var web3 = new Web3();
      web3.setProvider(new web3.providers.WebsocketProvider('wss://testmarket.fintechtoken.com'));
      this.cache.putCache('wb3',web3);
    }
    this.cache.putCache('encrypted_id', JSON.parse(localStorage.getItem('encrypted_id')));
    if(window.sessionStorage.getItem('k')){
      var decryptedKey = sjcl.decrypt(this.cache.getCache('encrypted_id').address, window.sessionStorage.getItem('k'));
      this.cache.putCache('key',decryptedKey);
    }
    this.cache.getCache('wb3').eth.getBlockNumber()
    .then( (bn) => {
      this.obs.putObserver('block', bn);
      this.obs.getObserver('block')
      .forEach( (bn) => {
        this.blocknumber = bn;
      });
    });
    this.subscription = this.cache.getCache('wb3').eth.subscribe('newBlockHeaders', (error, result) => {})
    .on("data", (blockHeader) => { 
      this.obs.putObserver('block', blockHeader.number);
      this.seconds = 0;
    });
    var interval = setInterval( () => {
      this.seconds += 1;
      this.obs.putObserver('blockSeconds', this.seconds);
    }, 1000);

    scaleVideoContainer();
  }    

  showBlocks(): void{
    let t = document.getElementById('blockID').offsetTop;
    let l = document.getElementById('blockID').offsetLeft;
    document.getElementById('blockIDdrop').style.transform = 'translate(' + (l-100) + 'px,' + (t+50) + 'px)';
    document.getElementById('blockIDdrop').classList.toggle('show');
  }

  showAlerts(): void{
    let t = document.getElementById('alertID').offsetTop;
    let l = document.getElementById('alertID').offsetLeft;
    document.getElementById('alertIDdrop').style.transform = 'translate(' + (l-150) + 'px,' + (t+50) + 'px)';
    document.getElementById('alertIDdrop').classList.toggle('show');
  }

  showAccounts(): void{
    let t = document.getElementById('accountID').offsetTop;
    let l = document.getElementById('accountID').offsetLeft;
    document.getElementById('accountIDdrop').style.transform = 'translate(' + (l-125) + 'px,' + (t+50) + 'px)';
    document.getElementById('accountIDdrop').classList.toggle('show');
  }

  onResize(event: any):void{
    scaleVideoContainer();
  }
  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }
  
  ngOnDestroy(){
    this.obs.deleteObserver('blockSeconds');
    this.obs.deleteObserver('block');
    this.subscription.unsubscribe();
  }
}
