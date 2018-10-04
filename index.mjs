import ExcelFile from './lib/ExcelFile.mjs'
import settings from './settings.mjs'

const excelFile = new ExcelFile(settings)
excelFile.process()

