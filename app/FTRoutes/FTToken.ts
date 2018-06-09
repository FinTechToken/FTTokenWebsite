declare var rlp: any;
declare var numberToHex: any;
declare var EthJS: any;
declare var BigNumber: any;

import { Component, trigger, state, style, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTObserver } from '../FTFramework/FT-Observer';
/* ToDo: Each time you change tabs scroll to top */
@Component({
  moduleId: module.id,
  selector: 'ft-token',
  templateUrl: '../../html/routes/token.html'
})

export class FTToken {
  objectKeys = Object.keys;
  zone: NgZone;   
  name = "FinTechToken";
  visibility="hiddenss";
  modal = 0;
  subscribeParam;
  subscribeBlock;
  subscribeBNSec
  seconds=0;
  tabs = 1;
  number='';
  gotFree=false;
  zero="0000000000000000000000000000000000000000";
  gasPrice= "0";
  maxGas="500000";
  fromAddress = "0000000000000000000000000000000000000000";
  wb3;
  //Free 9287bb21719d283CfdD7d644a89E8492f9845B64
  //Trade 2d5e86187855CC29B40469e8a7355f3fDBf4C088
  token = {
    buyPrice: "",
    sellPrice: "",
    buyCount: "",
    sellCount: "",
    lastPrice: "",
    lastCount: "",
    sellMap: {},
    buyMap: {},
    tradeMap: {},
    subscribeBook: null as any,
    subscribeTransactions: null as any,
    name: "",
    mine:"",
    totalSupply:"",
    totalOutstanding:"",
    contract:{} as any,
    estimate:"0",
    error:'',
    address: "",
    abi:{} as any,
    serializedTx:{} as any,
    transaction: '',
    receipt: null as any,
    confirmed: 0,
    subscription: null as any
  }
  Market = {
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


  constructor( private obs: FTObserver, private router: Router, private route: ActivatedRoute, private session: FTSession, private cache: FTCache, private http:Http )
  {   
    this.zone=new NgZone({enableLongStackTrace:false});//Zone used for old version of IPad. Doesn't update without it.
  }

  getSortedKeys(map: any, direction: boolean): any{
    if(!direction) {
      return this.objectKeys(map).sort((a,b) => {return this.compareBigNumber(b,a)})
    } else {
      return this.objectKeys(map).sort((a,b) => {return this.compareBigNumber(a,b)})
    }
  }

  getFreeToken(): void {
    var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
    var ABIdata = this.token.contract.methods.getFreeToken().encodeABI();
    var chainId = "913945103463586943";
    this.token.contract.methods.gotFree('0x'+this.fromAddress).call().then( (returns) => {
      this.gotFree = returns;
      console.log(returns);
      }
    );
    this.token.contract.methods.getFreeToken().estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
      this.token.estimate = returns;
      this.maxGas = this.multiplyBigNumber(this.token.estimate,"2");
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
        const txData = {
            nonce:    numberToHex(nonce),
            gasPrice: numberToHex(this.gasPrice),
            gasLimit: numberToHex(this.maxGas),
            to:       '0x' + this.token.address,
            value:    '0x00',
            data:     ABIdata,
            chainId:  chainId.toString()
        }
        var tx = new EthJS.Tx(txData);
        tx.sign(privateKey);
        this.token.serializedTx = tx.serialize();
        this.token.receipt = null;
        this.token.transaction = '';
        this.token.confirmed = 0;
        this.token.error = '';
        return null;
      });
    });
    this.showModal(3);
  }

  getFreeTokenConfirm(): void {
    if(this.token.subscription){
      this.token.subscription.removeAllListeners();
    }
    this.token.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.token.serializedTx.toString('hex'))
    .once('transactionHash', (hash) => { this.token.transaction = hash; this.updateTutorial();})
    .once('receipt', (receipt) =>{ this.token.receipt = receipt;})
    .on('confirmation', (confNumber, receipt) => { this.token.confirmed = confNumber; })
    .on('error', (error) => { console.log('ERROR' + error); this.token.error = error;})
    this.showModal(4);
  }

  updateTutorial(): void {
    if(!this.tutorial.subscription && +this.tutorial.state < 1) {
      var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
      var ABIdata = this.tutorial.contract.methods.saveUTinyInt(this.tutorial.stateKey, "1").encodeABI();
      var chainId = "913945103463586943";
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
          const txData = {
              nonce:    numberToHex(+nonce+1),
              gasPrice: '0x00',
              gasLimit: numberToHex(500000),
              to:       '0x' + this.tutorial.address,
              value:    '0x00',
              data:     ABIdata,
              chainId:  chainId.toString()
          }
          var tx = new EthJS.Tx(txData);
          tx.sign(privateKey);
          this.tutorial.serializedTx = tx.serialize();
          this.tutorial.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.tutorial.serializedTx.toString('hex'))
            .once('receipt', (receipt) =>{})
      });
    }
    if(!this.tutorial.subscription && +this.tutorial.state == 5) {
      var privateKey = Buffer.from(rlp.stripHexPrefix(this.cache.getCache('key')), 'hex');
      var ABIdata = this.tutorial.contract.methods.saveUTinyInt(this.tutorial.stateKey, "6").encodeABI();
      var chainId = "913945103463586943";
      this.wb3.eth.getTransactionCount('0x' + this.fromAddress).then( (nonce) => {
          const txData = {
              nonce:    numberToHex(+nonce+1),
              gasPrice: '0x00',
              gasLimit: numberToHex(500000),
              to:       '0x' + this.tutorial.address,
              value:    '0x00',
              data:     ABIdata,
              chainId:  chainId.toString()
          }
          var tx = new EthJS.Tx(txData);
          tx.sign(privateKey);
          this.tutorial.serializedTx = tx.serialize();
          this.tutorial.subscription = this.wb3.eth.sendSignedTransaction('0x' + this.tutorial.serializedTx.toString('hex'))
            .once('receipt', (receipt) =>{})
      });
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
  }

  ngOnInit(): void{ 
    if(!this.cache.getCache('key')){
      this.router.navigate(['/crypto_pass']);
    }

    this.subscribeParam = this.route.params.subscribe(params => {
      //params = the token passed in the route
      this.token.address = params['id'];
    });
    if(this.cache.getCache('encrypted_id')){
      this.fromAddress = this.cache.getCache('encrypted_id').address;
    }
    this.subscribeBNSec = this.obs.getObserver('blockSeconds').subscribe( (bnsec) => {
      this.seconds = bnsec;
    });
    this.wb3 = this.cache.getCache('wb3');
    this.token.abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    this.token.contract = new this.wb3.eth.Contract(this.token.abi, '0x' + this.token.address, {
      from: '0x' + this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
    this.Market.abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event"}];
    this.Market.contract = new this.wb3.eth.Contract(this.Market.abi, '0x' + this.Market.address, {
      from: '0x'+this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
    this.tutorial.contract = new this.wb3.eth.Contract(this.tutorial.abi, '0x' + this.tutorial.address, {
      from: '0x' + this.fromAddress, // default from address
      gasPrice: '0' // default gas price in wei
    });
    this.tutorial.stateKey = this.wb3.utils.asciiToHex('Tutorial');
  }    

viewNumber(number: string): void {
    this.number = number;
    this.showModal(1);
}

getEther(number:string): number{
  if(number.length > 18){
    return +number.substr(0,number.length-18);
  }
  else {
    return 0;
  }
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
compareBigNumber(numberA: string, numberB: string): number {
  if(numberA == "" || !numberA){
    numberA="0";
  }
  if(numberB == "" || !numberB){
    numberB="0"
  }
  let x = new BigNumber(numberA);
  let y = new BigNumber(numberB);
  return x.comparedTo(y);
}
addBigNumber(numberA: string, numberB: string): string {
  if(numberA == "" || !numberA){
    numberA="0";
  }
  if(numberB == "" || !numberB){
    numberB="0"
  }
  let x = new BigNumber(numberA);
  let y = new BigNumber(numberB);
  return x.plus(y).toString(10);
}
subtractBigNumber(numberA: string, numberB: string): string {
  if(numberA == "" || !numberA){
    numberA="0";
  }
  if(numberB == "" || !numberB){
    numberB="0"
  }
  let x = new BigNumber(numberA);
  let y = new BigNumber(numberB);
  return x.minus(y).toString(10);
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


  ngAfterViewInit(): void{
    this.token.subscribeTransactions = this.Market.contract.events.MessageTransaction({
      filter: {
        mToken: '0x' + this.token.address
      }, 
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      this.token.lastPrice = events.returnValues.mPrice;
      this.token.lastCount = events.returnValues.mCount;
      this.token.tradeMap[events.returnValues.mNow] = { price: events.returnValues.mPrice, count: events.returnValues.mCount};
    });

    this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
      // Chain due to web3 bug https://github.com/ethereum/web3.js/issues/1069
      // The return type is whatever the LAST concurrent return type is. 
      // Workaround is to group calls with same type and chain them to the next group.
      this.token.contract.methods.name().call().then( 
        (result5) => {
          this.token.name = result5 == 0 ? "0" : result5.toString();
        
        this.token.contract.methods.totalSupply().call().then( 
          (result1) => {
            this.token.totalSupply = result1 == 0 ? "0" : result1.toString();
          }
        );
        this.token.contract.methods.totalOutstanding().call().then( 
          (result2) => this.token.totalOutstanding = result2 == 0 ? "0" : result2.toString()
        );
        this.token.contract.methods.balanceOf('0x' + this.fromAddress).call().then( 
          (result3) => this.token.mine = result3 == 0 ? "0" : result3.toString()
        );
        this.tutorial.contract.methods.getUTinyInt('0x'+ this.fromAddress, this.tutorial.stateKey ).call().then( 
          (result4) => {this.tutorial.state = result4 == 0 ? 0 : +result4;}
        );
        this.Market.contract.methods.offersAtPrice('0x' + this.token.address, true, 0).call().then( 
          (result) => { 
            if(this.token.buyPrice != result.nextPrice) {
              this.token.buyPrice = result.nextPrice == 0 ? '0' : result.nextPrice; 
              this.token.buyCount = "0";
            }
        }
        );
        this.Market.contract.methods.offersAtPrice('0x' + this.token.address, false, 0).call().then( 
          (result) => {
            if(this.token.sellPrice != result.nextPrice) {
              this.token.sellPrice = result.nextPrice == 0 ? '0' : result.nextPrice;
              this.token.sellCount = "0";
            }
          }
        );
      }
    );
  });
    this.token.subscribeBook = this.Market.contract.events.MessageOffer({
      filter: {
        mToken: '0x' + this.token.address
      }, 
      fromBlock: 0,
      toBlock: 'latest'
    })
    .on( 'data', (events) => {
      if(events.returnValues.mBuy){
        if(events.returnValues.mAddLiquidity){
          this.token.buyMap[events.returnValues.mPrice] = this.addBigNumber(this.token.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
        } else {
          this.token.buyMap[events.returnValues.mPrice] = this.subtractBigNumber(this.token.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
        }
        if(events.returnValues.mPrice==this.token.buyPrice){
          if(events.returnValues.mAddLiquidity){
            this.token.buyCount = this.addBigNumber(this.token.buyCount, events.returnValues.mCount);
          } else {
            this.token.buyCount = this.subtractBigNumber(this.token.buyCount, events.returnValues.mCount);
          }
        }
      }
      if(!events.returnValues.mBuy){
        if(events.returnValues.mAddLiquidity){
          this.token.sellMap[events.returnValues.mPrice] = this.addBigNumber(this.token.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
        } else {
          this.token.sellMap[events.returnValues.mPrice] = this.subtractBigNumber(this.token.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
        }
        if(events.returnValues.mPrice==this.token.sellPrice){
          if(events.returnValues.mAddLiquidity){
            this.token.sellCount = this.addBigNumber(this.token.sellCount, events.returnValues.mCount);
          } else {
            this.token.sellCount = this.subtractBigNumber(this.token.sellCount, events.returnValues.mCount);
          }
        }
      }
    });
  }

  ngDoCheck(): void{
  }
  changeTabs(tab:number): void{
    this.tabs = tab;
  }

  ngOnDestroy(){
    this.subscribeParam.unsubscribe();
    if(this.subscribeBNSec){
      this.subscribeBNSec.unsubscribe();
    }
    if(this.subscribeBlock){
      this.subscribeBlock.unsubscribe();
    }
    if(this.token.subscription){
      this.token.subscription.removeAllListeners();
    }
    if(this.tutorial.subscription){
      this.tutorial.subscription.removeAllListeners();
    }
    if(this.token.subscribeBook){
      this.token.subscribeBook.removeAllListeners();
    }
    if(this.token.subscribeTransactions){
      this.token.subscribeTransactions.removeAllListeners();
    }
  }
}
