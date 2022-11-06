const { runOnOffWithTimer } = require('./onOff')
const {readTemperature} = require('./PromiseBased/readWaterTemperature')
const {compareTemperature} = require('./PromiseBased/compareTemperature')
const {turnGPIOPinOnOff} = require('./PromiseBased/turnGPIOPinOnOff')
const {updateUI} = require('../Ui/updateUI')
const {turnPins} = require('./PromiseBased/turnGPIOPinOnOff')




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

//check if water level is full before heating proccess
// and all promises kick off 
console.log('global.WATER_IS_FULL',global.WATER_IS_FULL)
if(global.WATER_IS_FULL === false){
    updateUI('heatingBoard','',false)
    updateUI('waterLevelBoard','',true)
    return
  }

runOnOffWithTimer(
    {
    delay:2,
    callbackOn:[readTemperature,compareTemperature,turnGPIOPinOnOff]
    })

}

 const stopHeatingProcess = () => {

    turnPins({LOW_HIGH:'LOW'})
 //on turn off no need for any callback
 runOnOffWithTimer({run:false,callbackOn:()=>console.log('water heating terminated')})

 /*this has to be reset cause
 //there no way to check if pin is set hight
 //unless starting filling water method is called
 //again better mannualy confirm ?*/
 global.WATER_IS_FULL = false;
 
}

module.exports = { startHeatingProcess, stopHeatingProcess};
