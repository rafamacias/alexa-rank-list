import {sleep} from './utils.mjs'


class Alexa {
    constructor (domain) {
        this.__url = `fake` 
        this.found = false;
        this.domain = domain
        this.globalRank = null
        this.localRank = null
        this.country = null
        this._apiOverloaded = false;

    }

    async getRank () {
        try {
            await sleep(100, () => {
                // console.log('enters heeererer')
                if ( Math.random() > 0.9 && Math.random() >0.8) {
                    throw new Error();
    
                } else if ( Math.random() < 0.1) {
                    // console.log(`The domain "${this.domain}" can't be found in the Alexa Rank `)
                    this.found = false

                } else if (function(){const min = Math.random();return (min > 0.1 && min < 0.101) ? true : false}()){
                    console.error(`AlexaRank API is blocking it. Stop the app anc dontinue later`)
                    this.found = false
                    this._apiOverloaded = true;

                } else {
                    this.found = true
    
                    this.globalRank = Math.round(Math.random() * 1000 * Math.random() * 75)
                    this.country = 'ES,UK,US,JP,CN,BR,IT,FR,GE,SG,SK,MX,NL,SW,SZ'.split(',')[Math.round(Math.random() * 10)]
                    this.localRank = Math.round(Math.random() * 200 * Math.random() * 75)
                    // console.info ( `The Alexa rank for "${this.domain}" is Global: ${this.globalRank} and local: ${this.localRank} for the country "${this.country}"`)
                }
                return this
            })

            
        } catch (error) {
            console.log('Http error', error)
            this.found = false
            return this
        }  
    }

    get needsToStop () {
        return this._apiOverloaded;
    }

    getCountry () {
        return this.country
    }

    getGlobalRank () {
        return this.globalRank
    }

    getLocalRank () {
        return this.localRank
    }

    isFound () {
        return this.found
    }
}
export default Alexa