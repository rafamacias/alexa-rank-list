

class Row {
    constructor (rowInfo, rowNumber, settings) {
        this.rowNumber = rowNumber
        this.row = rowInfo

        this.url = null
        this.domains = []
        this.domainsChecked = []

        this.headers = {
            domain: [settings.column.domain, settings.column.web, settings.column.name],
            globalRank: settings.column.globalRank,
            localRank: settings.column.localRank,
            country: settings.column.country
        }
        // this.needsHeaders = ( typeof this.settings.column.domain == 'number')
        // To implement this to be able to accept numbers as headers
    }

    // static getColumnNumber (columnHeader) {
    //     return ( typeof columnHeader == 'number') ? `h${columnHeader}` : columnHeader
    // }

    getDomainFromRow (column) {
        return this.row[column.domain]
    }

    findTheRightDomain (headers) {
        if (Array.isArray(headers.domain)) {
            return headers.domain.find(urlHeader => {
                return validateDomain(getDomainFromRow(this.row, urlHeader))
            })
        } else {
            return validateDomain(getDomainFromRow(headers.domain))
        }
    }

    get rowNumber () {
        return this.rowNumber
    }

    set rowNumber (number) {
        this.rowNumber = number
    }
}

export default Row