import { Injectable }     from '@angular/core';
//ToDo: have A/B testing built in
@Injectable()
export class FTText {
    text = new Map();
    language = 'en_us';

    constructor () { this.setText(); }
    
    setLanguage( language:string ) {
        //ToDo: have list of accepted languages. 
        this.language = language;
    }

    getText( key:string ) {
        if(this.text.has(this.language + '.' + key)) {
            return this.text.get(this.language + '.' + key);
        }
        else {
            return this.text.get('en_us' + '.' + key);
        }
    }

    putText ( language:string, key:string, text:string ) {
        this.text.set(language + '.' + key, text);
    }

    private setText() {
        // Header
        this.putText('en_us', 'header.FTTBlockName', 'FTT');
        this.putText('en_us', 'header.accountOut', 'Sign In');
        this.putText('en_us', 'header.accountNewUser', 'Start');
        this.putText('en_us', 'header.accountIn', 'In');
        this.putText('en_us', 'header.accountName', 'My Account');
        this.putText('en_us', 'header.messagesName', 'Messages');
        // Footer
        this.putText('en_us', 'footer.Code', 'Token Sourced Code');
        this.putText('en_us', 'footer.Community', 'Decentralized Community');
        this.putText('en_us', 'footer.CodeSmall', 'Code');
        this.putText('en_us', 'footer.CommunitySmall', 'Community');
        // FooterLinks
        this.putText('en_us', 'footer.CodeLink', 'https://github.com/FinTechToken');
        this.putText('en_us', 'footer.CommunityLink', 'http://decstack.com/');
        // Home Hero
        this.putText('en_us', 'home.Hero1', 'One Blockchain Hub Connecting All Cryptos');
        this.putText('en_us', 'home.Hero2', 'Trade with control on our 100% blockchain platform');
        this.putText('en_us', 'home.Hero3', '');
        this.putText('en_us', 'home.Hero4', '');
        this.putText('en_us', 'home.startButton', 'Get Started');
        // Home Explanation Image
        this.putText('en_us', 'home.explainationImageURL', '/img/svg/FinTechToken_Visual1-02.svg');
        this.putText('en_us', 'home.explainationImageHeader1', 'CryptoPass');
        this.putText('en_us', 'home.explainationWhatWeDo1', 'Securely use any major blockchain with one wallet.');
        this.putText('en_us', 'home.explainationImageHeader2', 'BlockChain DNA');
        this.putText('en_us', 'home.explainationWhatWeDo2', 'Crypto currencies are tokenized on the FinTechToken (FTT) network. This lets you trade fast with ultra low gas costs.');
        // Home Problem Solution Statements
        this.putText('en_us', 'home.valueProblem1', 'Tired of slow congested blockchains?');
        this.putText('en_us', 'home.valueSolution1', 'We deliver 1 second transactions with ultra low gas costs.');
        this.putText('en_us', 'home.valueProblem2', 'Scared of losing your keys or misplacing a wallet?');
        this.putText('en_us', 'home.valueSolution2', 'Access all major blockchains from one wallet. Never lose keys with CryptoPass');
        this.putText('en_us', 'home.valueProblem3', 'Don\'t risk your digital assets by sending them to an exchange.');
        this.putText('en_us', 'home.valueSolution3', 'Stay in control by using our 100% on blockchain platform.');
    }
}