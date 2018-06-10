import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FTWeb3Service } from '../FTServices/ft-web3';
import { FTTokenWatchService } from '../FTServices/ft-tokenWatch';
import { FTObserver } from '../FTFramework/FT-Observer';
import { FTHttpClient } from '../FTFramework/FT-HttpClient';
import { FTSession } from '../FTFramework/FT-Session';
import { Observer, BehaviorSubject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'ft-accountCreate',
  templateUrl: '../../html/components/ft-accountCreate.html'
})

export class FTAccountCreate {

  tabs = 1;
  solidityCode;
  tokenName;
  compileError;
  compiledCode;
  compiledABI;
  compiledName;
  publishedAddress;
  gasEst;
  JSON=JSON;

  constructor( private ftTokenWatch:FTTokenWatchService, private router:Router, private web3: FTWeb3Service, private http: FTHttpClient, private session:FTSession, private obs: FTObserver ) 
  {
    this.solidityCode = this.x();
    this.tokenName = "";
  }
  
  ngOnInit(): void {} 

  ngOnDestroy(): void {}

  ngAfterViewInit(): void{} 

  changeTabs(tab:number): void {
    this.tabs = tab;
  }

  getMyContracts() {
      return this.ftTokenWatch.myContracts;
  }

  name(): void{
      this.solidityCode = this.x().split('NameFreeToken').join(this.tokenName);
  }

  removeNonLetters(): void {
      this.tokenName = this.tokenName.replace(/[^A-Za-z0-9]/g,'').replace(/^[0-9]/, '');
  }

  compile(): void {
    this.compileError=null;
    this.compiledCode=null;
    this.compiledABI=null;
    this.compiledName=null;
    this.gasEst=null;
    this.web3.compile(this.solidityCode)
      .then(data=>{
        let i = 0;
        let j = 0;
        while(i<Object.keys(data).length){
            if(data[Object.keys(data)[i]].code == '0x')
                i++;
            else {
                j=i;
                i++;
            }
        }
            this.compiledName=Object.keys(data)[j].split(':').pop();
            this.compiledCode=data[Object.keys(data)[j]].code;
            this.compiledABI=data[Object.keys(data)[j]].info.abiDefinition;
            this.web3.estimateGasPublish(this.compiledCode, this.compiledABI)
                .then(data=>this.gasEst=data);
      })
      .catch(error=>this.compileError=error.message)
  }

  publish(): void {
      //Todo: Name should include userName of author
      //ToDo: when create account should have username
      this.publishedAddress = null;
      this.web3.signAndSendTrans(this.gasEst, null, 0, this.compiledCode)
      .then(addr => {
          this.publishedAddress = addr.contractAddress;
          let account = this.session.getItem('account');
          let token = this.session.getItem('token');
          this.http.put("publishContract", JSON.stringify({
                "account" : account,
                "token" : token,
                "contractName": this.compiledName,
                "contractABI": this.compiledABI,
                "publishedAddress": this.publishedAddress
                })).toPromise()
            .then( data => {
                data = JSON.parse(data);
            })
            .catch( err => {console.log(err);});
        });
  }

  private x() {
    return `pragma solidity ^0.4.15;

    contract TokenERCOptional { // ethereum.org examples
        function receiveApproval( address _from, uint256 _value, address _token, bytes _extraData ) public returns ( bool success_ ); 
    }
    
    contract NameFreeToken {
        mapping ( address => uint256 ) public balanceOf; //ERC20 Required - Balance of Free Tokens
        mapping ( address => bool ) public gotFree; //Has address gotten free token
        mapping ( address => mapping ( address => uint256 ) ) public allowance; //ERC20 Required - Balance of approvals for transferfrom
        
        uint256 public totalSupply; // ERC20 Required
        uint256 public totalOutstanding; // Total sold
        string public name = "NameFreeToken"; // ERC20 Optional
        string public symbol = "Free"; // ERC20 Optional
        uint8 public decimals = 18; // ERC20 Optional - 18 is most common - No fractional tokens
        address public author; // Creator of smart contract
        address public admin; // Controller of smart contract
        
        event Transfer( address indexed from, address indexed to, uint256 value ); // ERC20 Required
        event Approval( address indexed owner, address indexed spender, uint256 value ); // ERC20 Required
    
        function NameFreeToken() public { //Constructor
            totalSupply = 10000000000000000000000000; //10M tokens + 18 digits
            totalOutstanding = 0;
            author = msg.sender;
        }
    
        function() payable public { //Fallback function. Fail for everything. Only accept legit transactions
            require (false);
        }
    
        function transfer( address _to, uint256 _value ) public returns ( bool success_ ) {   //ERC20 Required - Transfer Tokens
            return internalTransfer(msg.sender, _to, _value);
        }
        
        function transferFrom( address _from, address _to, uint256 _value ) public returns ( bool success_ ) {   // ERC20 Required - Transfer after sender is approved.
            require(_value <= allowance[_from][msg.sender]);
            if ( balanceOf[_from] < _value ) {   //if balance is below approval, remove approval
                allowance[_from][msg.sender] = 0; 
                return false;
            }
            allowance[_from][msg.sender] -= _value;
            return internalTransfer(_from, _to, _value);
        }
    
        function internalTransfer( address _from, address _to, uint256 _value ) internal returns ( bool success_ ) {   // Transfor tokens. 
            require(_to != address(0)); // Prevent transfer to 0x0 address.
            require(balanceOf[_from] >= _value);
            require(balanceOf[_to] + _value > balanceOf[_to]);  // Overflow and > 0 check
            balanceOf[_from] -= _value; 
            balanceOf[_to] += _value; 
            Transfer(_from, _to, _value);
            return true;
        }
    
        function approve( address _spender, uint256 _value ) public returns ( bool success_ ) {   // ERC20 Required - Approve an address to transfor tokens
            require(balanceOf[msg.sender] >= _value);
            allowance[msg.sender][_spender] += _value;
            Approval(msg.sender, _spender, allowance[msg.sender][_spender]);
            return true;
        }
    
        function unapprove( address _spender ) public returns( bool success_ ) {   // Unapprove an address
            require(allowance[msg.sender][_spender] > 0);
            allowance[msg.sender][_spender] = 0;
            Approval(msg.sender, _spender, 0);
            return true;
        }
    
        //ToDo: What happens if they don't have receiveApproval?
        //ToDo: Check example that arguments are in right place.
        //Requires address to have function called "receiveApproval"
        function approveAndCall( address _spender, uint256 _value, bytes _extraData ) public returns ( bool success_ ) {   // Approve Address & Notify _spender ( Ignore reponse )
            if ( approve(_spender, _value) ) {
                TokenERCOptional lTokenSpender = TokenERCOptional(_spender);
                lTokenSpender.receiveApproval(msg.sender, _value, this, _extraData);
                return true;
            }
            return false;
        }
    
        function getFreeToken() public returns ( bool success_ ) {
            require(totalSupply > totalOutstanding);
            require(!gotFree[msg.sender]); 
            totalOutstanding += 1000000000000000000;
            balanceOf[msg.sender] += 1000000000000000000;
            gotFree[msg.sender] = true;
            Transfer(address(0), msg.sender, 1000000000000000000);
            return true;
        }
    }`;
  }
  
}
