// import Alexa from './lib/alexa-rank.mjs'
// let main = () => {
//     console.log('rafa');
// }


// main();

// var alexa = new Alexa ();
// alexa.findRank('facebook.com', (error, result) => {
//     if (error) return;

//     //console.log(result)

//     alexa.getGlobalRank(result)

// })


var alexarank = require('alexarank');

alexarank("http://www.echojs.com/", function(error, result) {
    if (!error) {
        console.log(JSON.stringify(result));
    } else {
        console.log(error);
    }
});