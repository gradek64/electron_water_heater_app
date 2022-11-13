const { runOnOffWithTimer } = require('./onOff')
const {readTemperature} = require('./PromiseBased/readWaterTemperature')
const {compareTemperature} = require('./PromiseBased/compareTemperature')
const {turnGPIOPinOnOff} = require('./PromiseBased/turnGPIOPinOnOff')
const {updateUI} = require('../Ui/updateUI')
const {turnPins} = require('./PromiseBased/turnGPIOPinOnOff')
const { debug } = require('../debug');

const waterIsHeatedTimeAgo = ()=>{

    setInterval((

        //updateTime
        

    )=>{},1000) 
}

 const startHeatingProccess =  async () =>{
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
if(global.WATER_IS_FULL === false){
    updateUI('heatingBoard','',false)
    updateUI('waterLevelBoard','',true)
    return
 }
//reset pins state to LOW
global.SET_PINS = 'LOW'

runOnOffWithTimer(
    {
    delay:2,
    callbackOn:[readTemperature,compareTemperature,turnGPIOPinOnOff]
    })

}

 const stopHeatingProccess = () => {
//reset previus pin state to HIGH
global.SET_PINS = 'HIGH'
turnPins({LOW_HIGH:'LOW'})

 //on turn off no need for any callback
 runOnOffWithTimer({run:false,callbackOn:()=>debug('water heating terminated')})

 /*this has to be reset cause
 //there no way to check if pin is set high
 //unless starting filling water method is called again
 // better mannualy confirm ?*/
 global.WATER_IS_FULL = false;
 updateUI('fullTankInfo','',false)

}

module.exports = { startHeatingProccess, stopHeatingProccess, waterIsHeatedTimeAgo}
