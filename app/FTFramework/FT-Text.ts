import { Injectable }     from '@angular/core';
//ToDo: have A/B testing built in
@Injectable()
export class FTText {
    text = new Map();
    language = 'en_us';

    constructor () { this.setText(); }
    
    setLanguage( language:string ): void {
        //ToDo: have list of accepted languages. 
        this.language = language;
    }

    getText( key:string ): string {
        if(this.text.has(this.language + '.' + key)) {
            return this.text.get(this.language + '.' + key);
        }
        else {
            return this.text.get('en_us' + '.' + key);
        }
    }

    putText ( language:string, key:string, text:string ): void {
        this.text.set(language + '.' + key, text);
    }

    private setText(): void {
        // Header
        this.putText('en_us', 'header.FTTBlockName', 'FTT');
        this.putText('en_us', 'header.accountOut', 'Sign In');
        this.putText('en_us', 'header.accountNewUser', 'Start');
        this.putText('en_us', 'header.accountIn', 'In');
        this.putText('en_us', 'header.accountName', 'My Account');
        this.putText('en_us', 'header.accountNameNew', 'Get Started');
        this.putText('en_us', 'header.accountNameOut', 'Sign In');
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
        this.putText('en_us', 'home.Hero1', 'One Blockchain Hub<br>Connecting All Crypto');
        this.putText('en_us', 'home.Hero2', `
        Get easy access to all blockchains.<br>
        So you can stay in control.<br>
        On our 100% blockchain platform.`); //Be in control on our 100% blockchain platform
        // Home main text
        this.putText('en_us', 'home.Hero3Head','Blockchain is the most disruptive technology since the Internet');
        this.putText('en_us', 'home.Hero3', `
        But, there is so much happening that it is hard to keep track of it all.<br><br>
        And, getting on blockchain can be confusing and difficult to do anything useful.<br><Br>
        We made it easy so you can get on blockchain to transact, trade, or create something exciting all in one place.`);
        this.putText('en_us', 'home.startButton', 'Get Started');
        this.putText('en_us', 'home.startButtonUser', 'Sign In');
        // Home main text image
        this.putText('en_us', 'home.StickImageURL', '/img/svg/FTT-Character.svg');
        // Home Explanations
        this.putText('en_us', 'home.explainationImageHeader1', 'Secured with CryptoPass');
        this.putText('en_us', 'home.explainationWhatWeDo1', 'Use any major blockchain, secured with one wallet.');
        this.putText('en_us', 'home.explainationImageHeader2', 'BlockChain DNA');
        this.putText('en_us', 'home.explainationWhatWeDo2', `
        Crypto currencies are tokenized on the FinTechToken (FTT) network. 
        This lets you transact and trade fast with ultra low gas costs.`);
        // Home Explanation images
        this.putText('en_us', 'home.explainationImageURL', '/img/svg/FinTechToken_Visual1-04.svg');
        this.putText('en_us', 'home.explainationImageHeader1URL', '/img/svg/Icon_Key.svg');
        this.putText('en_us', 'home.explainationImageHeader2URL', '/img/svg/Icon_DNA.svg');
        // Home Problem Solution Statements
        this.putText('en_us', 'home.valueProblem1', 'Slow and congested');
        this.putText('en_us', 'home.valueSolution1', '1 second transactions with ultra low gas costs');
        this.putText('en_us', 'home.valueProblem2', 'Lost keys and a wallet for each blockchain');
        this.putText('en_us', 'home.valueSolution2', 'Access all major blockchains from one wallet. Never lose keys with CryptoPass');
        this.putText('en_us', 'home.valueProblem3', '3rd party scams and hacks.');
        this.putText('en_us', 'home.valueSolution3', 'Stay in control by using our 100% on blockchain platform.');
        // Home Problem Solution Statement Images
        this.putText('en_us', 'home.ScenarioImageURL1a', '/img/svg/Scenario-Traffic-Lane.svg');
        this.putText('en_us', 'home.ScenarioImageURL1b', '/img/svg/Scenario-Traffic-Fast-Lane.svg');
        this.putText('en_us', 'home.ScenarioImageURL2a', '/img/svg/Scenario-Keys.svg');
        this.putText('en_us', 'home.ScenarioImageURL2b', '/img/svg/Scenario-Cafe.svg');
        this.putText('en_us', 'home.ScenarioImageURL3a', '/img/svg/Scenario-Protesters.svg');
        this.putText('en_us', 'home.ScenarioImageURL3b', '/img/svg/Scenario-Handshake.svg');
    }
}
