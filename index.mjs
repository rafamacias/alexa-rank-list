import ExcelFile from './lib/ExcelFile.mjs'
import CSVFile from './lib/CSVFile.mjs'

import Alexa from './lib/AlexaRank.mjs'
import settings from './settings.mjs'

let sourceFile;
// TODO: Check that inputfile and column exists in Settings and its values or Throw an Error and exit

if (settings.inputFile.endsWith('.csv')) {
    sourceFile = new CSVFile(settings, Alexa)

} else if (settings.inputFile.endsWith('.xlsx')) {
    sourceFile = new ExcelFile(settings, Alexa)

} else {
    throw new Error('File type not supported. Now only .csv & .xlsx. Modify the file "settings.mjs" ')
}

sourceFile.process()