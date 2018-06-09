import { Component, OnInit, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTText } from '../FTFramework/FT-Text';


@Component({
  moduleId: module.id,
  selector: 'ft-home',
  templateUrl: '../../html/routes/home.html'
})

export class FTHome {
  zone: NgZone;   
  name = 'FinTechToken';
  texts = [];
   
  constructor( private observer: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http, private text: FTText  )
  { 
    this.setText();
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }
  
  ngOnInit(): void{
  }    

  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }

  isSignedIn() {
    return this.observer.getObserverValue('isSignedIn');
  }

  isPreviousUser() {
    return this.observer.getObserverValue('isPreviousUser');
  }

  private setText() {
    this.texts['home.Hero1'] = this.text.getText('home.Hero1');
    this.texts['home.Hero2'] = this.text.getText('home.Hero2');
    this.texts['home.Hero3'] = this.text.getText('home.Hero3');
    this.texts['home.Hero3Head'] = this.text.getText('home.Hero3Head');
    this.texts['home.Hero4'] = this.text.getText('home.Hero4');
    this.texts['home.startButton'] = this.text.getText('home.startButton');
    this.texts['home.startButtonUser'] = this.text.getText('home.startButtonUser');
    this.texts['home.startButtonAccount'] = this.text.getText('home.startButtonAccount');
    this.texts['home.StickImageURL'] = this.text.getText('home.StickImageURL');
    this.texts['home.explainationImageURL'] = this.text.getText('home.explainationImageURL');
    this.texts['home.explainationImageHeader1'] = this.text.getText('home.explainationImageHeader1');
    this.texts['home.explainationImageHeader1URL'] = this.text.getText('home.explainationImageHeader1URL');
    this.texts['home.explainationWhatWeDo1'] = this.text.getText('home.explainationWhatWeDo1');
    this.texts['home.explainationImageHeader2'] = this.text.getText('home.explainationImageHeader2');
    this.texts['home.explainationImageHeader2URL'] = this.text.getText('home.explainationImageHeader2URL');
    this.texts['home.explainationWhatWeDo2'] = this.text.getText('home.explainationWhatWeDo2');
    this.texts['home.valueProblem1'] = this.text.getText('home.valueProblem1');
    this.texts['home.valueSolution1'] = this.text.getText('home.valueSolution1');
    this.texts['home.valueProblem2'] = this.text.getText('home.valueProblem2');
    this.texts['home.valueSolution2'] = this.text.getText('home.valueSolution2');
    this.texts['home.valueProblem3'] = this.text.getText('home.valueProblem3');
    this.texts['home.valueSolution3'] = this.text.getText('home.valueSolution3');
    this.texts['home.ScenarioImageURL1a'] = this.text.getText('home.ScenarioImageURL1a');
    this.texts['home.ScenarioImageURL1b'] = this.text.getText('home.ScenarioImageURL1b');
    this.texts['home.ScenarioImageURL2a'] = this.text.getText('home.ScenarioImageURL2a');
    this.texts['home.ScenarioImageURL2b'] = this.text.getText('home.ScenarioImageURL2b');
    this.texts['home.ScenarioImageURL3a'] = this.text.getText('home.ScenarioImageURL3a');
    this.texts['home.ScenarioImageURL3b'] = this.text.getText('home.ScenarioImageURL3b');
  }
}
