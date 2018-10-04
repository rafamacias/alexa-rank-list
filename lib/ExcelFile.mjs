import Alexa from './AlexaRank.mjs'
import Excel from 'exceljs'

class ExcelFile{
    constructor () {
        this.workbook = new Excel.Workbook()
        this.Alexa = Alexa

        this.inputFile = 'sample.xlsx'
        this.outputFile = 'new.xlsx'
        this.sheet = 1
        this.cellDomain = 'B'
        this.cellGlobalRank = 'C'
        this.cellLocalRank = 'D'
        this.cellCountry = 'E'
    }

    process () {

        this.workbook.xlsx.readFile(this.inputFile)
        .then(() => {
            let worksheet = this.workbook.getWorksheet(this.sheet)
    
             worksheet.eachRow( async (row, rowNumber) => {
    
                if (rowNumber === 1) return //header && settings.hasHeaders
    
                let alexa = new this.Alexa(row.getCell(this.cellDomain).value)
                await alexa.getRank()

                row.getCell(this.cellGlobalRank).value = alexa.getGlobalRank()
                row.getCell(this.cellLocalRank).value = alexa.getLocalRank()
                row.getCell(this.cellCountry).value = alexa.getCountry()

                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values)  +'\n')

                await row.commit()
                this.workbook.xlsx.writeFile(this.outputFile)
           })
        })
    }
}

export default ExcelFile