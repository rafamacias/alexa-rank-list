import {validateDomain, needsToDelay, fileLogger, timeout, protocolize} from './utils.mjs'
import urlExists from 'url-exists-deep'
import { exists } from 'fs';

class CommonFile{
    constructor (settings, Alexa) {
        this.rowNumber = 1
        this.Alexa = Alexa
        this.sheet = settings.sheet || 1

        this.settings = {
            inputFile: settings.inputFile,
            outputFile: settings.outputFile || 'output.csv',
            headers:{
                domain: settings.headers.domain,//[settings.headers.domain, settings.headers.web, settings.headers.name],
                globalRank: settings.headers.globalRank,
                localRank: settings.headers.localRank,
                country: settings.headers.country
            },
            startingRow: settings.startingRow || 0,
            amountRows: settings.amountRows || 300,
            rowsAfterToDelay: settings.rowsAfterToDelay || 200,
            delayAfterRows: settings.delayAfterRows || 1000,
            delayBetweenRows: settings.delayBetweenRows || 0,
        }
    }

    getFromRow(row, columnHeader) {
        return row[columnHeader]
    }

    getDomainFromRow (row, headers) {
        return row[headers.domain]
    }

    setCellValue (row, headers, value) {
        row[headers] = value
        return row
    }

    writeRow (row, alexa, headers) {
        row = this.setCellValue(row, headers.globalRank, alexa.getGlobalRank())
        row = this.setCellValue(row, headers.localRank, alexa.getLocalRank())
        // row = this.setCellValue(row, headers.country, alexa.getCountry())
        return row
    }

    async delayProcessing (rowNumber) {
        let isDelayed = needsToDelay(rowNumber, this.settings.rowsAfterToDelay)

        if (isDelayed) {
            console.log(`Row ${rowNumber}. Sleeping...`)
            await timeout(isDelayed * this.settings.delayAfterRows)
            console.log('Resuming!')
        }
        if (this.settings.delayBetweenRows) {
            await timeout(this.settings.delayBetweenRows)
        }
    }

    stopProcessing (rowNumber) {
        console.info(`The last row processed was ${rowNumber}.`)
        // Might need to stop another way.
        process.exit(1)
    }

    findTheRightDomain (row, headers) {
        let urls = []
        let domains = []
        //TODO: convert the elem it into array
        if (!Array.isArray(headers.domain)) {
            domains.push(headers.domain)
        } else {
            domains = headers.domain
        }

        for (let i = 0; i < domains.length; i++) {
            const url = validateDomain(this.getFromRow(row, domains[i]))
            if (url) urls.push(url)
        }
        return (urls.length) ? urls : false
    }

    async processRow (row, callback) {
        const rowNumber = this.rowNumber
        const settings = this.settings;

        //const url = validateDomain(this.getDomainFromRow(row, settings.headers))

        const urls = this.findTheRightDomain(row, settings.headers)

        console.log(`Row ${this.rowNumber} URL = ${urls}`)

        if (rowNumber < settings.startingRow) {
            console.error(`Row ${rowNumber} = skipping first ${settings.startingRow} rows`)
            return callback(null)
        }

        if (rowNumber >= (settings.startingRow + settings.amountRows)) {
            console.error(`Row ${rowNumber} = already completed ${settings.amountRows} rows`)
            return callback(null)
        }

        if (!urls) {
            console.error(`Row ${rowNumber} = URL not valid`)
            return callback(null)
        }

        await this.delayProcessing(rowNumber) // TODO: BUG: Doesn't work for XLSX :(

        const modifiedRow = await this.processUrls(urls, row, rowNumber)

        //console.log(`ROW ${rowNumber}. Doing the callback for ${JSON.stringify(modifiedRow)}`)
        callback(modifiedRow)
    }

    async processUrls(urls, row, rowNumber) {
        let urlsProcessed = []
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]

            if (urlsProcessed.indexOf(url) < 0 ) {
                const modifiedRow = await this.processUrl(url, row, rowNumber)
                
                urlsProcessed.push(url)

                if (modifiedRow) {
                    return modifiedRow
                }
            }
        }
        return false
    }

    async processUrl(url, row, rowNumber) {
        if (exists) {
            let alexaRanks = new this.Alexa(url)

            await alexaRanks.getRank()
            if (alexaRanks.needsToStop) {
                this.stopProcessing(rowNumber)
                return null
            }
    
            if (alexaRanks.isFound()) {
                let modifiedRow = this.writeRow(row, alexaRanks, this.settings.headers)
                return modifiedRow
            } else {
                return await urlExists(protocolize(url))
                    .then(response => {
                        if (response) {
                            console.error(`Row ${rowNumber} = "${url}" with NO rank in ALEXA`)
                            return null
                        } else {
                            console.error(`Row ${rowNumber} = "${url}" not found. Needs to go to another CSV`)
                            fileLogger(row)
                            return null                        
                        }
                    })
                    .catch( error => {
                        console.error(`Row ${rowNumber} = "${url}" not found. Needs to go to another CSV`)
                        fileLogger(row)
                        return null  
                    })
            }
        }
    }
}

export default CommonFile