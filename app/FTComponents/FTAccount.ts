declare var scaleVideoContainer: any;
import { Component, trigger, state, style, transition, animate, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-account',
  templateUrl: '../../html/account.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTAccount {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  modal = 0;
  subscribeParam;
  encrypted_id;
  key;
   
  constructor( private bus: FTBus, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http )
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
      this.modal = modal;
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
    scaleVideoContainer();
  }    

  onResize(event: any):void {
    scaleVideoContainer();
  }

  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }

  ngOnDestry(){
    this.subscribeParam.unsubscribe();
  }
}
