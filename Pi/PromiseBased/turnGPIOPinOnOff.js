const rpio = require('rpio');

const { debug } = require('../../debug');
const {terminateScript} = require('../onOff')
const {updateUI}= require('../../Ui/updateUI')
// This method is part of chained promise
// every promise will received promise from
// from provious chainined promise
/*objec structure is 
  
    previousPromise = {r0:{data},r1:{data}...}

*/
//order matter this is Promise number 3: that
//reads value of prvious Promise 2 so r1
// r1:{...}}
let previouslySet

//pins for immerse heater
const { setPins }= require('../../configs/config');
const immerse_heaters_pins = setPins.immerse_heaters;


/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */

const turnPins = ({LOW_HIGH}) =>{
  immerse_heaters_pins.forEach( ({pinNumber, setup},index) => {
    if(LOW_HIGH === 'HIGH' && global.SET_PINS !== 'HIGH' ){
      debug(`pin ${pinNumber} turned: ${LOW_HIGH}`,'blue')
      rpio.open(pinNumber, rpio[setup], rpio.LOW);
      rpio.write(pinNumber,rpio[LOW_HIGH]);
    }
    else if(LOW_HIGH === 'LOW' && global.SET_PINS !== 'LOW' ){
      debug(`pin ${pinNumber} turned: ${LOW_HIGH}`,'blue')
      //pins are defined
      if(rpio.LOW || rpio.HIGH){
        rpio.close(pinNumber, rpio.PIN_RESET);
        rpio.write(pinNumber,rpio[LOW_HIGH]);
      }
    } else {
      debug(`pin ${pinNumber} stays same: ${LOW_HIGH}`,'blue')
    }
    
    //set LOW when all pis for heating are set
    if(index === immerse_heaters_pins.length - 1){
      global.SET_PINS = LOW_HIGH
    } 
   
  })
  debug(`GPIO: ${immerse_heaters_pins.map(({pinNumber})=>`${pinNumber}`)} ==> ${ LOW_HIGH === 'HIGH' ? 'HIGH:on': 'LOW:off' }`,'blue')
}

async function turnGPIOPinOnOff(previousPromise) {
  try {
 
    const {r1} = previousPromise
    if(r1===undefined) throw new Error('{r1} not defined')

    const { shouldTurnOn, setTempReached } = r1
    if( shouldTurnOn === undefined ) throw new Error('{r1:{shouldTurnOn:true|false}} not defined')

    /**display water is heated board based on setTempReached */
    if(setTempReached === true){
      const {  stopHeatingProccess,getIsHeatedTimeAgo } = require('../heatingWaterProccess')
      updateUI('heatingBoard','',false)
      getIsHeatedTimeAgo()
      stopHeatingProccess()
    }
    

    if(shouldTurnOn === true) {
        previouslySet=shouldTurnOn
        turnPins({LOW_HIGH:'HIGH'})
    }
    else if(shouldTurnOn===false) {
        previouslySet=shouldTurnOn
        turnPins({LOW_HIGH:'LOW'})
    } 
    else debug(`GPIO: ${immerse_heaters_pins.map(({pinNumber})=>`${pinNumber}`)} same state::${previouslySet}`,'blue')

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
