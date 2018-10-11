export default {
    inputFile: 'data/in/sample.csv',         // Mandatory
    column: {
        domain: 'D',                // Mandatory
        globalRank: 'I',            // Mandatory
        localRank: 'J',             // Mandatory
        country: 'K',               // Mandatory
    },
    outputFile: 'data/out/new.csv',          // default 'output.csv'
    sheet: 1,                       // default 1
    startingRow: 0,              // default 0
    amountRows: 1000000,            // default 10000
    rowsAfterToDelay: 500,          // default 100
    delayAfterRows: 1000 * 60 * 5,           // default 1000
    delayBetweenRows: 100             // default 0 ms
}