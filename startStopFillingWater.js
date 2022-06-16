const { poll } = require('rpio');
var rpio = require('rpio');
const {updateUI}= require('./updateUI')
const {debug} = require('./debug')

//import pin setup from config
const { setPins }= require('./configs/config')
const {setup,pinNumber} = setPins.water_level_check;

let isConnected = false
/*
If running a newer Raspbian release, 
you will need to add the following line to /boot/config.txt and reboot:
to prevent crushes:

dtoverlay=gpio-no-irq

above in /boot/config.txt
*/ 	

const startStopFillingWater = ({stop}={stop:false}) => {
	isConnected = false; 
	if(stop === true){
		//close the pin and all its events and reset to STATE LOW
		rpio.close(pinNumber, rpio.PIN_RESET);
		debug(`Pin ${pinNumber} reset to: ${rpio.read(pinNumber) ? 'high' : 'low'}`,'blue');
		//swich of the pump ideally check if it was low
		console.log('PIN water pump set LOW')
		return 
	}

	rpio.open(pinNumber, rpio[setup], rpio.PULL_DOWN);
	debug(`Pin ${pinNumber} is initial ${rpio.read(pinNumber) ? 'high' : 'low'}`,'blue');

	//set the water pump pin high
	setTimeout(()=>{
		if(!isConnected) console.log('PIN water pump set HIGH')
	},200)


//this pollcb is set to listen only for HIGH pin set
const pollcb = (pin) =>{
		debug('water filling activated','blue')

		
		if(isConnected) return;
		/*
		* Wait for a small period of time to avoid rapid changes which
		* can't all be caught with the 1ms polling frequency.  If the
		* pin is no longer down after the wait then ignore it.
		*/
		rpio.msleep(20);

		//after this point connection is established
		isConnected=true 
				/* 
					you need exit pin after time out to
					prevent setting to be remember on next 
					imidiate run
				*/
				setTimeout(()=>{
						if(isConnected) {
									//reset pin
									rpio.poll(pin, null)
									debug(`${pinNumber} job completed ! ${rpio.read(pinNumber) ? 'high' : 'low'}`,'blue');
									//set global notification
									global.WATER_IS_FULL = true;

									//switch off the water pump set pin LOW ideally check if it was low 
									console.log('water pump pin is LOW')
						} 

						//NEXT STEPS 

						//when global START_HEATING_AFTER_FILLING = true
						//start heating immidiatelly
						if(global.START_HEATING_AFTER_FILLING){
									updateUI('waterFillingBoard','',false)
									const heatingButton = document.getElementById('heatingButton') || null;
									heatingButton.click()
									console.log('heatingBoard',heatingButton)
						} else {
							updateUI('waterFillingBoard','',false)
							updateUI('fullTankInfo','',true)
							//reset this to get pop up cofirmation for heating proccess
							global.WATER_IS_FULL = false;
						}
				},100)
		
}

//listen for pin pin hight event
rpio.poll(pinNumber, pollcb, rpio.POLL_HIGH);

/*only for test; commet for real usage
	pollcb(11)
*/
}

module.exports = { startStopFillingWater }