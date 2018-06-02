declare var BigNumber: any;

import { Injectable }     from '@angular/core';

@Injectable()
export class FTBigNumberService {
    
    constructor ( ) { }

    getZero(): string {
        return "0000000000000000000000000000000000000000";
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
    
    divideBigNumber(numberA: string, numberB: string): string {
        if(numberA == "" || !numberA){
            numberA="0";
        }
        if(numberB == "" || !numberB){
            numberB="0"
        }
        let x = new BigNumber(numberA);
        let y = new BigNumber(numberB);
        return x.dividedToIntegerBy(y).toString(10);
    }
    
    multiplyBigNumber(numberA: string, numberB: string): string {
        if(numberA == "" || !numberA){
            numberA="0";
        }
        if(numberB == "" || !numberB){
            numberB="0"
        }
        let x = new BigNumber(numberA);
        let y = new BigNumber(numberB);
        return x.times(y).toString(10);
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

    getEther(number:string): number{
        if(number.length > 18){
            return +number.substr(0,number.length-18);
        }
        else {
            return 0;
        }
    }
    
    getFinney(number: string): number{
        return this.getNumberPart(number, 15, 18);
    }

    getSzabo(number: string): number{
        return this.getNumberPart(number, 12, 15);
    }

    getGwei(number: string): number{
        return this.getNumberPart(number, 9, 12);
    }

    getMwei(number: string): number{
        return this.getNumberPart(number, 6, 9);
    }

    getKwei(number: string): number{
        return this.getNumberPart(number, 3, 6);
    }
    
    getWei(number: string): number{
        return this.getNumberPart(number, 0, 3);
    }

    private getNumberPart(number: string, numberLow, numberHigh) {
        if(number.length > numberHigh)
            number = number.substr(number.length - numberHigh);
        if(number.length > numberLow)
            return +number.substr(0, number.length-numberLow);
        else
            return 0;
    }

}
