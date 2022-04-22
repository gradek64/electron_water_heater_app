const fs= require('fs')
const { debug } = require('./debug');
const {updateUI} = require('./updateUI')
const {terminateScript} = require('./onOff')

// 1.make sure you raspi has wire_1 enabled in configuration first
// 2. read the file w1_slave
const fileTempLocation = '/sys/bus/w1/devices/28-3c01d075eb00/w1_slave';
let celsius = 0
let fahrenheit = 0
async function readTemperature() {
  try {
    const data = await fs.promises.readFile(fileTempLocation, 'utf8');

    // Extract temperature info from t=21375 with regex
    const tempMatch = data.match(/t=([0-9]+)/);
    if(!tempMatch){ 

      if(celsius && fahrenheit) return { celsius, fahrenheit };

      debug('temperature not read and previous not set','blue')
      return  { celsius, fahrenheit };
    }
    const tempToInt = parseInt(tempMatch[1]);

    if (!tempToInt) throw new Error('temperature not read from file');

    //from 21.234 to 21.3
     celsius = (tempToInt / 1000).toFixed(1);
     fahrenheit = (celsius * 1.8 + 32).toFixed(1);

    //logging
    debug(`{celcius:${celsius},fahrenheit:${fahrenheit}},SET_TEMPERATURE:${SET_TEMPERATURE}`);

    //update UI
    updateUI('currentTemperature',`${celsius}&#xb0;C`)
    //front chips board
    updateUI('info-current-temp','',true)
    updateUI('currentTemperatureInfo',`${celsius}&#xb0;C`)
    
    
    return { celsius, fahrenheit };

  } catch (error) {
    // stop pi commands print error terminate GPIO pins work and
    //throw error should be a function that could be used in more places
    // stop_GPIO_Pins()
    debug(`${error}`,'red')

    //stop the process
    terminateScript()
  }
}

//uncomment 4 lines when U want to debug this file
/*(async ()=>{
const { celsius, fahrenheit } = await readTemperature()
console.log(`Promise return: celcius:${celsius},fahrenheit:${fahrenheit}`)
})();*/

module.exports = { readTemperature };
