import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { FTObserver } from '../FTFramework/FT-Observer';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Injectable()
export class FTMarketService {
    subscribeBlock;
    subscribeMyOffers;
    maxGas="0";
    private accountBalance="0";
    Market = {
        address: 'a0B71a29998790a84ee459132D1c87AcD4dF0E6e',
        //address: 'AF9b965E5D1a73010b7b6595bD5fD78d4E0F3bc9',
        abi:[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event"}],
        //abi:[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"_newTransactionFee","type":"uint8"},{"name":"_newTransactionFeeMultiple","type":"uint8"},{"name":"_newAddToBookFee","type":"uint256"}],"name":"updateFees","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function","signature":"0x123fcde6"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"},{"name":"_shares","type":"uint256"},{"name":"_startAmount","type":"uint256"}],"name":"makeOffer","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x270b3d2b"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"deposit","outputs":[{"name":"success_","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function","signature":"0x47e7ef24"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"name":"offersAtPrice","outputs":[{"name":"nextPrice","type":"uint256"},{"name":"currentOffersLength","type":"uint24"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x51debeef"},{"constant":true,"inputs":[],"name":"addToBookFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5732c2bb"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawal","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x5a6b26ba"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x62a5af3b"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_buy","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"cancelOffer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7962d432"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"accountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x887bdcfc"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"_grantor","type":"address"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"},{"name":"_extraData","type":"bytes"}],"name":"receiveApproval","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x8f4ffcb1"},{"constant":true,"inputs":[],"name":"transactionFee","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9ed3edf0"},{"constant":true,"inputs":[],"name":"ownerChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa536395d"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa6c3e6b9"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa6f9dae1"},{"constant":true,"inputs":[],"name":"bidDecimal","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb04cf4d5"},{"constant":true,"inputs":[],"name":"transactionFeeMultiple","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf5fccae2"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountDeposit","type":"event","signature":"0x88c55a25c2ff316c8b3eca41653bb7eed1998d61e2f7f7288b79123faba99029"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mValue","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageAccountWithdrawal","type":"event","signature":"0x62185ef12fb4703a4f6e507e425ecaf63765a462d2a690b68015efff74d56323"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":true,"name":"mToAccount","type":"address"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageTransaction","type":"event","signature":"0x34c71b74d4282956a51d34ef305cd4be32bce34f5b12dbc08a072855c54a08af"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mFromAccount","type":"address"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mSellerFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessagePayTransactionFee","type":"event","signature":"0xb5a03edd954b80022e769f7c8af9170e2e39a4b351002a1864e888aac1eb0f53"},{"anonymous":false,"inputs":[{"indexed":true,"name":"mToken","type":"address"},{"indexed":true,"name":"mBuy","type":"bool"},{"indexed":true,"name":"mAccount","type":"address"},{"indexed":false,"name":"mAddLiquidity","type":"bool"},{"indexed":false,"name":"mPrice","type":"uint256"},{"indexed":false,"name":"mCount","type":"uint256"},{"indexed":false,"name":"mFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOffer","type":"event","signature":"0x15d58562a65ae36bd23629b8f65e2ad443fa78099ce2a35f40d3eac772245b60"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mTransFee","type":"uint8"},{"indexed":false,"name":"mTransmultiple","type":"uint8"},{"indexed":false,"name":"mBookFee","type":"uint256"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageChangeFees","type":"event","signature":"0xe422d31ad0a7139b58a00a7ad71cefc619bdf5e99c4698efc980d2414ab0e620"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mOwner","type":"address"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageOwner","type":"event","signature":"0x399c8ba6436ea2d88f2a7f279f1701397fcd5bd2046ffd92cfa3b4fe16b551cf"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mFreeze","type":"bool"},{"indexed":false,"name":"mNow","type":"uint256"}],"name":"MessageFreeze","type":"event","signature":"0x4acad4a82756afd37e2d2e935cd96aa2d8c97634700f991592f3b977d6dc7d80"}],
        contract:{} as any,
        estimate:"0",
        receipt:null,
        transaction:'',
        confirmed:0,
        error:'',
        serializedTx:null
      };

      myTradesMap = {};
      book = new Map();
      bookTokenEther = new Map();
      bookEther ="0";
      bookToken = new Map();
      returnEther=true;
      returnToken=true;

    constructor ( private ftTokenWatch: FTTokenWatchService, private ftweb3: FTWeb3Service, private ftNum: FTBigNumberService, private cache: FTCache, private obs: FTObserver ) { 
        this.Market.contract = this.ftweb3.createContractInterface(this.Market.abi, "0x" + this.Market.address);

        this.obs.getObserver('isPreviousUser').forEach( isPrev => {
            if(isPrev){
                this.Market.contract.methods.accountBalance(this.ftNum.getZero(), this.cache.getCache('encrypted_id').address).call().then(
                  result => {
                    this.accountBalance = result;
                    if(this.accountBalance !="0" && this.accountBalance)
                      this.buildAndSendWithdrawEtherTrans(this.accountBalance);
                  }
                );
                
                this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
                  this.Market.contract.methods.accountBalance(this.ftNum.getZero(), this.cache.getCache('encrypted_id').address).call().then( 
                    result => {
                      this.accountBalance = result;
                      if(this.returnEther && this.accountBalance != "0" && this.accountBalance){
                        this.buildAndSendWithdrawEtherTrans(this.accountBalance);
                      }}
                  );
                  
                  this.ftTokenWatch.TokenWatch.forEach( (token,index) => {
                    this.Market.contract.methods.accountBalance(token.address.substring(2), this.cache.getCache('encrypted_id').address).call().then(
                      result => { 
                        token.mineTrade = result.toString();
                        if(this.returnToken && token.mineTrade != "0" && token.mineTrade){
                          this.buildAndSendWithdrawTokenTrans(token.mineTrade,index);
                        }
                    });
                  });
                });
                
                this.subscribeMyOffers = this.Market.contract.events.MessageOffer({
                  filter: {mAccount: this.cache.getCache('encrypted_id').address},
                  fromBlock: 0,
                  toBlock: 'latest'
                })
                .on('data', (events) => {
                  this.processMyOfferEvents(events);
                });

                this.ftTokenWatch.TokenWatch.forEach( (token,index) => {
                  //Get Book
                  token.subscribeBook = this.Market.contract.events.MessageOffer({
                    filter: {
                      mToken: [token.address]
                    },
                    fromBlock: 0,
                    toBlock: 'latest'
                  })
                  .on( 'data', (events) => {
                    if(events.returnValues.mBuy){
                      if(events.returnValues.mAddLiquidity){
                        token.buyMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(token.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
                      } else {
                        token.buyMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(token.buyMap[events.returnValues.mPrice], events.returnValues.mCount);
                      }
                      if(token.buyMap[events.returnValues.mPrice] == "0")
                        delete token.buyMap[events.returnValues.mPrice];
                    }
                    if(!events.returnValues.mBuy){
                      if(events.returnValues.mAddLiquidity){
                        token.sellMap[events.returnValues.mPrice] = this.ftNum.addBigNumber(token.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
                      } else {
                        token.sellMap[events.returnValues.mPrice] = this.ftNum.subtractBigNumber(token.sellMap[events.returnValues.mPrice], events.returnValues.mCount);
                      }
                      if(token.sellMap[events.returnValues.mPrice] == "0")
                        delete token.sellMap[events.returnValues.mPrice];
                    }
                  });

                  //Get Past Trades
                  token.subscribeTrades = this.Market.contract.events.MessageTransaction({
                    filter: {
                      mToken: [token.address]
                    }, 
                    fromBlock: 0,
                    toBlock: 'latest'
                  })
                  .on( 'data', (events) => {
                    token.lastPrice = events.returnValues.mPrice;
                    token.lastCount = events.returnValues.mCount;
                    token.tradeMap[events.returnValues.mNow] = { price: events.returnValues.mPrice, count: events.returnValues.mCount};
                    if(events.returnValues.mFromAccount.toUpperCase() == '0X' + this.cache.getCache('encrypted_id').address.toUpperCase()) {
                      token.myTradesMap[events.returnValues.mNow] = { token: events.returnValues.mToken, price: events.returnValues.mPrice, count: -events.returnValues.mCount};
                      this.myTradesMap[events.returnValues.mNow] = token.myTradesMap[events.returnValues.mNow];
                    }
                    if(events.returnValues.mToAccount.toUpperCase() == '0X' + this.cache.getCache('encrypted_id').address.toUpperCase()) {
                      token.myTradesMap[events.returnValues.mNow] = { token: events.returnValues.mToken, price: events.returnValues.mPrice, count: events.returnValues.mCount};
                      this.myTradesMap[events.returnValues.mNow] = token.myTradesMap[events.returnValues.mNow];
                    }
                  });
                });
            
            }
          });
    }
    
    getAccountBalance(): string {
        return this.accountBalance;
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

    resetTrans() {
      this.Market.estimate = "0";
      this.Market.receipt = null;
      this.Market.transaction = '';
      this.Market.confirmed = 0;
      this.Market.error = '';
      this.Market.serializedTx = null;
    }

    buildAndSendDepositBuyTokenTrans(buyPrice, buyAmt, index, etherNeeded) {
        this.returnEther=false;
        var ABIdata = this.Market.contract.methods.deposit('0x' + this.ftNum.getZero(), "0").encodeABI();
        this.Market.contract.methods.deposit('0x' + this.ftNum.getZero(), "0").estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:etherNeeded})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, etherNeeded, ABIdata)
          .then(signedTrans => {
            this.ftweb3.sendSignedTrans(signedTrans).then(res => {
              this.buildBuyOfferTrans(buyPrice, buyAmt, index);
              return null;
            })
          })
        })
        .catch(err => null); 
      }

      buildAndSendWithdrawEtherTrans(amtToWithdraw) {
        var ABIdata = this.Market.contract.methods.withdrawal('0x' + this.ftNum.getZero(), amtToWithdraw).encodeABI();
        this.Market.contract.methods.withdrawal('0x' + this.ftNum.getZero(), amtToWithdraw).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, "0", ABIdata)
          .then(signedTrans => {
            this.ftweb3.sendSignedTrans(signedTrans).catch(err => console.log(err));
            return null;
          })
        })
        .catch(err => null);
      }

      buildAndSendWithdrawTokenTrans(amtToWithdraw, index) {
        var ABIdata = this.Market.contract.methods.withdrawal(this.ftTokenWatch.TokenWatch[index].address, amtToWithdraw).encodeABI();
        this.Market.contract.methods.withdrawal(this.ftTokenWatch.TokenWatch[index].address, amtToWithdraw).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, "0", ABIdata)
          .then(signedTrans => {
            this.ftweb3.sendSignedTrans(signedTrans).catch(err => console.log(err));
            return null;
          })
        })
        .catch(err => null);
      }

      buildBuyOfferTrans(buyPrice, buyAmount, index) {
        // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
        buyPrice = this.ftNum.divideBigNumber(buyPrice,"1000000000000");
        var ABIdata = this.Market.contract.methods.makeOffer(this.ftTokenWatch.TokenWatch[index].address, true, buyPrice, buyAmount, "0").encodeABI();
        this.Market.contract.methods.makeOffer(this.ftTokenWatch.TokenWatch[index].address, true, buyPrice, buyAmount, "0").estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, "0", ABIdata)
            .then(signedTrans => {
              this.ftweb3.sendSignedTrans(signedTrans).catch(err => console.log(err)).then(res => {this.returnEther=true;});
              return null;
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      }

      buildSellOfferTrans(sellPrice, sellAmount, index) {
        // makeOffer( address _token, bool _buy, uint256 _amount, uint256 _shares, uint256 _startAmount )
        sellPrice = this.ftNum.divideBigNumber(sellPrice,"1000000000000");
        var ABIdata = this.Market.contract.methods.makeOffer(this.ftTokenWatch.TokenWatch[index].address, false, sellPrice, sellAmount, "0").encodeABI();
        this.Market.contract.methods.makeOffer(this.ftTokenWatch.TokenWatch[index].address, false, sellPrice, sellAmount, "0").estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, "0", ABIdata)
            .then(signedTrans => {
              this.ftweb3.sendSignedTrans(signedTrans).catch(err => console.log(err)).then(res => {this.returnToken=true;});
              return null;
            })
        })
        .catch(err => null);
      }

      buildCancelOffer(token: string, amount: string, buysell: boolean): void{
        // function cancelOffer( address _token, bool _buy, uint256 _amount ) public returns ( bool success_ ) {
        var ABIdata = this.Market.contract.methods.cancelOffer(token, buysell, amount).encodeABI();
        this.Market.contract.methods.cancelOffer(token, buysell, amount).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.setGasAndSignTrans(gasEstimate, "0", ABIdata)
            .then(signedTrans => {
              this.signTrans(signedTrans);
              return null;
            })
        })
        .catch(err => null);
      }

      buildAndSellDepositTokenTrans(amtToDeposit, index, price) {
        this.returnToken=false;
        var ABIdata = this.ftTokenWatch.TokenWatch[index].contract.methods.approve('0x' + this.Market.address, amtToDeposit).encodeABI();
        this.ftTokenWatch.TokenWatch[index].contract.methods.approve('0x' + this.Market.address, amtToDeposit).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address})
        .then( (gasEstimate) => {
          this.Market.estimate = gasEstimate;
          this.maxGas = this.ftNum.multiplyBigNumber(gasEstimate, "2");
          this.ftweb3.signTrans(gasEstimate, this.ftTokenWatch.TokenWatch[index].address.substring(2), "0", ABIdata)
          .then(signedTrans => {
            this.Market.serializedTx = signedTrans;
            this.confirmApprovalAndSendTrans(amtToDeposit, index).then(res => {
              this.buildSellOfferTrans(price, amtToDeposit, index);
              return null;
            });
          })
        })
        .catch(err => null);
          /*ToDo once we publish fixecd approveandcall in the Market contract implement this so deposit can be 1 call (Check if estimate gas error and do 2 step if error)
            this.currentToken.contract.methods.approveAndCall('0x'+this.Market.address,this.currentToken.mine,'').estimateGas({gas:500000,from:'0x'+this.fromAddress}).then( (returns) => {
            this.Market.estimate = returns;
          });*/        
      }

      confirmApprovalAndSendTrans(amtToDeposit, index) {
        return this.ftweb3.sendSignedTrans(this.Market.serializedTx).then( (receipt) => { 
          var ABIdata = this.Market.contract.methods.deposit(this.ftTokenWatch.TokenWatch[index].address,amtToDeposit).encodeABI();
          return this.Market.contract.methods.deposit(this.ftTokenWatch.TokenWatch[index].address,amtToDeposit).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address, value:'0'}).then( (gasEstimate) => {
            this.Market.estimate = gasEstimate;
            this.maxGas = this.ftNum.multiplyBigNumber(gasEstimate, "2");
            return this.ftweb3.signAndSendTrans(gasEstimate, this.Market.address,"0", ABIdata);
          });
        })
        .catch(err => console.log(err));
      }

      confirmTrans() {
          return this.ftweb3.sendSignedTrans(this.Market.serializedTx).catch(err => console.log(err));
      }

      ngOnDestroy(): void {
        if(this.subscribeBlock){
          this.subscribeBlock.unsubscribe();
        }
        if(this.subscribeMyOffers){
          this.subscribeMyOffers.unsubscribe();
        }
        this.ftTokenWatch.TokenWatch.forEach( token => {
          token.subscribeBook.unsubscribe();
          token.subscribeTrades.unsubscribe();
        });
      }

      private processMyOfferEvents(events) {
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
      }

      private setGasAndSignTrans(gasEstimate, amtToSend, ABIdata) {
        this.Market.estimate = gasEstimate;
          this.maxGas = this.ftNum.multiplyBigNumber(gasEstimate, "2");
          return this.ftweb3.signTrans(gasEstimate, this.Market.address, amtToSend, ABIdata);
      }

      private signTrans(signedTrans) {
        this.Market.serializedTx = signedTrans;
        this.Market.receipt = null;
        this.Market.transaction = '';
        this.Market.confirmed = 0;
        this.Market.error = '';
      }
}
