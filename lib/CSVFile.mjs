
import csv from 'fast-csv'
import fs from 'fs'

import CommonFile from './File.mjs'
import {timeout, needsToDelay} from './utils.mjs'


class CSVFile extends CommonFile{
    constructor (settings, Alexa) {
        super(settings, Alexa)
        this.settings.column = {
            domain: 'Company Domain Name', //settings.column.domain,
            globalRank: 'Company Website Global Alexa Rank',//settings.column.globalRank,
            localRank: 'Company Website Local Alexa Rank',//settings.column.localRank,
            country: 'Country',// settings.column.country
        }
        // this.needsHeaders = ( typeof this.settings.column.domain == 'number')
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