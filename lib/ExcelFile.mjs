import Excel from 'exceljs'
import fs from 'fs'
import CommonFile from './File.mjs'
import {sleep, needsToDelay} from './utils.mjs'

class ExcelFile extends CommonFile{
    constructor (settings, Alexa) {
        super(settings, Alexa)
        this.workbook = new Excel.Workbook()
    }

    getDomainFromRow (row, column) {
        return row.getCell(column.domain).value
    }

    setCellValue (row, column, value) {
        row.getCell(column).value = value
        return row
    }
    
    process () {
        let dataStream = fs.createReadStream(this.settings.inputFile)

        this.deleteOutputFile()
        this.workbook.xlsx.read(dataStream).then((workbook)=> {

            let worksheet = workbook.getWorksheet(1)
            worksheet.eachRow( async (row, rowNumber) => {
    
                if (rowNumber === 1 || rowNumber > this.settings.maxRows) return //header && settings.hasHeaders

                await this.processRow(row, async (modifiedRow) => {
                    this.rowNumber = rowNumber
                    if (modifiedRow) {
                        await row.commit()
                        console.info(`Row ${rowNumber} = ${JSON.stringify(row.values)} \n`)
                        // Should I write here if the row shouldn't be updated?
                        this.workbook.xlsx.writeFile(this.settings.outputFile)
                    }
                })
            })
        })

    }

    deleteOutputFile () {
        try {
            return fs.unlinkSync(this.outputFile)
        } catch (error) {
            console.log(`File ${this.outputFile} doesn't exist. No problem at all.` )
            return 1
        }
    }
}

export default ExcelFile