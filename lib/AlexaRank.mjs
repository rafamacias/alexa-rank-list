import fetch from 'node-fetch'
import parseXML from 'fast-xml-parser'

class Alexa {
    constructor (domain) {
        this.__url = `http://data.alexa.com/data?cli=10&url=${encodeURIComponent(domain)}` 
        this.found = false;
        this.domain = domain
        this.globalRank = null
        this.localRank = null
        this.country = null
        this._apiOverloaded = false;
    }

    async getRank () {
        if (!this.needsToStop) {
            let response
            try {
                response = await fetch(this.__url)  
                const content = await response.text()
                const jsonObject = Alexa.parseXMLtoJSON(content)

                return this.setRank (jsonObject)
            } catch (error) {
                console.error('Http error', error)
                this.found = false
                return this
            }  
        } 
        return this
    }

    setRank (json) {
        if (json && json.ALEXA && json.ALEXA.SD){
            this.found = true

            const data = json.ALEXA.SD;
            this.globalRank = data.POPULARITY && data.POPULARITY.attr._TEXT || null
            this.country = data.COUNTRY && data.COUNTRY.attr._CODE || null
            this.localRank = data.COUNTRY && data.COUNTRY.attr._RANK || null
            this.reach = data.REACH && data.REACH.attr._RANK || null
            this.delta = data.RANK && data.RANK.attr.DELTA || null
            
            console.info ( `The Alexa rank for "${this.domain}" is Global: ${this.globalRank} and local: ${this.localRank} for the country "${this.country}"`)
        } else if (json && json.ALEXA && json.ALEXA.RLS 
            && json.ALEXA.RLS.RL && json.ALEXA.RLS.RL.attr._HREF.startsWith('www.alexa.com/blocker?')) {
                
            console.error(`AlexaRank API is blocking it. Stop the app anc dontinue later`)
            this.found = false
            this._apiOverloaded = true;
        } else {
            console.info(`The domain "${this.domain}" can't be found in the Alexa Rank `)
            this.found = false
        }
        return this
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

    static parseXMLtoJSON (xmlData) {
        let jsonObj = {}
        let options = {
            attributeNamePrefix : "_",
            attrNodeName: "attr", //default is 'false'
            textNodeName : "#text",
            ignoreAttributes : false,
            ignoreNameSpace : false,
            allowBooleanAttributes : false,
            parseNodeValue : true,
            parseAttributeValue : false,
            trimValues: true,
            cdataTagName: "__cdata", //default is 'false'
            cdataPositionChar: "\\c",
            localeRange: "", //To support non english character in tag/attribute values.
            parseTrueNumberOnly: false
        }
        if (parseXML.validate(xmlData)=== true){//optional
            jsonObj = parseXML.parse(xmlData, options)
        }

        return jsonObj
    }

}
export default Alexa

