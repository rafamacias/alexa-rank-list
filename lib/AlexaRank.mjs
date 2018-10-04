import fetch from 'node-fetch'
import parseXML from 'fast-xml-parser'

class Alexa {
    constructor (domain) {
        this.__url = `http://data.alexa.com/data?cli=10&url=${encodeURIComponent(domain)}` 
        this.domain = domain
        this.globalRank = null
        this.localRank = null
        this.country = null
    }

    async getRank () {
        let response
        try {
            response = await fetch(this.__url)  
        } catch (error) {
            console.error('Http error', error)
        }

        const content = await response.text()
        const jsonObject = Alexa.parseXMLtoJSON(content)

        return this.setRank (jsonObject)
    }

    setRank (json) {
        if (json && json.ALEXA && json.ALEXA.SD){
            const data = json.ALEXA.SD;
            this.globalRank = data.POPULARITY.attr._TEXT
            this.country = data.COUNTRY.attr._CODE
            this.localRank = data.COUNTRY.attr._RANK
            this.reach = data.REACH.attr._RANK
            this.delta = data.RANK.attr.DELTA
            console.info ( `The Alexa rank for "${this.domain}" is Global: ${this.globalRank} and local: ${this.localRank} for the country "${this.country}"`)
        } else {
            console.error(`The domain "${this.domain}" can't be found in the Alexa Rank `)
        }
        return this
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

