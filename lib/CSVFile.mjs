
import csv from 'fast-csv'
import fs from 'fs'

import CommonFile from './File.mjs'

class CSVFile extends CommonFile {
    constructor (settings, Alexa) {
        super(settings, Alexa)
        // this.needsHeaders = ( typeof this.settings.headers.domain == 'number')
        // To implement this to be able to accept numbers as headers
    }

    // static getColumnNumber (columnHeader) {
    //     return ( typeof columnHeader == 'number') ? `h${columnHeader}` : columnHeader
    // }

    process () {
        csv
        .fromPath(this.settings.inputFile, {headers: true})
        .transform((row, next) => { 
            this.processRow(row, (modifiedRow) => {
                console.info(`Row ${this.rowNumber} = ${JSON.stringify(row)} \n`)
                this.rowNumber++
                next(null, modifiedRow)
            })
            
        })
        .pipe(csv.createWriteStream({headers: true, quoteColumns:true}))
        .pipe(fs.createWriteStream(this.settings.outputFile, {encoding: "utf8"}))
    }
}

export default CSVFile