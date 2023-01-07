const fs = require("fs");
const { debug } = require("../../debug");
const { terminateScript } = require("../onOff");

// 1.this method is part of chained promise
// every promise will received promise from
// from provious chaing promise
/*objec structure is 
    
    previousPromise = {r0:{data},r1:{data}...}

*/
let previusReturn;
//order matter this is Promise number 2: that
//reads promise number 1 so {r0:{...}}
async function compareTemperature(previousPromise) {
  try {
    const { r0 } = previousPromise;
    if (r0 === undefined)
      throw new Error("{r0} not defined in compareTemperature file");
    //from global.SET_TEMPERATURE_VALUE
    const desireTemperature = global.SET_TEMPERATURE_VALUE;

    const { celsius } = r0;
    if (celsius === undefined) throw new Error("{ro:{celsius}} not defined");

    const shouldTurnOn = celsius < desireTemperature;
    const setTempReached = celsius >= desireTemperature;

    return { shouldTurnOn, setTempReached };
  } catch (error) {
    // stop pi commands print error terminate GPIO pins work and
    //throw error should be a function that could be used in more places
    // stop_GPIO_Pins()
    debug(`${error}`, "red");

    //stop the process
    terminateScript();
  }
}

//uncomment 4 lines when U want to debug this file
/*(async ()=>{
const { celsius, fahrenheit } = await readTemperature()
console.log(`Promise return: celcius:${celsius},fahrenheit:${fahrenheit}`)
})();*/

module.exports = { compareTemperature };
