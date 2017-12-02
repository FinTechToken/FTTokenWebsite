declare var scaleVideoContainer: any;
import { Component, trigger, state, style, transition, animate, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-blockchain',
  templateUrl: '../../html/blockchain.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTBlockchain {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  blocknumber=0;
  seconds=0;
  subscribeParam;
  subscribeBN;
  subscribeBNSec;
  tabs=1;
   
  constructor( private bus: FTBus, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
    this.session.getSession('user_id').subscribe(
          res => {
            if(+res>0) {//Signed In
              this.zone.run(()=>{
              });    
            }
            else {//Signed Out
              this.zone.run(()=>{
              });
            }
          }
        );
        this.bus.getBus().subscribe(
          res => {
            if( res.sender == 'ToDo: SigninOpenModule'){
            }
            if( res.sender=='ToDo: SigninClose'){
            }
          }
        );
  }
  
  showModal(modal: number): void {
      let els = document.getElementsByClassName("modal-body");
      let x=(window.innerHeight-1)*1-100;
      for(let i = 0; i < els.length; i++)
      {
         let el:HTMLElement = els[i] as HTMLElement;
         el.style.height=x*.75+'px';
      }
  }
  ngOnInit(): void{ 
    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the block that is passed in route
    });
    this.subscribeBN = this.obs.getObserver('block')
    .subscribe( (bn) => {
      this.blocknumber = bn;
    });
    this.subscribeBNSec = this.obs.getObserver('blockSeconds')
    .subscribe( (bnsec) => {
      this.seconds = bnsec;
    });
    scaleVideoContainer();
  }

  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  onResize(event: any):void {
    scaleVideoContainer();
  }

  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
    this.subscribeBN.unsubscribe();
    this.subscribeBNSec.unsubscribe();
  }
}
