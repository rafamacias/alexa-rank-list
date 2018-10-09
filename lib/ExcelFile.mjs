import Alexa from './AlexaRank.mjs'
import Excel from 'exceljs'


class ExcelFile{
    constructor (settings) {
        this.workbook = new Excel.Workbook()
        this.Alexa = Alexa

        this.inputFile = settings.inputFile
        this.outputFile = settings.outputFile
        this.sheet = settings.sheet
        this.cellDomain = settings.cellDomain
        this.cellGlobalRank = settings.cellGlobalRank
        this.cellLocalRank = settings.cellLocalRank
        this.cellCountry = settings.cellCountry

        this.maxRows = settings.maxRows || 300
    }

    process () {

        this.workbook.xlsx.readFile(this.inputFile)
        .then(() => {
            let worksheet = this.workbook.getWorksheet(this.sheet)
    
             worksheet.eachRow( async (row, rowNumber) => {
    
                if (rowNumber === 1 || rowNumber > this.maxRows) return //header && settings.hasHeaders
    
                return await this.modifyData(row, rowNumber)
                
           })
        })
    }

    async modifyData(row, rowNumber) {
        let alexa = new this.Alexa(row.getCell(this.cellDomain).value);
        await alexa.getRank();
        if (alexa.isFound()) {
            row.getCell(this.cellGlobalRank).value = alexa.getGlobalRank();
            row.getCell(this.cellLocalRank).value = alexa.getLocalRank();
            row.getCell(this.cellCountry).value = alexa.getCountry();
            console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)} \n`);
            await row.commit();
            this.workbook.xlsx.writeFile(this.outputFile)
            return true
        }
        else {
            console.error(`Row ${rowNumber} = ${row.getCell(this.cellDomain).value} Not found \n`);
            return false
        }
    }
}

export default ExcelFile