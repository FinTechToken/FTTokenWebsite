import { Injectable, OnDestroy } from '@angular/core';

import { FTWeb3Service } from '../FTServices/ft-web3';

@Injectable()

export class FTTokenWatchService {

  private ERC20ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gotFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalOutstanding","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getFreeToken","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"}],"name":"unapprove","outputs":[{"name":"success_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
  TokenWatch:any[] = [];
  /*
  address, name, contract, mine, mineTrade, subscribeBook, buyMap, sellMap, subscribeTrades, lastPrice, lastCount, tradeMap, myTradesMap
  */

  constructor ( private ftweb3: FTWeb3Service ) { 
    let token:any = {address:'0x2d5e86187855CC29B40469e8a7355f3fDBf4C088', name:'TradeToken', mine:'0', mineTrade:'0', buyMap:{}, sellMap:{}, tradeMap:{}, myTradesMap:{}, lastPrice:'0', lastCount:'0' };
    this.TokenWatch.push(token);
    token = {address:'0x9287bb21719d283CfdD7d644a89E8492f9845B64', name:'FreeToken', mine:'0', mineTrade:'0', buyMap:{}, sellMap:{}, tradeMap:{}, myTradesMap:{}, lastPrice:'0', lastCount:'0' };
    this.TokenWatch.push(token);

    this.TokenWatch.forEach( token => {
      token.contract = this.ftweb3.createContractInterface(this.ERC20ABI, token.address.substring(2));
    });
  }

  ngOnDestroy(): void {
  }

  getTokenIndexByAddress(address) {
    return this.TokenWatch.findIndex(x => x.address === address);
  }

}
