declare var scaleVideoContainer: any;
declare var Web3: any;
declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;

import { Component, trigger, state, style, transition, animate, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-testnet',
  templateUrl: '../../html/testnet.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTTestNet {
  zone: NgZone;   
  name = 'FinTechToken';
  visibility="hiddenss";
  modal = 0;
  subscription;
  blocknumber;
  account;
  account1="442530d86b60d2c6ab8dc0fcece60082a5ad0252";
  accountBalance1;
  accountBalance; 
  seconds = 0;

  FreeToken = {
    mine:0,
    supply:0,
    out:0,
    contract:{} as any,
    address: '',
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any
  }

  constructor( private bus: FTBus, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http, private ref: ChangeDetectorRef )
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
  
  ngOnInit(): void{ 
      scaleVideoContainer();
      let els = document.getElementsByClassName("modal-body");
      let x=(window.innerHeight-1)*1-100;
      for(let i = 0; i < els.length; i++)
      {
         let el:HTMLElement = els[i] as HTMLElement;
         el.style.height=x*.75+'px';
      }
      if(!window.FT || !window.FT.wb3 || !window.FT.key || !window.FT.encrypted_id || window.FT.key === null || window.FT.encrypted_id === null){
        this.router.navigate(['/authenticate']);
      } else {
        window.FT.wb3.eth.getBlockNumber().then( (bn) => {this.blocknumber = bn;});
        this.account = window.FT.encrypted_id.address;
        window.FT.wb3.eth.getBalance(this.account).then( (balance) => {
          this.accountBalance = window.FT.wb3.utils.fromWei(balance,'ether'); 
        });
        window.FT.wb3.eth.getBalance(this.account1).then( (balance) => {
          this.accountBalance1 = window.FT.wb3.utils.fromWei(balance,'ether'); 
        });
        this.FreeToken.address = '0x9287bb21719d283CfdD7d644a89E8492f9845B64';
        this.FreeToken.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
        this.FreeToken.contract = new window.FT.wb3.eth.Contract(this.FreeToken.abi, this.FreeToken.address, {
          from: window.FT.encrypted_id.address, // default from address
          gasPrice: '0' // default gas price in wei
        });
        this.FreeToken.contract.methods.balanceOf(window.FT.encrypted_id.address).call().then( result => this.FreeToken.mine = window.FT.wb3.utils.fromWei(result, 'ether'));
        this.FreeToken.contract.methods.totalOutstanding().call().then( result => this.FreeToken.out = window.FT.wb3.utils.fromWei(result, 'ether'));
        this.FreeToken.contract.methods.totalSupply().call().then( result => this.FreeToken.supply = window.FT.wb3.utils.fromWei(result, 'ether'));

        this.subscription = window.FT.wb3.eth.subscribe('newBlockHeaders', (error, result) => {})
        .on("data", (blockHeader) => { 
          this.seconds = 0;
          this.blocknumber = blockHeader.number;
          window.FT.wb3.eth.getBalance(this.account).then( (balance) => {
            this.accountBalance = window.FT.wb3.utils.fromWei(balance,'ether'); 
          });
          window.FT.wb3.eth.getBalance(this.account1).then( (balance) => {
            this.accountBalance1 = window.FT.wb3.utils.fromWei(balance,'ether'); 
          });
          this.FreeToken.contract.methods.balanceOf(window.FT.encrypted_id.address).call().then( result => this.FreeToken.mine = window.FT.wb3.utils.fromWei(result, 'ether'));
          this.FreeToken.contract.methods.totalOutstanding().call().then( result => this.FreeToken.out = window.FT.wb3.utils.fromWei(result, 'ether'));
        });
        var interval = setInterval( () => {this.seconds += 1;}, 1000);
      }
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
    if(modal == 2) {
      let privateKey = Buffer.from(rlp.stripHexPrefix(window.FT.key), 'hex');
      let ABIdata = this.FreeToken.contract.methods.getFreeToken().encodeABI();
      let chainId = "913945103463586943";
      window.FT.wb3.eth.getTransactionCount(window.FT.encrypted_id.address).then( nonce => {
          const txData = {
              nonce:    numberToHex(nonce),
              gasPrice: '0x00',
              gasLimit: numberToHex(500000),
              to:       this.FreeToken.address,
              value:    '0x00',
              data:     ABIdata,
              chainId:  chainId.toString()
          }
          var tx = new EthJS.Tx(txData);
          tx.sign(privateKey);
          this.FreeToken.serializedTx = tx.serialize();
          this.FreeToken.receipt = null;
          this.FreeToken.transaction = '';
          this.FreeToken.confirmed = 0;
          return null;
      });
    }
    if(modal == 3) {
      this.getFreeToken();
    }
  }

  getFreeToken(): void{
    if(this.FreeToken.subscription){
      this.FreeToken.subscription.removeAllListeners();
    }
    this.FreeToken.subscription = window.FT.wb3.eth.sendSignedTransaction('0x' + this.FreeToken.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.FreeToken.transaction = hash; })
    .once('receipt', (receipt) =>{ this.FreeToken.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.FreeToken.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); })
  }

  onResize(event: any):void{
      scaleVideoContainer();
  }
  ngAfterViewInit(): void{
  } 

  ngDoCheck(): void{
  }
  ngOnDestry(){
    this.subscription.unsubscribe();
  }

// unsubscribes the subscription
/*
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
*/

}
