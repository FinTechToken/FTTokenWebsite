declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;
declare var BigNumber: any;
import { Component, trigger, state, style, transition, animate, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';

import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTWeb3Service } from '../FTServices/ft-web3';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-my-account',
  templateUrl: '../../html/routes/myaccountold.html',
  animations: [trigger('visibilityChanged',[
    state('shownss',style({opacity:0,display:'none' })),
    state('hiddenss',style({opacity:1})),
    transition('*->*',animate('0s 0s')) //1s .25s would have a .25s delay
  ])]
})

export class FTMyAccountOld {
  objectKeys = Object.keys;
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
  accountBalance:string="0";
  tabs = 1;
  sellTabs = 1;
  buyTabs = 1;
  minerAccount="442530d86b60d2c6ab8dc0fcece60082a5ad0252";
  contractDeployer="45911570C2B6e298e53e0bB132783f7305394d78";
  zero="0000000000000000000000000000000000000000";
  fromAddress="0000000000000000000000000000000000000000";
  number:string;
  maxGas = "500000";
  gasPrice= "0";
  bookEther = "0";
  bookTokenEther = new Map();
  book = new Map();
  bookToken = new Map();
  // keyAddress, new Map() keyAmount {Count and fee}
  lastOffer = {
    token:"",
    amount: "",
    buysell: false
  }
  wb3;
  depositAmount="0";
  withdrawAmount="0";
  depositEtherAmount="0";
  withdrawEtherAmount="0";
  buyToken="0";
  buyPrice="0";
  sellToken="0";
  sellPrice="0";
  myTradesMap = {};
  // Tokens should be an array instead of hard code  
  FreeToken = {
    buyPrice: "",
    sellPrice: "",
    buyCount: "",
    sellCount: "",
    lastPrice: "",
    lastCount: "",
    sellMap: {},
    buyMap: {},
    tradeMap: {},
    name: 'FreeToken',
    mine:'0',
    supply:0,
    out:0,
    contract:{} as any,
    estimate:"0",
    error:'',
    address: "9287bb21719d283CfdD7d644a89E8492f9845B64",
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any,
    market: "0"
  }
  TradeToken = {
    buyPrice: "",
    sellPrice: "",
    buyCount: "",
    sellCount: "",
    lastPrice: "",
    lastCount: "",
    sellMap: {},
    buyMap: {},
    tradeMap: {},
    name: 'TradeToken',
    mine:'0',
    supply:0,
    out:0,
    contract:{} as any,
    estimate:"0",
    error:'',
    address: "2d5e86187855CC29B40469e8a7355f3fDBf4C088",
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any,
    market: "0"
  }
  currentToken= this.FreeToken;
  oldMarketAddres = '75c56AF6F8a60aD4c53E8E149716e1D1B2541f56';
  oldMarketAddress2 = '636c66037Be0DD8A23dcd83908b9AC9219Fe84C1';
  Market = {
    subscribeBook: null as any,
    subscribeTransactions: null as any,
    ether:"0",
    free:"0",
    trade:"0",
    supply:0,
    out:0,
    estimate:"0",
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
  tutorial = {
    address: "bd0450e4d268B2DC6EB42A579736Ae65b3bCcE3C",
    contract: {} as any,
    abi: [{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"bool"}],"name":"saveBool","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint32"}],"name":"saveUSmallInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"int128"}],"name":"saveLargeInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"bytes32"}],"name":"saveString","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"int256"}],"name":"saveXLargeInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getUSmallInt","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getUXLargeInt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint256"}],"name":"saveUXLargeInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getULargeInt","outputs":[{"name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"address"}],"name":"saveAddress","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getTinyInt","outputs":[{"name":"","type":"int16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getUInt","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint128"}],"name":"saveULargeInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getUTinyInt","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"int16"}],"name":"saveTinyInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"int32"}],"name":"saveSmallInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getInt","outputs":[{"name":"","type":"int64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getBool","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"int64"}],"name":"saveInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getXLargeInt","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint64"}],"name":"saveUInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getLargeInt","outputs":[{"name":"","type":"int128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getSmallInt","outputs":[{"name":"","type":"int32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"getString","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"bytes32"},{"name":"_value","type":"uint16"}],"name":"saveUTinyInt","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"bool"}],"name":"ChangeBool","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"bytes32"}],"name":"ChangeString","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"address"}],"name":"ChangeAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"ChangeUXLargeInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"ChangeXLargeInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint128"}],"name":"ChangeULargeInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"int128"}],"name":"ChangeLargeInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint64"}],"name":"ChangeUInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"int64"}],"name":"ChangeInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint32"}],"name":"ChangeUSmallInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"int32"}],"name":"ChangeSmallInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"uint16"}],"name":"ChangeUTinyInt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"key","type":"bytes32"},{"indexed":false,"name":"value","type":"int16"}],"name":"ChangeTinyInt","type":"event"}] as any,
    serializedTx:{} as any,
    state: 0 as number,
    stateKey: '' as any,
    subscription: null as any
  }
   
  constructor( public ftweb3: FTWeb3Service, public ftNum: FTBigNumberService, public obs: FTObserver, public router: Router, public route: ActivatedRoute, public session: FTSession, public cache: FTCache, public http:Http, public cd: ChangeDetectorRef )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  setToken(token: string): void {
    if(token == 'trade'){
      this.currentToken = this.TradeToken;
      this.currentToken.market = this.Market.trade;
    } else if(token == 'free') {
      this.currentToken = this.FreeToken;
      this.currentToken.market = this.Market.free;
    }

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
      (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.ftNum.getEther(this.modalNumber.number);
      return;
    }
    let oldNumber = this.modalNumber.number;
    if( +newNum != this.ftNum.getEther(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getEther(this.modalNumber.number).toString(),"1000000000000000000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalNumberFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getFinney(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getFinney(this.modalNumber.number).toString(),"1000000000000000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalNumberSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getSzabo(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getSzabo(this.modalNumber.number).toString(),"1000000000000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000"));
    }
    newNum = (document.getElementById('modalNumberGwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.ftNum.getGwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getGwei(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getGwei(this.modalNumber.number).toString(),"1000000000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000000000"));
    }
    newNum = (document.getElementById('modalNumberMwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.ftNum.getMwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getMwei(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getMwei(this.modalNumber.number).toString(),"1000000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000000"));
    }
    newNum = (document.getElementById('modalNumberKwei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.ftNum.getKwei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getKwei(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(this.ftNum.getKwei(this.modalNumber.number).toString(),"1000"));
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, this.ftNum.multiplyBigNumber(newNum, "1000"));
    }
    newNum = (document.getElementById('modalNumberWei') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum)) {} // Make sure it's a number
    else {
      (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.ftNum.getWei(this.modalNumber.number);
      return;
    }
    if( +newNum != this.ftNum.getWei(this.modalNumber.number)) {
      this.modalNumber.number = this.ftNum.subtractBigNumber(this.modalNumber.number, this.ftNum.getWei(this.modalNumber.number).toString());
      this.modalNumber.number = this.ftNum.addBigNumber(this.modalNumber.number, newNum);
    }
    if(this.modalNumber.max != "0") {
      if(this.ftNum.compareBigNumber(this.modalNumber.number, this.modalNumber.max)==1){
        this.modalNumber.number = oldNumber;
        (document.getElementById('modalNumberEther') as HTMLFormElement).value = this.ftNum.getEther(this.modalNumber.number);
        (document.getElementById('modalNumberFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.modalNumber.number);
        (document.getElementById('modalNumberSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.modalNumber.number);
        (document.getElementById('modalNumberGwei') as HTMLFormElement).value = this.ftNum.getGwei(this.modalNumber.number);
        (document.getElementById('modalNumberMwei') as HTMLFormElement).value = this.ftNum.getMwei(this.modalNumber.number);
        (document.getElementById('modalNumberKwei') as HTMLFormElement).value = this.ftNum.getKwei(this.modalNumber.number);
        (document.getElementById('modalNumberWei') as HTMLFormElement).value = this.ftNum.getWei(this.modalNumber.number);
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
      (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.ftNum.getEther(this.modalPrice.number);
      return;
    }
    let oldNumber = this.modalPrice.number;
    if( +newNum != this.ftNum.getEther(this.modalPrice.number)) {
      this.modalPrice.number = this.ftNum.subtractBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(this.ftNum.getEther(this.modalPrice.number).toString(),"1000000000000000000"));
      this.modalPrice.number = this.ftNum.addBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000000"));
    }
    newNum = (document.getElementById('modalPriceFinney') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000  && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.modalPrice.number);
      return;
    }
    if( +newNum != this.ftNum.getFinney(this.modalPrice.number)) {
      this.modalPrice.number = this.ftNum.subtractBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(this.ftNum.getFinney(this.modalPrice.number).toString(),"1000000000000000"));
      this.modalPrice.number = this.ftNum.addBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000000"));
    }
    newNum = (document.getElementById('modalPriceSzabo') as HTMLFormElement).value;
    if( +newNum >= 0 && +newNum < 1000 && /^[0-9]+$/.test(newNum) ) {} // Make sure it's a number
    else {
      (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.modalPrice.number);
      return;
    }
    if( +newNum != this.ftNum.getSzabo(this.modalPrice.number)) {
      this.modalPrice.number = this.ftNum.subtractBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(this.ftNum.getSzabo(this.modalPrice.number).toString(),"1000000000000"));
      this.modalPrice.number = this.ftNum.addBigNumber(this.modalPrice.number, this.ftNum.multiplyBigNumber(newNum, "1000000000000"));
    }
    if(this.modalPrice.max != "0") {
      if(this.ftNum.compareBigNumber(this.modalPrice.number, this.modalPrice.max)==1){
        this.modalPrice.number = oldNumber;
        (document.getElementById('modalPriceEther') as HTMLFormElement).value = this.ftNum.getEther(this.modalPrice.number);
        (document.getElementById('modalPriceFinney') as HTMLFormElement).value = this.ftNum.getFinney(this.modalPrice.number);
        (document.getElementById('modalPriceSzabo') as HTMLFormElement).value = this.ftNum.getSzabo(this.modalPrice.number);
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

  
  getSortedKeys(map: any, direction: boolean): any{
    if(!direction) {
      return this.objectKeys(map).sort((a,b) => {return this.ftNum.compareBigNumber(b,a)})
    } else {
      return this.objectKeys(map).sort((a,b) => {return this.ftNum.compareBigNumber(a,b)})
    }
  }

  ngOnInit(): void{
    if(!this.cache.getCache('key')){
      this.router.navigate(['/crypto_pass']);
    }
    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the block that is passed in route
    });

    this.wb3 = this.cache.getCache('wb3');
    this.fromAddress = this.cache.getCache('encrypted_id') ? this.cache.getCache('encrypted_id').address : this.fromAddress;
    this.FreeToken.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    this.FreeToken.contract = this.ftweb3.createContractInterface(this.FreeToken.abi, "0x" + this.FreeToken.address); 

    this.TradeToken.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    this.TradeToken.contract = this.ftweb3.createContractInterface( this.TradeToken.abi, "0x"+this.TradeToken.address);

    this.Market.abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event"}];
    this.Market.contract = this.ftweb3.createContractInterface(this.Market.abi, "0x" + this.Market.address);

    this.tutorial.contract = this.ftweb3.createContractInterface(this.tutorial.abi, "0x" + this.tutorial.address);
    this.tutorial.stateKey = this.ftweb3.asciiToHex('Tutorial');
  }    

  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  changeSellTabs(tab:number): void{
    this.sellTabs = tab;
  }

  changeBuyTabs(tab:number): void{
    this.buyTabs = tab;
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

  getBookTokenEther(token: string) {
    if(this.bookTokenEther.has(token)){
      return this.bookTokenEther.get(token);
    } else {
      return "0";
    }
  }


    ngAfterViewInit(): void{
    this.Market.subscribeTransactions = this.Market.contract.events.MessageTransaction({
      filter: {
        mToken: ['0x' + this.FreeToken.address, '0x' + this.TradeToken.address]
      }, 
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      if(events.returnValues.mToken == '0x' + this.FreeToken.address){ 
        this.FreeToken.lastPrice = events.returnValues.mPrice;
        this.FreeToken.lastCount = events.returnValues.mCount;
        this.FreeToken.tradeMap[events.returnValues.mNow] = { price: events.returnValues.mPrice, count: events.returnValues.mCount};
      } else if(events.returnValues.mToken == '0x' + this.TradeToken.address) {
        this.TradeToken.lastPrice = events.returnValues.mPrice;
        this.TradeToken.lastCount = events.returnValues.mCount;
        this.TradeToken.tradeMap[events.returnValues.mNow] = { price: events.returnValues.mPrice, count: events.returnValues.mCount};
      }
      if(events.returnValues.mFromAccount.toUpperCase() == '0X' + this.fromAddress.toUpperCase()) {
        this.myTradesMap[events.returnValues.mNow] = { token: events.returnValues.mToken, price: events.returnValues.mPrice, count: -events.returnValues.mCount};
      }
      if(events.returnValues.mToAccount.toUpperCase() == '0X' + this.fromAddress.toUpperCase()) {
        this.myTradesMap[events.returnValues.mNow] = { token: events.returnValues.mToken, price: events.returnValues.mPrice, count: events.returnValues.mCount};
      }
    });

    this.ftweb3.getBalance(this.fromAddress).then( (balance) => {
      this.accountBalance = balance.toString(); 
    });
    this.FreeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
      result => {
        this.FreeToken.mine = result.toString();
      }
    );
    this.TradeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
      result => {
        this.TradeToken.mine = result.toString();
      }
    );
    this.Market.contract.methods.accountBalance(this.zero,this.fromAddress).call().then( 
      result => this.Market.ether = result
    );
    this.Market.contract.methods.accountBalance(this.FreeToken.address, this.fromAddress).call().then( 
      result => this.Market.free = result.toString()
    );
    this.Market.contract.methods.accountBalance(this.TradeToken.address, this.fromAddress).call().then( 
      result => this.Market.trade = result.toString()
    );

    this.subscribeBook = this.Market.contract.events.MessageOffer({
      filter: {mAccount: this.fromAddress}, 
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      if(events.returnValues.mBuy){
        let x = this.ftNum.multiplyBigNumber(events.returnValues.mPrice, events.returnValues.mCount);
        x = this.ftNum.divideBigNumber(x, "1000000");
        x = this.ftNum.addBigNumber(x, events.returnValues.mFee);
        if(this.book.has(events.returnValues.mToken)){
          if(this.book.get(events.returnValues.mToken).has(events.returnValues.mPrice)){
            if(events.returnValues.mAddLiquidity){
              let newCount = this.ftNum.addBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              let newFee = this.ftNum.addBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).fee, events.returnValues.mFee);
              this.book.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: newFee});  
            } else {
              let newCount = this.ftNum.subtractBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              let newFee = this.ftNum.subtractBigNumber(this.book.get(events.returnValues.mToken).get(events.returnValues.mPrice).fee, events.returnValues.mFee);
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
          this.bookEther = this.ftNum.addBigNumber(this.bookEther,x);
        } else {
          this.bookEther = this.ftNum.subtractBigNumber(this.bookEther,x);
        }
      }
      if(!events.returnValues.mBuy){
        let x = events.returnValues.mCount;
        if(this.bookToken.has(events.returnValues.mToken)){
          if(this.bookToken.get(events.returnValues.mToken).has(events.returnValues.mPrice)){
            if(events.returnValues.mAddLiquidity){
              let newCount = this.ftNum.addBigNumber(this.bookToken.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
              this.bookToken.get(events.returnValues.mToken).set(events.returnValues.mPrice,{count: newCount, fee: "0"});  
            } else {
              let newCount = this.ftNum.subtractBigNumber(this.bookToken.get(events.returnValues.mToken).get(events.returnValues.mPrice).count, events.returnValues.mCount);
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
          if(this.bookTokenEther.has(events.returnValues.mToken)){
            this.bookTokenEther.set(events.returnValues.mToken,this.ftNum.addBigNumber(this.bookTokenEther.get(events.returnValues.mToken),x));
          } else {
            this.bookTokenEther.set(events.returnValues.mToken, x);
          }
        } else {
          if(this.bookTokenEther.has(events.returnValues.mToken)){
            this.bookTokenEther.set(events.returnValues.mToken, this.ftNum.subtractBigNumber(this.bookTokenEther.get(events.returnValues.mToken),x));
          } else {
            this.bookTokenEther.set(events.returnValues.mToken, this.ftNum.subtractBigNumber("0",x));
          }
        }
      }
      this.cd.markForCheck();
    });
    this.Market.subscribeBook = this.Market.contract.events.MessageOffer({
      filter: {
        mToken: ['0x' + this.FreeToken.address, '0x' + this.TradeToken.address]
      },
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      if(events.returnValues.mBuy){
        if(events.returnValues.mToken == '0x' + this.FreeToken.address) {
          if(events.returnValues.mAddLiquidity){
            this.FreeToken.buyMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(this.FreeToken.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
          } else {
            this.FreeToken.buyMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(this.FreeToken.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
          }
          if(events.returnValues.mPrice==this.FreeToken.buyPrice){
            if(events.returnValues.mAddLiquidity){
              this.FreeToken.buyCount = this.ftNum.addBigNumber(this.FreeToken.buyCount, events.returnValues.mCount);
            } else {
              this.FreeToken.buyCount = this.ftNum.subtractBigNumber(this.FreeToken.buyCount, events.returnValues.mCount);
            }
          }
        } else if(events.returnValues.mToken == '0x' + this.TradeToken.address) {
          if(events.returnValues.mAddLiquidity){
            this.TradeToken.buyMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(this.TradeToken.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
          } else {
            this.TradeToken.buyMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(this.TradeToken.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
          }
          if(events.returnValues.mPrice==this.TradeToken.buyPrice){
            if(events.returnValues.mAddLiquidity){
              this.TradeToken.buyCount = this.ftNum.addBigNumber(this.TradeToken.buyCount, events.returnValues.mCount);
            } else {
              this.TradeToken.buyCount = this.ftNum.subtractBigNumber(this.TradeToken.buyCount, events.returnValues.mCount);
            }
          }
        }
      }
      if(!events.returnValues.mBuy){
        if(events.returnValues.mToken == '0x' + this.FreeToken.address) {
          if(events.returnValues.mAddLiquidity){
            this.FreeToken.sellMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(this.FreeToken.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
          } else {
            this.FreeToken.sellMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(this.FreeToken.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
          }
          if(events.returnValues.mPrice==this.FreeToken.sellPrice){
            if(events.returnValues.mAddLiquidity){
              this.FreeToken.sellCount = this.ftNum.addBigNumber(this.FreeToken.sellCount, events.returnValues.mCount);
            } else {
              this.FreeToken.sellCount = this.ftNum.subtractBigNumber(this.FreeToken.sellCount, events.returnValues.mCount);
            }
          }
        }else if(events.returnValues.mToken == '0x' + this.TradeToken.address) {
          if(events.returnValues.mAddLiquidity){
            this.TradeToken.sellMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(this.TradeToken.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
          } else {
            this.TradeToken.sellMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(this.TradeToken.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
          }
          if(events.returnValues.mPrice==this.TradeToken.sellPrice){
            if(events.returnValues.mAddLiquidity){
              this.TradeToken.sellCount = this.ftNum.addBigNumber(this.TradeToken.sellCount, events.returnValues.mCount);
            } else {
              this.TradeToken.sellCount = this.ftNum.subtractBigNumber(this.TradeToken.sellCount, events.returnValues.mCount);
            }
          }
        }
      }
    });

    this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
      this.ftweb3.getBalance(this.fromAddress).then( (balance) => {
        this.accountBalance = balance.toString();
      });
      this.FreeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
        (result) => this.FreeToken.mine = result == 0 ? '0' : result.toString()
      );
      this.TradeToken.contract.methods.balanceOf(this.fromAddress).call().then( 
        (result) => this.TradeToken.mine = result == 0 ? '0' : result.toString()
      );
      this.Market.contract.methods.accountBalance(this.zero,this.fromAddress).call().then( 
        (result) => this.Market.ether = result == 0 ? '0' : result
      );
      this.Market.contract.methods.accountBalance(this.FreeToken.address, this.fromAddress).call().then( 
        (result) => this.Market.free = result == 0 ? '0' : result.toString()
      );
      this.Market.contract.methods.accountBalance(this.TradeToken.address, this.fromAddress).call().then( 
        (result) => this.Market.trade = result == 0 ? '0' : result.toString()
      );
      this.tutorial.contract.methods.getUTinyInt('0x'+ this.fromAddress, this.tutorial.stateKey ).call().then( 
        (result4) => {this.tutorial.state = result4 == 0 ? 0 : +result4;}
      );
    });

  } 

  ngDoCheck(): void{
  }

  updateTutorial(step: number): void {
    if(!this.tutorial.subscription && this.tutorial.state < step) {
      var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
      var ABIdata = this.tutorial.contract.methods.saveUTinyInt(this.tutorial.stateKey, step.toString()).encodeABI();
      var chainId = "913945103463586943";
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
          const txData = {
              nonce:    numberToHex(+nonce+1),
              gasPrice: numberToHex(0),
              gasLimit: numberToHex(100000),
              to:       '0x' + this.tutorial.address,
              value:    '0x00',
              data:     ABIdata,
              chainId:  chainId.toString()
          }
          var tx = new EthJS.Tx(txData);
          tx.sign(privateKey);
          this.tutorial.serializedTx = tx.serialize();
          this.tutorial.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.tutorial.serializedTx.toString('hex'))
            .once('receipt', (receipt) => {this.tutorial.subscription.removeAllListeners();this.tutorial.subscription=null;})
      });        
    }
  }


  withdraw(notupdate: boolean): void{
    if(!notupdate){
      this.withdrawAmount = this.currentToken.market;
    }
    var ABIdata = this.Market.contract.methods.withdrawal('0x'+this.currentToken.address,this.withdrawAmount).encodeABI();
    this.Market.contract.methods.withdrawal('0x'+this.currentToken.address,this.withdrawAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress})
    .then( (gasEstimate) => {
      this.Market.estimate = gasEstimate;
      this.maxGas = this.ftNum.multiplyBigNumber(this.Market.estimate,"2");
      this.ftweb3.signTrans(gasEstimate, this.Market.address, 0, ABIdata)
      .then(signedTrans => {
        this.Market.serializedTx = signedTrans;
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
        return null;
      })
    })
    .catch(err => null);
    this.showModal(7);
  }

  changeWithdraw(){
    this.openModalNumber(this.withdrawAmount, this.currentToken.market);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.withdrawAmount = result;
      this.withdraw(true);
    });
  }

  approveWithdraw(): void{
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.ftweb3.sendSignedTrans(this.Market.serializedTx)
    .once('transactionHash', (hash) => { this.Market.transaction = hash; })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(0);
  }

  deposit(notupdate: boolean): void{
    if(!notupdate){
      this.depositAmount = this.currentToken.mine;
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');

    var ABIdata = this.currentToken.contract.methods.approve('0x'+this.Market.address,this.depositAmount).encodeABI();
    var chainId = "913945103463586943";
    this.currentToken.contract.methods.approve('0x'+this.Market.address,this.depositAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.currentToken.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(this.currentToken.estimate,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
            to:       '0x' + this.currentToken.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.currentToken.serializedTx = tx.serialize();
        this.currentToken.receipt = null;
        this.currentToken.transaction = '';
        this.currentToken.confirmed = 0;
        this.currentToken.error = '';
        return null;
      });
    })
    .catch(err => null);
    /*ToDo once we publish fixecd approveandcall in the Market contract implement this so deposit can be 1 call (Check if estimate gas error and do 2 step if error)
      this.currentToken.contract.methods.approveAndCall('0x'+this.Market.address,this.currentToken.mine,'').estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
    });*/
    this.showModal(4);
  }

  changeDeposit(){
    this.openModalNumber(this.depositAmount, this.currentToken.mine);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.depositAmount = result;
      this.deposit(true);
    });
  }

  approveConfirm(): void{
    this.Market.estimate = "0";
    if(this.currentToken.subscription){
      this.currentToken.subscription.removeAllListeners();
    }
    this.currentToken.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.currentToken.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.currentToken.transaction = hash; 
    })
    .once('receipt', (receipt) => { 
      this.currentToken.receipt = receipt; 
      var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
      var ABIdata = this.Market.contract.methods.deposit('0x'+this.currentToken.address,this.depositAmount).encodeABI();
      var chainId = "913945103463586943";
      this.Market.contract.methods.deposit('0x'+this.currentToken.address,this.depositAmount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
        this.Market.estimate = returns;
        this.maxGas = this.ftNum.multiplyBigNumber(returns, "2");
        this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
          const txData = {
              nonce:    numberToHex(nonce),
              gasPrice: numberToHex(this.gasPrice),
              gasLimit: numberToHex(this.maxGas),
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
      });
    })
    .on('confirmation', (confNumber, receipt) => { this.currentToken.confirmed = confNumber; 
    })
    .on('error', (error) => { console.log('ERROR' + error); this.currentToken.error = error;})
    this.showModal(5);
  }

  depositConfirm(): void{
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; 
      if(this.currentToken.address == '9287bb21719d283CfdD7d644a89E8492f9845B64'){
        this.updateTutorial(2);
      }
      if(this.currentToken.address == '2d5e86187855CC29B40469e8a7355f3fDBf4C088'){
        this.updateTutorial(7);
      }
    })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(0);
  }

  depositEther(notupdate: boolean): void{    
    if(!notupdate){
      this.depositEtherAmount = this.ftNum.subtractBigNumber(this.accountBalance,"100000000000000000");
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.deposit('0x' + this.zero, "0").encodeABI();
    var chainId = "913945103463586943";
    this.Market.contract.methods.deposit('0x' + this.zero, "0").estimateGas({from:'0x'+this.fromAddress,value:this.depositEtherAmount}).then( (returns) => {
      this.Market.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(returns, "2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
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
    });
    this.showModal(13);
  }

  changeEtherDeposit(): void{
    this.openModalNumber(this.depositEtherAmount, this.ftNum.subtractBigNumber(this.accountBalance,"100000000000000000"));
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.depositEtherAmount = result;
      this.depositEther(true);
    });
  }

  depositEtherConfirm(): void{
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; this.updateTutorial(5);})
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(0);
  }

  withdrawEther(notupdate: boolean): void{
    if(!notupdate){
      this.withdrawEtherAmount = this.Market.ether;
    }
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.withdrawal('0x' + this.zero, this.withdrawEtherAmount).encodeABI();
    var chainId = "913945103463586943";
    this.Market.contract.methods.withdrawal('0x' + this.zero, this.withdrawEtherAmount).estimateGas({from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(this.Market.estimate,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
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
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; this.updateTutorial(4);})
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt; })
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(0);
  }

  setCancelOffer(token: string, amount: string, buysell: boolean): void{
    // function cancelOffer( address _token, bool _buy, uint256 _amount ) public returns ( bool success_ ) {
    this.lastOffer.token = token;
    this.lastOffer.amount = amount;
    this.lastOffer.buysell = buysell;
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.cancelOffer(token, buysell, amount).encodeABI();
    var chainId = "913945103463586943";
    this.Market.contract.methods.cancelOffer(token, buysell, amount).estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(this.Market.estimate, "2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
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
    });
  }


  cancelOffer(): void{
    let token = this.book.keys().next().value;
    let price = this.book.get(token).keys().next().value;
    this.setCancelOffer(token, price, true);
    this.showModal(17);
  }

  cancelTokenOffer(): void{
    // let token = this.bookToken.keys().next().value;
    let token = '0x' + this.currentToken.address;
    let price = this.bookToken.get(token).keys().next().value;
    this.setCancelOffer(token, price, false);
    this.showModal(18);
  }


  cancelOfferConfirm(): void{
    this.Market.estimate = "0";
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
    this.obs.putObserver('isSignedIn', false);
    this.router.navigate(['/crypto_pass']);
    this.showModal(0);
  }

  buy(): void{
    // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.makeOffer('0x' + this.currentToken.address, true, this.buyPrice, this.buyToken, "0x00").encodeABI();
    var chainId = "913945103463586943";
    this.Market.contract.methods.makeOffer('0x' + this.currentToken.address, true, this.buyPrice, this.buyToken, "0x00").estimateGas({from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(returns,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
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
    });
    this.showModal(9);
  }

  changeBuyToken(): void{
    let maxToken = "0";
    if(this.buyPrice == "0") {
      maxToken = "0";
    } else {
      maxToken = this.ftNum.divideBigNumber(this.ftNum.multiplyBigNumber(this.ftNum.subtractBigNumber(this.Market.ether, "1000000000000000"),"1000000"),this.buyPrice);
    }
    this.openModalNumber(this.buyToken, maxToken);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.buyToken = result;
      this.buy();
    });
  }
  changeBuyPrice(): void{
    let maxPrice = "0";
    if(this.buyToken == "0") {
      maxPrice = "0";
    } else {
      maxPrice = this.ftNum.divideBigNumber(this.ftNum.multiplyBigNumber(this.ftNum.subtractBigNumber(this.Market.ether, "1000000000000000"),"1000000"),this.buyToken);
    }
    maxPrice = this.ftNum.multiplyBigNumber(maxPrice, "1000000000000")
    let buyPriceNew = this.ftNum.multiplyBigNumber(this.buyPrice,"1000000000000");
    this.openModalPrice(buyPriceNew, maxPrice);
    this.obs.getObserver('modalPrice').subscribe( (result) => {
      this.buyPrice = this.ftNum.divideBigNumber(result,"1000000000000");
      this.buy();
    });
  }

  buyConfirm(): void{
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; 
      if(this.currentToken.address == '2d5e86187855CC29B40469e8a7355f3fDBf4C088'){
        if(this.tutorial.state == 7){
          this.updateTutorial(9);
        } else if(this.tutorial.state == 8) {
          this.updateTutorial(10);
        }
      }
    })
    .once('receipt', (receipt) =>{ this.Market.receipt = receipt;})
    .on('confirmation', (confNumber, receipt) => { this.Market.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.Market.error = error;})
    this.showModal(10);
  }

  sell(): void{
    // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.Market.contract.methods.makeOffer('0x' + this.currentToken.address, false, this.sellPrice, this.sellToken, "0x00").encodeABI();
    var chainId = "913945103463586943";
    this.Market.contract.methods.makeOffer('0x' + this.currentToken.address, false, this.sellPrice, this.sellToken, "0x00").estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.Market.estimate = returns;
      this.maxGas = this.ftNum.multiplyBigNumber(returns,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
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
    });
    this.showModal(11);
  }

  changeSellToken(max): void{
    // Todo: calculate max based on price (Also, limit fractions based on price)
    this.openModalNumber(this.sellToken, max);
    this.obs.getObserver('modalNumber').subscribe( (result) => {
      this.sellToken = result;
      this.sell();
    });
  }
  changeSellPrice(): void{
    // Todo: calculate max based on Token (Also, limit fractions based on tokens)
    let sellPriceNew = this.ftNum.multiplyBigNumber(this.sellPrice,"1000000000000");
    this.openModalPrice(sellPriceNew, "0");
    this.obs.getObserver('modalPrice').subscribe( (result) => {
      this.sellPrice = this.ftNum.divideBigNumber(result,"1000000000000");
      this.sell();
    });
  }

  sellConfirm(): void{
    this.Market.estimate = "0";
    if(this.Market.subscription){
      this.Market.subscription.removeAllListeners();
    }
    this.Market.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.Market.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.Market.transaction = hash; 
      if(this.currentToken.address == '9287bb21719d283CfdD7d644a89E8492f9845B64'){
        this.updateTutorial(3);
      }
      if(this.currentToken.address == '2d5e86187855CC29B40469e8a7355f3fDBf4C088'){
        if(this.tutorial.state == 7){
          this.updateTutorial(8);
        } else if(this.tutorial.state == 9) {
          this.updateTutorial(10);
        }
      }
      })
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
    if(this.currentToken.subscription){
      this.currentToken.subscription.removeAllListeners();
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
    if(this.tutorial.subscription){
      this.tutorial.subscription.removeAllListeners();
    }
    if(this.Market.subscribeBook){
      this.Market.subscribeBook.removeAllListeners();
    }
    if(this.Market.subscribeTransactions){
      this.Market.subscribeTransactions.removeAllListeners();
    }
  }
}
