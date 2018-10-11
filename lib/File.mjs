import {validateDomain, needsToDelay, sleep, timeout} from './utils.mjs'

class CommonFile{
    constructor (settings, Alexa) {
        this.rowNumber = 1
        this.Alexa = Alexa
        this.sheet = settings.sheet || 1

        this.settings = {
            inputFile: settings.inputFile,
            outputFile: settings.outputFile || 'output.csv',
            column:{
                domain: settings.column.domain,
                globalRank: settings.column.globalRank,
                localRank: settings.column.localRank,
                country: settings.column.country
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

    getDomainFromRow (row, column) {
        return row[column.domain]
    }

    setCellValue (row, column, value) {
        row[column] = value
        return row
    }

    writeRow (row, alexa, column) {
        row = this.setCellValue(row, column.globalRank, alexa.getGlobalRank())
        row = this.setCellValue(row, column.localRank, alexa.getLocalRank())
        // row = this.setCellValue(row, column.country, alexa.getCountry())
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

    async processRow (row, callback) {
        const rowNumber = this.rowNumber
        const settings = this.settings;

        const url = validateDomain(this.getDomainFromRow(row, settings.column))

        if (rowNumber < settings.startingRow) {
            console.error(`Row ${rowNumber} = skipping first ${settings.startingRow} rows`)
            return callback(null)
        }

        if (rowNumber >= (settings.startingRow + settings.amountRows)) {
            console.error(`Row ${rowNumber} = already completed ${settings.amountRows} rows`)
            return callback(null)
        }

        if (!url) {
            console.error(`Row ${rowNumber} = URL not valid`)
            return callback(null)
        }

        await this.delayProcessing(rowNumber) // TODO: BUG: Doesn't work for XLSX :(

        let alexaRanks = new this.Alexa(url)
        await alexaRanks.getRank()

        if (alexaRanks.needsToStop) {
            this.stopProcessing(rowNumber)
            return callback(null)
        }

        if (alexaRanks.isFound()) {
            row = this.writeRow(row, alexaRanks, this.settings.column)
            return callback(row)
        }
        else {
            console.error(`Row ${rowNumber} = "${url}" not found`)
            return callback(null)
        }
    }
}

export default CommonFile