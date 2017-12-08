declare var scaleVideoContainer: any;
declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;
declare var BigNumber: any;
import { Component, trigger, state, style, transition, animate, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTBus } from '../FTFramework/FT-Bus';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-my-account',
  templateUrl: '../../html/myaccount.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTMyAccount {
  zone: NgZone;   
  name = "FinTechToken";
  visibility="hiddenss";
  modal = 0;
  modalNumber = {
    show: false,
    number: "0",
    orig: "0",
    max: "0"
  };
  modalPrice = {
    show: false,
    number: "0",
    orig: "0",
    max: "0"
  };
  subscribeParam;
  subscribeBlock;
  subscribeBook;
  subscribeBookSell;
  accountBalance:string="";
  subscribeBNSec;
  wb3;
  tabs = 1;
  minerAccount="442530d86b60d2c6ab8dc0fcece60082a5ad0252";
  contractDeployer="45911570C2B6e298e53e0bB132783f7305394d78";
  zero="0000000000000000000000000000000000000000";
  fromAddress="0000000000000000000000000000000000000000";
  number:string;
  seconds: 0;
  maxGas = 500000;
  bookEther = "0";
  bookTokenEther = "0";
  book = new Map();
  bookToken = new Map();
  // keyAddress, new Map() keyAmount {Count and fee}

  depositAmount="0";
  withdrawAmount="0";
  depositEtherAmount="0";
  withdrawEtherAmount="0";
  buyToken="0";
  buyPrice="0";
  sellToken="0";
  sellPrice="0";
  FreeToken = {
    mine:'0',
    supply:0,
    out:0,
    contract:{} as any,
    estimate:0,
    error:'',
    address: "9287bb21719d283CfdD7d644a89E8492f9845B64",
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any
  }
  oldMarketAddres = '75c56AF6F8a60aD4c53E8E149716e1D1B2541f56';
  oldMarketAddress2 = '636c66037Be0DD8A23dcd83908b9AC9219Fe84C1';
  Market = {
    ether:"0",
    free:"0",
    supply:0,
    out:0,
    estimate:0,
    error:'',
    contract:{} as any,
    address: 'a0B71a29998790a84ee459132D1c87AcD4dF0E6e',
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any
  }
   
  constructor( private bus: FTBus, private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http, private cd: ChangeDetectorRef )
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
  
  openModalNumber(number: string, max: string): void {
    this.modalNumber.number = number;
    this.modalNumber.orig = number;
    if(max != "") {
      this.modalNumber.max = max;
    } else {
      this.modalNumber.max = "0";
    }
    this.modalNumber.show = true;
  }

  updateModalNumber(): void {
    let newNum = (document.getElementById('modalNumberEther') as HTMLFormElement).value;
    if( +newNum >= 0 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.getEther(this.modalNumber.number);
      return;
    }
    let oldNumber = this.modalNumber.number;
    if( +newNum != this.getEther(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getEther(this.modalNumber.number).toString(),"1000000000000000000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalNumberFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.getFinney(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getFinney(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getFinney(this.modalNumber.number).toString(),"1000000000000000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalNumberSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.getSzabo(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getSzabo(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getSzabo(this.modalNumber.number).toString(),"1000000000000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000000000000"));
    }
    newNum = (document.getElementById('modalNumberGwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.getGwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getGwei(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getGwei(this.modalNumber.number).toString(),"1000000000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000000000"));
    }
    newNum = (document.getElementById('modalNumberMwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.getMwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getMwei(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getMwei(this.modalNumber.number).toString(),"1000000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000000"));
    }
    newNum = (document.getElementById('modalNumberKwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.getKwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getKwei(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.multiplyBigNumber(this.getKwei(this.modalNumber.number).toString(),"1000"));
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, this.multiplyBigNumber(newNum, "1000"));
    }
    newNum = (document.getElementById('modalNumberWei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.getWei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.getWei(this.modalNumber.number)) {
      this.modalNumber.number = this.subtractBigNumber(this.modalNumber.number, this.getWei(this.modalNumber.number).toString());
      this.modalNumber.number = this.addBigNumber(this.modalNumber.number, newNum);
    }
    if(this.modalNumber.max != "0") {
      if(this.compareBigNumber(this.modalNumber.number, this.modalNumber.max)==1){
        this.modalNumber.number = oldNumber;
        (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.getEther(this.modalNumber.number);
        (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.getFinney(this.modalNumber.number);
        (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.getSzabo(this.modalNumber.number);
        (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.getGwei(this.modalNumber.number);
        (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.getMwei(this.modalNumber.number);
        (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.getKwei(this.modalNumber.number);
        (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.getWei(this.modalNumber.number);
      }
    }
  }

  closeModalNumber(number: string): void {
    this.modalNumber.show = false;
    this.obs.getObserver('modalNumber').next(number);
    this.obs.deleteObserver('modalNumber');
    this.modalNumber.number = "0";
    this.modalNumber.orig = "0";
    this.modalNumber.max = "0";
  }

  openModalPrice(number: string, max: string): void {
    this.modalPrice.number = number;
    this.modalPrice.orig = number;
    if(max != "") {
      this.modalPrice.max = max;
    } else {
      this.modalPrice.max = "0";
    }
    this.modalPrice.show = true;
  }

  updateModalPrice(): void {
    let newNum = (document.getElementById('modalPriceEther') as HTMLFormElement).value;
    if( +newNum >= 0 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.getEther(this.modalPrice.number);
      return;
    }
    let oldNumber = this.modalPrice.number;
    if( +newNum != this.getEther(this.modalPrice.number)) {
      this.modalPrice.number = this.subtractBigNumber(this.modalPrice.number, this.multiplyBigNumber(this.getEther(this.modalPrice.number).toString(),"1000000000000000000"));
      this.modalPrice.number = this.addBigNumber(this.modalPrice.number, this.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalPriceFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.getFinney(this.modalPrice.number);
      return;
    }
    if( +newNum != this.getFinney(this.modalPrice.number)) {
      this.modalPrice.number = this.subtractBigNumber(this.modalPrice.number, this.multiplyBigNumber(this.getFinney(this.modalPrice.number).toString(),"1000000000000000"));
      this.modalPrice.number = this.addBigNumber(this.modalPrice.number, this.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalPriceSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.getSzabo(this.modalPrice.number);
      return;
    }
    if( +newNum != this.getSzabo(this.modalPrice.number)) {
      this.modalPrice.number = this.subtractBigNumber(this.modalPrice.number, this.multiplyBigNumber(this.getSzabo(this.modalPrice.number).toString(),"1000000000000"));
      this.modalPrice.number = this.addBigNumber(this.modalPrice.number, this.multiplyBigNumber(newNum, "1000000000000"));
    }
    if(this.modalPrice.max != "0") {
      if(this.compareBigNumber(this.modalPrice.number, this.modalPrice.max)==1){
        this.modalPrice.number = oldNumber;
        (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.getEther(this.modalPrice.number);
        (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.getFinney(this.modalPrice.number);
        (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.getSzabo(this.modalPrice.number);
      }
    }
  }

  closeModalPrice(number: string): void {
    this.modalPrice.show = false;
    this.obs.getObserver('modalPrice').next(number);
    this.obs.deleteObserver('modalPrice');
    this.modalPrice.number = "0";
    this.modalPrice.orig = "0";
    this.modalPrice.max = "0";
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

  viewNumber(number: string): void {
      this.number = number;
      this.showModal(1);
  }

  addBigNumber(numberA: string, numberB: string): string {
    let x = new BigNumber(numberA);
    let y = new BigNumber(numberB);
    return x.plus(y).toString(10);
  }
  subtractBigNumber(numberA: string, numberB: string): string {
    let x = new BigNumber(numberA);
    let y = new BigNumber(numberB);
    return x.minus(y).toString(10);
  }
  divideBigNumber(numberA: string, numberB: string): string {
    if(numberA == ""){
      numberA="0";
    }
    if(numberB == ""){
      numberB="0"
    }
    let x = new BigNumber(numberA);
    let y = new BigNumber(numberB);
    return x.dividedToIntegerBy(y).toString(10);
  }
  multiplyBigNumber(numberA: string, numberB: string): string {
    if(numberA == ""){
      numberA = "0";
    }
    if(numberB == ""){
      numberB = "0";
    }
    let x = new BigNumber(numberA);
    let y = new BigNumber(numberB);
    return x.times(y).toString(10);
  }
  compareBigNumber(numberA: string, numberB: string): number {
    let x = new BigNumber(numberA);
    let y = new BigNumber(numberB);
    if(x.lessThan(y)){
      return -1;
    }
    if(x.greaterThan(y)){
      return 1;
    }
    if(x.equals(y)){
      return 0;
    }
    return -2;
  }

  getEther(number:string): number{
    if(number.length > 18){
      return +number.substr(0,number.length-18);
    }
    else {
      return 0;
    }
  }
  hasFraction(number: string): boolean{
    if(number.length > 18){
      number = number.substr(number.length-18,18);
      let number1 = number.substr(0, 3);
      if(+number1 != 0){
        return true
      }
      number = number.substr(3,15);
    }
    if(+number != 0) {
      return true;
    }
    return false;
  }

  getFinney(number: string): number{
    if(number.length > 18){
      number = number.substr(number.length-18, 18);
    }
    if(number.length > 15){
      return +number.substr(0,number.length-15);
    } else {
      return 0;
    }
  }
  getSzabo(number: string): number{
    if(number.length > 15){
      number = number.substr(number.length-15, 15);
    }
    return Math.floor(this.wb3.utils.fromWei(number, 'szabo'));
  }
  getGwei(number: string): number{
    if(number.length > 12){
      number = number.substr(number.length-12, 12);
    }
    return Math.floor(this.wb3.utils.fromWei(number, 'gwei'));
  }
  getMwei(number: string): number{
    if(number.length > 9){
      number = number.substr(number.length-9, 9);
    }
    return Math.floor(this.wb3.utils.fromWei(number, 'mwei'));
  }
  getKwei(number: string): number{
    if(number.length > 6){
      number = number.substr(number.length-6, 6);
    }
    return Math.floor(this.wb3.utils.fromWei(number, 'kwei'));
  }
  getWei(number: string): number{
    if(number.length > 3){
      number = number.substr(number.length-3, 3);
    }
    return Math.floor(this.wb3.utils.fromWei(number, 'wei'));
  }

  ngOnInit(): void{
    // debugger 
    if(!this.cache.getCache('key')){
      this.router.navigate(['/authenticate']);
    }
    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the block that is passed in route
    });
    this.subscribeBNSec = this.obs.getObserver('blockSeconds').subscribe( (bnsec) => {
      this.seconds = bnsec;
    });
    this.fromAddress = this.cache.getCache('encrypted_id').address;
    scaleVideoContainer();
    this.wb3 = this.cache.getCache('wb3');
    this.FreeToken.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    this.FreeToken.contract = new this.wb3.eth.Contract(this.FreeToken.abi, '0x'+this.FreeToken.address, {
      from: '0x' + this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });

    this.Market.abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event"}];
    this.Market.contract = new this.wb3.eth.Contract(this.Market.abi, '0x' + this.Market.address, {
      from: '0x'+this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
  }    
  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  onResize(event: any):void {
    scaleVideoContainer();
  }

  getTokensOfBook() {
    return Array.from(this.book.keys());
  }

  getPricesOfTokenBook(token: string) {
    return Array.from(this.book.get(token).keys());
  }

  getTokensSellOfBook() {
    return Array.from(this.bookToken.keys());
  }

  getPricesSellOfTokenBook(token: string) {
    return Array.from(this.bookToken.get(token).keys());
  }


    ngAfterViewInit(): void{
    this.wb3.eth.getBalance(this.fromAddress).then( (balance) => {
      this.accountBalance = balance.toString(); 
    });
    this.FreeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
      result => {
        this.FreeToken.mine = result.toString();
      }
    );
    this.Market.contract.methods.accountBalance(this.zero,this.fromAddress).call().then( 
      result => this.Market.ether = result
    );
    this.Market.contract.methods.accountBalance(this.FreeToken.address, this.fromAddress).call().then( 
      result => this.Market.free = result.toString()
    );

    this.subscribeBook = this.Market.contract.events.MessageOffer({
      filter: {mAccount: this.fromAddress}, 
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      if(events.returnValues.mBuy){
        let x = this.multiplyBigNumber(events.returnValues.mPrice, events.returnValues.mCount);
        x = this.divideBigNumber(x, "1000000");
        x = this.addBigNumber(x, events.returnValues.mFee);
        if(this.book.has(events.returnValues.mToken)){
          if(this.book.get(events.returnValues.mToken).has(events.returnValues.mPrice)){
            if(events.returnValues.mAddLiquidity){
              let newCount = this.addBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              let newFee = this.addBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).fee, events.returnValues.mFee);
              this.book.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: newFee});  
            } else {
              let newCount = this.subtractBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              let newFee = this.subtractBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).fee, events.returnValues.mFee);
              this.book.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: newFee});  
              if(newCount != "0" || newFee != "0") {
              } else {
                this.book.get(events.returnValues.mToken).delete(events.returnValues.mPrice);
                if(this.book.get(events.returnValues.mToken).size == 0){
                  this.book.delete(events.returnValues.mToken);
                }
              }
            }
          } else{
            this.book.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: events.returnValues.mCount, fee: events.returnValues.mFee});
          }
        } else {
          this.book.set(events.returnValues.mToken, new Map());
          this.book.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: events.returnValues.mCount, fee: events.returnValues.mFee});
        }
        if(events.returnValues.mAddLiquidity){
          this.bookEther = this.addBigNumber(this.bookEther,x);
        } else {
          this.bookEther = this.subtractBigNumber(this.bookEther,x);
        }
      }
      if(!events.returnValues.mBuy){
        let x = events.returnValues.mCount;
        if(this.bookToken.has(events.returnValues.mToken)){
          if(this.bookToken.get(events.returnValues.mToken).has(events.returnValues.mPrice)){
            if(events.returnValues.mAddLiquidity){
              let newCount = this.addBigNumber(this.bookToken.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              this.bookToken.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: "0"});  
            } else {
              let newCount = this.subtractBigNumber(this.bookToken.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              this.bookToken.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: "0"});  
              if(newCount != "0") {
              } else {
                this.bookToken.get(events.returnValues.mToken).delete(events.returnValues.mPrice);
                if(this.bookToken.get(events.returnValues.mToken).size == 0){
                  this.bookToken.delete(events.returnValues.mToken);
                }
              }
            }
          } else{
            this.bookToken.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: events.returnValues.mCount, fee: "0"});
          }
        } else {
          this.bookToken.set(events.returnValues.mToken, new Map());
          this.bookToken.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: events.returnValues.mCount, fee: "0"});
        }
        if(events.returnValues.mAddLiquidity){
          this.bookTokenEther = this.addBigNumber(this.bookTokenEther,x);
        } else {
          this.bookTokenEther = this.subtractBigNumber(this.bookTokenEther,x);
        }
      }
      this.cd.markForCheck();
    });

    this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
      this.wb3.eth.getBalance(this.fromAddress).then( (balance) => {
        this.accountBalance = balance.toString();
      });
      this.FreeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
        (result) => this.FreeToken.mine = result == 0 ? '0' : result.toString()
      );
      this.Market.contract.methods.accountBalance(this.zero,this.fromAddress).call().then( 
        (result) => this.Market.ether = result == 0 ? '0' : result
      );
      this.Market.contract.methods.accountBalance(this.FreeToken.address, this.fromAddress).call().then( 
        (result) => this.Market.free = result == 0 ? '0' : result.toString()
      );
    });

  } 

  ngDoCheck(): void{
  }

  withdraw(notupdate: boolean): void{
    if(!notupdate){
      this.withdrawAmount = this.Market.free;
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.withdrawal('0x'+this.FreeToken.address,this.withdrawAmount).encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.withdrawal('0x'+this.FreeToken.address,this.withdrawAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });
    /*this.FreeToken.contract.methods.approveAndCall('0x'+this.Market.address,this.FreeToken.mine,'').estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });*/
    this.showModal(7);
  }

  changeWithdraw(){
    this.openModalNumber(this.withdrawAmount, this.Market.free);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.withdrawAmount = result;
      this.withdraw(true);
    });
  }

  approveWithdraw(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(8);
  }

  deposit(notupdate: boolean): void{
    if(!notupdate){
      this.depositAmount = this.FreeToken.mine;
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.FreeToken.contract.methods.approve('0x'+this.Market.address,this.depositAmount).encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.FreeToken.address,
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
        this.FreeToken.error = '';
        return null;
    });
    this.FreeToken.contract.methods.approve('0x'+this.Market.address,this.depositAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.FreeToken.estimate = returns;
    });
    /*this.FreeToken.contract.methods.approveAndCall('0x'+this.Market.address,this.FreeToken.mine,'').estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });*/
    this.showModal(4);
  }

  changeDeposit(){
    this.openModalNumber(this.depositAmount, this.FreeToken.mine);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.depositAmount = result;
      this.deposit(true);
    });
  }

  approveConfirm(): void{
    this.Market.estimate = 0;
    if(this.FreeToken.subscription){
      this.FreeToken.subscription.removeAllListeners();
    }
    this.FreeToken.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.FreeToken.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.FreeToken.transaction = hash; 
    })
    .once('receipt', (receipt) => { 
      this.FreeToken.receipt = receipt; 
      var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
      var ABIdata = this.Market.contract.methods.deposit('0x'+this.FreeToken.address,this.depositAmount).encodeABI();
      var chainId = "913945103463586943";
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
          const txData = {
              nonce:    numberToHex(nonce),
              gasPrice: '0x00',
              gasLimit: numberToHex(500000),
              to:       '0x' + this.Market.address,
              value:    '0x00',
              data:     ABIdata,
              chainId:  chainId.toString()
          }
          var tx = new EthJS.Tx(txData);
          tx.sign(privateKey);
          this.Market.serializedTx = tx.serialize();
          this.Market.receipt = null;
          this.Market.transaction = '';
          this.Market.confirmed = 0;
          this.Market.error = '';
          return null;
      });
      this.Market.contract.methods.deposit('0x'+this.FreeToken.address,this.depositAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
        this.Market.estimate = returns;
      });
    })
    .on('confirmation', (confNumber, receipt) => { this.FreeToken.confirmed = confNumber; 
    })
    .on('error', (error) => { console.log('ERROR' + error); this.FreeToken.error = error;})
    this.showModal(5);
  }

  depositConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(6);
  }

  depositEther(notupdate: boolean): void{    
    if(!notupdate){
      this.depositEtherAmount = this.subtractBigNumber(this.accountBalance,"100000000000000000");
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.deposit('0x' + this.zero, "0").encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    numberToHex(this.depositEtherAmount),
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.deposit('0x' + this.zero, "0").estimateGas({gas:500000,from:'0x'+this.fromAddress,value:this.depositEtherAmount}).then( (returns) => {
      this.Market.estimate = returns;
    });
    this.showModal(13);
  }

  changeEtherDeposit(): void{
    this.openModalNumber(this.depositEtherAmount, this.subtractBigNumber(this.accountBalance,"100000000000000000"));
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.depositEtherAmount = result;
      this.depositEther(true);
    });
  }

  depositEtherConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(14);
  }

  withdrawEther(notupdate: boolean): void{
    if(!notupdate){
      this.withdrawEtherAmount = this.Market.ether;
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.withdrawal('0x' + this.zero, this.withdrawEtherAmount).encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.withdrawal('0x' + this.zero, this.withdrawEtherAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });
    this.showModal(15);
  }
  
  changeEtherWithdraw(): void{
    this.openModalNumber(this.withdrawEtherAmount, this.Market.ether);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.withdrawEtherAmount = result;
      this.withdrawEther(true);
    });
  }

  withdrawEtherConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(16);
  }

  setCancelOffer(token: string, amount: string, buysell: boolean): void{
    // function cancelOffer( address _token, bool _buy, uint256 _amount ) public returns ( bool success_ ) {
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.cancelOffer(token, buysell, amount).encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.cancelOffer(token, buysell, amount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });
  }


  cancelOffer(): void{
    let token = this.book.keys().next().value;
    let price = this.book.get(token).keys().next().value;
    this.setCancelOffer(token, price, true);
    this.showModal(17);
  }

  cancelTokenOffer(): void{
    let token = this.bookToken.keys().next().value;
    let price = this.bookToken.get(token).keys().next().value;
    this.setCancelOffer(token, price, false);
    this.showModal(18);
  }


  cancelOfferConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(19);
  }


  signOut(): void{
    this.cache.deleteCache('key');
    window.sessionStorage.clear();
    this.router.navigate(['/authenticate']);
    this.showModal(0);
  }

  buy(): void{
    // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.makeOffer('0x' + this.FreeToken.address, true, this.buyPrice, this.buyToken, "0x00").encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.makeOffer('0x' + this.FreeToken.address, true, this.buyPrice, this.buyToken, "0x00").estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });
    this.showModal(9);
  }

  changeBuyToken(): void{
    // Todo: calculate max based on price (Also, limit fractions based on price)
    this.openModalNumber(this.buyToken, "0");
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.buyToken = result;
      this.buy();
    });
  }
  changeBuyPrice(): void{
    // Todo: calculate max based on Token (Also, limit fractions based on tokens)
    let buyPriceNew = this.multiplyBigNumber(this.buyPrice,"1000000000000");
    this.openModalPrice(buyPriceNew, "0");
    this.obs.getObserver('modalPrice').subscribe( (result) => {
      this.buyPrice = this.divideBigNumber(result,"1000000000000");
      this.buy();
    });
  }

  buyConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt;})
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(10);
  }

  sell(): void{
    // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.makeOffer('0x' + this.FreeToken.address, false, this.sellPrice, this.sellToken, "0x00").encodeABI();
    var chainId = "913945103463586943";
    this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: '0x00',
            gasLimit: numberToHex(500000),
            to:       '0x' + this.Market.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.Market.serializedTx = tx.serialize();
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
    });
    this.Market.contract.methods.makeOffer('0x' + this.FreeToken.address, false, this.sellPrice, this.sellToken, "0x00").estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });
    this.showModal(11);
  }

  changeSellToken(): void{
    // Todo: calculate max based on price (Also, limit fractions based on price)
    this.openModalNumber(this.sellToken, "0");
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.sellToken = result;
      this.sell();
    });
  }
  changeSellPrice(): void{
    // Todo: calculate max based on Token (Also, limit fractions based on tokens)
    let sellPriceNew = this.multiplyBigNumber(this.sellPrice,"1000000000000");
    this.openModalPrice(sellPriceNew, "0");
    this.obs.getObserver('modalPrice').subscribe( (result) => {
      this.sellPrice = this.divideBigNumber(result,"1000000000000");
      this.sell();
    });
  }

  sellConfirm(): void{
    this.Market.estimate = 0;
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt;})
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(12);
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
    if(this.subscribeBlock){
      this.subscribeBlock.unsubscribe();
    }
    if(this.subscribeBNSec){
      this.subscribeBNSec.unsubscribe();
    }
    if(this.FreeToken.subscription){
      this.FreeToken.subscription.removeAllListeners();
    }
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    if(this.subscribeBook){
      this.subscribeBook.unsubscribe();
    }
    if(this.subscribeBookSell){
      this.subscribeBookSell.unsubscribe();
    }
  }
}
