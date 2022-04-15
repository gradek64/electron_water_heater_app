const { debug } = require('./debug');
const {terminateScript} = require('./onOff')

// This method is part of chained promise
// every promise will received promise from
// from provious chainined promise
/*objec structure is 
    
    previousPromise = {r0:{data},r1:{data}...}

*/
//order matter this is Promise number 3: that
//vreads alue of prvious Promise 2 so r1
// r1:{...}}
let previouslySet
async function turnGPIOPinOnOff(previousPromise) {
  try {
 
    const {r1} = previousPromise
    if(r1===undefined) throw new Error('{r1} not defined')

    const { shouldTurnOn } = r1
    if(shouldTurnOn===undefined) throw new Error('{r1:{shouldTurnOn:true|false}} not defined')

    if(shouldTurnOn===true) {
        previouslySet=shouldTurnOn
        debug('GPIO pin number On','blue')}
    else if(shouldTurnOn===false) {
        previouslySet=shouldTurnOn
        debug('GPIO pin number OFF','blue')
    } 
    else debug(`GPIO pin number same state::${previouslySet}`,'blue')

    return {GPIO_12:shouldTurnOn}

  } catch (error) {
    // stop pi commands print error terminate GPIO pins work and
    //throw error should be a function that could be used in more places
    // stop_GPIO_Pins()
    debug(`${error}`,'red')

    //stop the process
    terminateScript()
  }
}

module.exports = { turnGPIOPinOnOff };
