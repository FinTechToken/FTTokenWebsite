import { Injectable, OnDestroy } from '@angular/core';

import { FTObserver } from '../FTFramework/FT-Observer';
import { FTCache } from '../FTFramework/FT-Cache';
import { FTSession } from '../FTFramework/FT-Session';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTBigNumberService } from '../FTServices/ft-bigNumber';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';

@Injectable()

export class FTWalletService {
  
  private accountBalance:string="0";
  private subscribeBlock; 
  bankTransDeposit =[];
  bankTransWithdraw =[];
  maxGas="0";
  
  HashCollect = {
    //address: '418c6908502601dc60e7C25068BFbAD51984cEaD',
    address: 'F26974f4926Fe328c766F290C8a2FB20A57e4313',
    //address: '3929A3f520B3434755dDBaccF25025270dE828C7',
    abi:
    [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x06fdde03"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newTransactionFee",
            "type": "uint8"
          },
          {
            "name": "_newTransactionFeeMultiple",
            "type": "uint8"
          },
          {
            "name": "_newTransactionFixedFee",
            "type": "uint256"
          }
        ],
        "name": "updateFees",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0x123fcde6"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_hash",
            "type": "bytes32"
          },
          {
            "name": "_token",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "sendAmount",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0x2b592622"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "transactionFixedFee",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x47fca313"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "freeze",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x62a5af3b"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_token",
            "type": "address"
          }
        ],
        "name": "getOwnerBalance",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x7fcf440a"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "transactionFee",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x9ed3edf0"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "changeOwner",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xa6f9dae1"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_hash",
            "type": "bytes32"
          }
        ],
        "name": "getNeverCached",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xb2caffe5"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_hashKey",
            "type": "string"
          }
        ],
        "name": "getAmount",
        "outputs": [
          {
            "name": "success_",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xe35cf0ca"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "transactionFeeMultiple",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf5fccae2"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
        "signature": "constructor"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "mHash",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "mToken",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "mNow",
            "type": "uint256"
          }
        ],
        "name": "HashSent",
        "type": "event",
        "signature": "0xa595818c9d4b46ea72fbf14cb1e6573fcb7eb0722abbb9e16736b461dffb80cd"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "mHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "mNow",
            "type": "uint256"
          }
        ],
        "name": "HashCached",
        "type": "event",
        "signature": "0x99840862eecd61b78ec947ae70419d187baf3c6f89f0bfb5c311b5f0fccaf3cf"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "mHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "mNow",
            "type": "uint256"
          }
        ],
        "name": "HashNeverCached",
        "type": "event",
        "signature": "0xe72702c36317763472847b2ffc1757bd0ffaab814be916bdcf71197aadcc3cfc"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "mTransFee",
            "type": "uint8"
          },
          {
            "indexed": false,
            "name": "mTransmultiple",
            "type": "uint8"
          },
          {
            "indexed": false,
            "name": "mTransFlatFee",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "mNow",
            "type": "uint256"
          }
        ],
        "name": "MessageChangeFees",
        "type": "event",
        "signature": "0xe422d31ad0a7139b58a00a7ad71cefc619bdf5e99c4698efc980d2414ab0e620"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "mFreeze",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "mNow",
            "type": "uint256"
          }
        ],
        "name": "MessageFreeze",
        "type": "event",
        "signature": "0x4acad4a82756afd37e2d2e935cd96aa2d8c97634700f991592f3b977d6dc7d80"
      }
    ],
    contract:{} as any,
    estimate:"0",
    receipt:null,
    transaction:'',
    confirmed:0,
    error:'',
    serializedTx:null
  };

  constructor ( private session:FTSession, private http: FTHttpClient, private ftTokenWatch: FTTokenWatchService, private ftweb3: FTWeb3Service, private ftNum: FTBigNumberService, private obs: FTObserver, private cache: FTCache ) { 
    this.HashCollect.contract = this.ftweb3.createContractInterface(this.HashCollect.abi, "0x" + this.HashCollect.address);

    this.obs.getObserver('isPreviousUser').forEach( isPrev => {
      if(isPrev){
        this.ftweb3.getMyBalance().then( (balance) => {
          this.accountBalance = balance.toString(); 
        });
        this.subscribeBlock = this.obs.getObserver('block').subscribe( (bn) => {
          this.ftweb3.getMyBalance().then( (balance) => {
            this.accountBalance = balance.toString(); 
          });

          this.ftTokenWatch.TokenWatch.forEach( token => {
            if(token.contract.methods.balanceOf)
              token.contract.methods.balanceOf(this.cache.getCache('encrypted_id').address).call().then(
                result => { token.mine = result.toString();
              });
          });
        });
      }
    });

    this.obs.getObserver('isSignedIn').forEach( isIn => {
      if(isIn) {
        let token = this.session.getItem('token');
        let account = this.session.getItem('account');
        if(token && account) {
          this.http.put("hashSend", JSON.stringify({
              "token" : token,
              "account": account
              })).toPromise()
          .then( data => { 
            this.collectHash(JSON.parse(data).received);
            this.collectExpiredHash(JSON.parse(data).sent); 
          });

          this.http.put("hashSend", JSON.stringify({
            "token" : token,
            "account": account,
            "bankTrans": true
            })).toPromise()
          .then( data => {
            JSON.parse(data).forEach((item, index) => {
              if(item.Deposit)
                this.bankTransDeposit.push(item);
              else if(item.Withdraw)
                this.bankTransWithdraw.push(item);
            });
          })
          .catch( err => console.log(err));
        }      
      }
    });
  }

  //ToDo: Move Hash to it's own service.
  //ToDo: add filter on anything recieved from hash address (Show popup that person received funds);
  //ToDo: Hash lambda should return 3 arrays. Sent(within 30 days), Expired(out of 30 days), Received 

  collectHash( hashes ) {
    if(hashes)
      hashes.forEach(hash => {
        this.buildCollectHashTrans(hash);
      });
  }

  fundHash( hash, amount, tokenAddress, tokenAmount ) {
    if(hash && amount)
      this.buildFundHashAndSend(hash, amount, tokenAddress, tokenAmount);
  }

  collectExpiredHash( hashes ) {
    if(hashes)
      hashes.forEach(hash => {
        this.buildCollectExpiredHashTrans(hash);
      });
  }

  buildCollectHashTrans( hashToCollect) {
    var ABIdata = this.HashCollect.contract.methods.getAmount(hashToCollect ).encodeABI();
    this.HashCollect.contract.methods.getAmount(hashToCollect).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
    .then( (gasEstimate) => {
      this.setGasAndSignTrans(gasEstimate, 0, ABIdata)
      .then(signedTrans => {
        this.signTrans(signedTrans);
        this.ftweb3.sendSignedTrans(this.HashCollect.serializedTx).catch(err => console.log(err));
        return null;
      })
    })
    .catch(err => {console.log(err);}); 
  }

  buildCollectExpiredHashTrans( hashToCollect) {
    var ABIdata = this.HashCollect.contract.methods.getNeverCached(hashToCollect ).encodeABI();
    this.HashCollect.contract.methods.getAmount(hashToCollect).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:0})
    .then( (gasEstimate) => {
      this.setGasAndSignTrans(gasEstimate, 0, ABIdata)
      .then(signedTrans => {
        this.signTrans(signedTrans);
        this.ftweb3.sendSignedTrans(this.HashCollect.serializedTx).catch(err => console.log(err));
        return null;
      })
    })
    .catch(err => {console.log(err);}); 
  }

  withdrawTrans( amount ) {
    this.ftweb3.sendEth('442530d86b60d2c6ab8dc0fcece60082a5ad0252', amount);
  }

  ngOnDestroy(): void {
    if(this.subscribeBlock){
      this.subscribeBlock.unsubscribe();
    }
  }

  getBalance(): string {
    return this.accountBalance;
  }

  private buildFundHashAndSend(hash, amount:string, tokenAddress, tokenAmount:string) {
    var ABIdata = this.HashCollect.contract.methods.sendAmount(hash, tokenAddress,tokenAmount).encodeABI();
    this.HashCollect.contract.methods.sendAmount(hash, tokenAddress,tokenAmount).estimateGas({from:'0x'+this.cache.getCache('encrypted_id').address,value:amount})
    .then( (gasEstimate) => {
      this.setGasAndSignTrans(gasEstimate, amount, ABIdata)
      .then(signedTrans => {
        this.signTrans(signedTrans);
        this.ftweb3.sendSignedTrans(this.HashCollect.serializedTx)
        .catch(err => console.log(err));
        return null;
      })
    })
    .catch(err => {console.log(err);}); 
  }
  
  private setGasAndSignTrans(gasEstimate, amtToSend, ABIdata) {
    this.HashCollect.estimate = gasEstimate;
      this.maxGas = this.ftNum.multiplyBigNumber(gasEstimate, "2");
      return this.ftweb3.signTrans(gasEstimate, this.HashCollect.address, amtToSend, ABIdata);
  }

  private signTrans(signedTrans) {
    this.HashCollect.serializedTx = signedTrans;
    this.HashCollect.receipt = null;
    this.HashCollect.transaction = '';
    this.HashCollect.confirmed = 0;
    this.HashCollect.error = '';
  }
}
