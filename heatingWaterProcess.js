const { runOnOffWithTimer ,terminateScript} = require('./onOff')
const {readTemperature} = require('./readWaterTemperature')
const {compareTemperature} = require('./compareTemperature')
const {turnGPIOPinOnOff} = require('./turnGPIOPinOnOff')


 const startHeatingProcess =  async () =>{
//.1 start measuring water temperature

//callback promise order matters cause every promise 
//could return a value used for next chained promise

/*
    the best for those promise is to return object
    which is empty at the begining but 
    once next promise is resolved it makes
    property in that object 
    that way you can use any value for next promises
    so the order doesnt matter so much ? 

    1. read temperature => result
    2. compare temperarure desireTemperature<readTemp => true false
    3. true call GPIO pin
    3a false call of GPIO pin
    4. update UI

*/
runOnOffWithTimer(
    {
    delay:2,
    callbackOn:[readTemperature,compareTemperature,turnGPIOPinOnOff]
    })

}

 const  stopHeatingProcess =  () =>{
 //on turn off no need for any callback
 runOnOffWithTimer({run:false,callbackOn:()=>console.log('water heating terminated')})

}

module.exports = { startHeatingProcess, stopHeatingProcess};
