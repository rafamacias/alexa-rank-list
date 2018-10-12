export default {
    inputFile: 'data/in/companiesWithDomainNoAlexa.csv',         // Mandatory
    column: {
        domain: 'Company Domain Name', 
        globalRank: 'Company Website Global Alexa Rank',
        localRank: 'Company Website Local Alexa Rank',
        country: 'Country',
    },
    outputFile: 'data/out/new.csv',          // default 'output.csv'
    sheet: 1,                       // default 1
    startingRow: 0,              // default 0
    amountRows: 1000000,            // default 10000
    rowsAfterToDelay: 500,          // default 100
    delayAfterRows: 1000 * 60 * 3,           // default 1000
    delayBetweenRows: 500             // default 0 ms
}