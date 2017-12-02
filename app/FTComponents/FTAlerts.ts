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
  selector: 'ft-alerts',
  templateUrl: '../../html/alerts.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTAlerts {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  modal = 0;
  tabs = 1;
  subscribeParam;
  gotFree=false;
  fromAddress = "0000000000000000000000000000000000000000";
  wb3;

  FreeToken = {
    contract:{} as any,
    address: "9287bb21719d283CfdD7d644a89E8492f9845B64",
    abi:{} as any,
  }
  //OldMarket Address: 75c56AF6F8a60aD4c53E8E149716e1D1B2541f56
  Market = {
    free: '0',
    ether: '0',
    contract:{} as any,
    address: "a0B71a29998790a84ee459132D1c87AcD4dF0E6e",
    abi:{} as any,
  }


  constructor( private bus: FTBus, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, public cache: FTCache, private http:Http )
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
    
    if(this.cache.getCache('encrypted_id')){
      this.fromAddress = this.cache.getCache('encrypted_id').address;
    }
    this.wb3 = this.cache.getCache('wb3');
    this.FreeToken.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    this.FreeToken.contract = new this.wb3.eth.Contract(this.FreeToken.abi, '0x' + this.FreeToken.address, {
      from: '0x' + this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
    this.FreeToken.contract.methods.gotFree('0x'+this.fromAddress).call().then( (returns) => 
      this.gotFree = returns
    );

    this.Market.abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event"}];
    this.Market.contract = new this.wb3.eth.Contract(this.Market.abi, '0x' + this.Market.address, {
      from: '0x'+this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
    this.Market.contract.methods.accountBalance(this.FreeToken.address, this.fromAddress).call().then( 
      (result) => this.Market.free = result == 0 ? '0' : result.toString()
    );
    this.Market.contract.methods.accountBalance('0x', this.fromAddress).call().then( 
      (result) => this.Market.ether = result == 0 ? '0' : result.toString()
    );
  }    

  onResize(event: any):void {
    scaleVideoContainer();
  }
  changeTabs(tab:number): void{
    this.tabs = tab;
  }
  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }

  ngOnDestry(){
    this.subscribeParam.unsubscribe();
  }
}
