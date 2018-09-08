declare var onResize:any;
import { Component, trigger, state, style, transition, animate, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-blockchain',
  templateUrl: '../../html/routes/blockchain.html',
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
  subscribeParam;
  tabs=1;
  collapse=0;
  texts = [];
  constructor( private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http, private text: FTText )
  {  
    this.setText();
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
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
    onResize();
  }

  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
  }

  getBlocknumber() {
    if(this.obs.getObserverValue('block') != "Connecting" && this.obs.getObserverValue('block') != "Not Connected")
      return this.obs.getObserverValue('block');
    else return 0;
  }

  changeCollapse(event: any, collapse:number): void {
    if(this.collapse == collapse)
      this.collapse = 0;
    else {
      this.collapse = collapse;
    }
  }

  changeTabs(tab:number): void{
    this.collapse = 0;
    this.tabs = tab;
    document.getElementsByClassName('setheighttab')[0].scrollTop = 0;
  }

  private setText() {
    this.texts['home.StickImageURL'] = this.text.getText('home.StickImageURL');
  }

  isSignedIn() {
    return this.obs.getObserverValue('isSignedIn');
  }

  isPreviousUser() {
    return this.obs.getObserverValue('isPreviousUser');
  }
}
