export const validateDomain = (domain) => {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    const regex = new RegExp(expression);

    if (!domain.match(regex)) return false  

    let url = extractHostname(domain)
    
    if (url === '') return false

    if (!url.match(regex)) return false

    return url
}

export const extractHostname = (url) => {
    let hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const sleep = async (ms, fn, ...args) => {
    await timeout(ms);
    return fn(...args);
}

export const needsToDelay = (rowNumber, rowsToDelay) => {
    return Math.floor(rowNumber % rowsToDelay === 0)
}

