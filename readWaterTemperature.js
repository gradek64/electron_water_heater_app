const fs= require('fs')
const { debug } = require('./debug');
const {terminateScript} = require('./onOff')

// 1.make sure you raspi has wire_1 enabled in configuration first
// 2. read the file w1_slave
const fileTempLocation = '/sys/bus/w1/devices/28-3c01d075eb00/w1_slave';

async function readTemperature() {
  try {
    const data = await fs.promises.readFile(fileTempLocation, 'utf8');

    // Extract temperature info from t=21375 with regex
    const tempMatch = data.match(/t=([0-9]+)/);
    if(!tempMatch){ 
      debug('temperature not read','blue')
      return
    }
    const tempToInt = parseInt(tempMatch[1]);

    if (!tempToInt) throw new Error('temperature not read from file');

    //from 21.234 to 21.3
    const celsius = (tempToInt / 1000).toFixed(1);
    const fahrenheit = (celsius * 1.8 + 32).toFixed(1);

    //logging
    debug(`{celcius:${celsius},fahrenheit:${fahrenheit}}`);

    //update UI
    document.getElementById('info-current-temp').style.display='block'
    document.getElementById('currentTemperature').innerHTML = celsius
    document.getElementById('currentTemperatureInfo').innerHTML = celsius
    
    
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
