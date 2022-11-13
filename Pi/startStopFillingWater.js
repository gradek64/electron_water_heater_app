const { poll } = require('rpio');
var rpio = require('rpio');
const {updateUI}= require('../Ui/updateUI')
const {debug} = require('../debug')

//import pin setup from config
const { setPins }= require('../configs/config')
const { setup, pinNumber} = setPins.water_level_check;
const { setup:setupWaterPump, pinNumber:pinWaterPump} = setPins.water_pump

let water_curcuit_closed = false
/*
If running a newer Raspbian release, 
you will need to add the following line to /boot/config.txt and reboot:
to prevent crushes:

dtoverlay=gpio-no-irq

above in /boot/config.txt
*/ 	

const startStopFillingWater = ({stop}={stop:false}) => {
	water_curcuit_closed = false; 

	if(stop === true){
		//when pin is defined/LOW close the pin and all its events and reset to STATE LOW
		 if(rpio.LOW){
			rpio.close(pinNumber, rpio.PIN_RESET);
			//swich of the pump ideally check if it was low
			rpio.write(pinWaterPump,rpio.LOW);
		 }
		debug('PIN water pump set LOW')
		return 
	}

	rpio.open(pinNumber, rpio[setup], rpio.PULL_DOWN);
	debug(`Pin ${pinNumber} is initial ${rpio.read(pinNumber) ? 'high' : 'low'}`,'blue');

	//set the water pump pin high
	setTimeout(()=>{
		if(!water_curcuit_closed){

			rpio.open(pinWaterPump, rpio[setupWaterPump], rpio.LOW);
      		rpio.write(pinWaterPump,rpio.HIGH);
			debug('PIN water pump set HIGH')
		} 
	},200)


//this pollcb is set to listen only for HIGH pin set
const pollcb = (pin) =>{
		debug('water filling activated','blue')
		
		if(water_curcuit_closed) return;
		/*
		* Wait for a small period of time to avoid rapid changes which
		* can't all be caught with the 1ms polling frequency.  If the
		* pin is no longer down after the wait then ignore it.
		*/
		rpio.msleep(20);

		//after this point connection is established
		water_curcuit_closed = true 
				/* 
					you need exit pin after time out to
					prevent setting to be remember on next 
					imidiate run
				*/
				setTimeout(()=>{
						if(water_curcuit_closed) {
									//reset pin
									rpio.poll(pin, null)
									debug(`${pinNumber} job completed ! ${rpio.read(pinNumber) ? 'high' : 'low'}`,'blue');
									//set global notification
									global.WATER_IS_FULL = true;
									updateUI('fullTankInfo','',true)

									//switch off the water pump set pin LOW ideally check if it was low 
									rpio.write(pinWaterPump,rpio.LOW);
									debug('water pump pin is LOW')
						} 

						//NEXT STEPS 

						//when global START_HEATING_AFTER_FILLING = true
						//start heating immidiatelly
						if(global.START_HEATING_AFTER_FILLING){
							updateUI('waterFillingBoard','',false)
							const heatingButton = document.getElementById('heatingButton') || null;
							heatingButton.click()
						} else {
							updateUI('waterFillingBoard','',false)	
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