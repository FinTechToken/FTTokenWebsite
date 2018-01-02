declare var scaleVideoContainer: any;
import { Component, trigger, state, style, transition, animate, OnInit, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';

@Component({
  moduleId: module.id,
  selector: 'ft-aboutftt',
  templateUrl: '../../html/aboutftt.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTAboutFTT {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  tabs=1;
   
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
  changeTabs(tab:number): void{
    this.tabs = tab;
  }
  
  ngOnInit(): void{ 
      scaleVideoContainer();
  }    

  onResize(event: any):void{
      scaleVideoContainer();
  }
  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }
}
