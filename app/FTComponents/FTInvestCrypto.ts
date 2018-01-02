declare var scaleVideoContainer: any;
import { Component, trigger, state, style, transition, animate, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-investcrypto',
  templateUrl: '../../html/investcrypto.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTInvestCrypto {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  tabs=1;
  subtabs=1;
  tutorial=1;
  modal=0;
  private subscribeParam: any;
   
  constructor( private bus: FTBus, private router: Router, private route: ActivatedRoute, private session: FTSession, public cache: FTCache, private http:Http )
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
  changeTabs(tab:number): void{
    if(tab === 1){
      this.tabs = 1;
      //this.router.navigate(['/market']);
    } else if(tab === 2){
      this.tabs = 2;
      //this.router.navigate(['/market', 'tutorial']);
    } else if(tab === 3){
      this.tabs = 3;
      //this.router.navigate(['/market', 'about'])
    }
    document.getElementById('tutorial').scrollTop = 0;
  }
  changeSubTabs(tab:number): void{
    this.subtabs = tab;
    document.getElementById('tutorial').scrollTop = 0;
  }
  Tutorial(tab:number): void{
    this.tutorial = tab;
    document.getElementById('tutorial').scrollTop = 100;
  }
  showModal(modal:number): void{
    this.modal = modal;
  }  
  ngOnInit(): void{ 
      this.subscribeParam = this.route.params.subscribe(params => {
        /*if(params['id'] === 'about'){
          this.tabs = 3;
          if(params['id2'] === 'trade'){
            this.subtabs = 2;
          } else if(params['id2'] === 'open'){
            this.subtabs = 3;
          } else if(params['id2'] === 'money'){
            this.subtabs = 4;
          } else {
              this.subtabs = 1;
          }
        } else if(params['id'] === 'tutorial'){
          this.tabs = 2;
        } else{
          this.tabs = 1;
        }*/
      });
      scaleVideoContainer();
      //let vid:any = document.getElementById("video");
      //vid.playbackRate = .7;
  }    

  onResize(event: any):void{
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
