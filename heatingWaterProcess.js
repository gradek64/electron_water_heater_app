const { runOnOffWithTimer ,terminateScript} = require('./onOff')
const {readTemperature} = require('./readWaterTemperature')


 const startHeatingProcess =  async () =>{
//.1 start measuring water temperature

//callback on accepts function or array of functions
const ww = await runOnOffWithTimer({delay:2,callbackOn:readTemperature})
console.log('ww',ww)
}

 const  stopHeatingProcess =  () =>{
 //on turn off no need for any callback
 runOnOffWithTimer({run:false})

}

module.exports = { startHeatingProcess, stopHeatingProcess};
