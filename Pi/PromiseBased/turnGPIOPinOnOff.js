const rpio = require('rpio');

const { debug } = require('../debug');
const {terminateScript} = require('../onOff')

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

//pins for immerse heater
const { setPins }= require('../configs/config')
const {setup:setup1,pinNumber:pn1} = setPins.immerse_heater_1;
const {setup:setup2,pinNumber:pn2} = setPins.immerse_heater_2;
const {setup:setup3,pinNumber:pn3} = setPins.immerse_heater_3;

/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.open(pn1, rpio[setup1], rpio.LOW);
rpio.open(pn2, rpio[setup2], rpio.LOW);
rpio.open(pn3, rpio[setup3], rpio.LOW);

const pinsSet = [pn1,pn2,pn3]

const turnPins = ({LOW_HIGH}) =>{
  pinsSet.forEach(pin => {
    rpio.write(pin,rpio[LOW_HIGH]);
  });
  debug(`GPIO: ${pinsSet.map((pin)=>`${pin} `)} ==> ${ LOW_HIGH === 'HIGH' ? 'HIGH:on': 'LOW:off' }`,'blue')
}

async function turnGPIOPinOnOff(previousPromise) {
  try {
 
    const {r1} = previousPromise
    if(r1===undefined) throw new Error('{r1} not defined')

    const { shouldTurnOn } = r1
    if(shouldTurnOn===undefined) throw new Error('{r1:{shouldTurnOn:true|false}} not defined')

    if(shouldTurnOn===true) {
        previouslySet=shouldTurnOn
        turnPins({LOW_HIGH:'HIGH'})
    }
    else if(shouldTurnOn===false) {
        previouslySet=shouldTurnOn
        turnPins({LOW_HIGH:'LOW'})
    } 
    else debug(`GPIO: ${pinsSet.map((pin)=>`${pin} `)} same state::${previouslySet}`,'blue')

    return {pins:{pinsSet:shouldTurnOn}}

  } catch (error) {
    // stop pi commands print error terminate GPIO pins work and
    //throw error should be a function that could be used in more places
    // stop_GPIO_Pins()
    debug(`${error}`,'red')

    //stop the process
    terminateScript()
  }
}

module.exports = { turnGPIOPinOnOff, turnPins };
