const { poll } = require('rpio');
var rpio = require('rpio');
const {updateUI}= require('./updateUI')

/*
If running a newer Raspbian release, 
you will need to add the following line to /boot/config.txt and reboot:
to prevent crushes:

dtoverlay=gpio-no-irq

above in /boot/config.txt
*/

//set this metod the way it can also
//teminate the process (turn off and reset pin)
const startStopFillingWater = ({stop}={stop:false}) => {

       console.log('stop',stop)
       if(stop === true){
          //reset pin
          //rpio.poll(11, null)
          //set global notification (terminated)
          global.WATER_IS_FULL = false;   
          console.log('return stop',stop)
          return 
       }

        rpio.open(11, rpio.INPUT, rpio.PULL_DOWN);
        console.log('Pin 11 initial ' + (rpio.read(11) ? 'high' : 'low'));

        let times = 0
        let isConnected = false
        function pollcb(pin) {
                console.log('water filling activated')
                if(isConnected) return;
                // if (rpio.read(pin)) return;
                
                console.log('executed times:',++times)
                console.log('isconnected',isConnected)
                
                /*
                * Wait for a small period of time to avoid rapid changes which
                * can't all be caught with the 1ms polling frequency.  If the
                * pin is no longer down after the wait then ignore it.
                */
                rpio.msleep(20);

                //!!uncoment for real scenario
               // if (!rpio.read(pin) && !isConnected){
                isConnected=true 
                
                console.log('connection established call pin out OFF for pump')
                        
                //BUG
                // you need exit pin after time out to
                //prevent setting to be remember on next 
                //imidiate run
                setTimeout(()=>{
                 console.log('aborted')
                 if(isConnected) {
                        //reset pin
                        rpio.poll(pin, null)
                        //set global notification
                        global.WATER_IS_FULL = true;
                 } 

                 //when global START_HEATING_AFTER_FILLING = true
                 //start heating immidiatelly
                 if(global.START_HEATING_AFTER_FILLING){
                        updateUI('waterFillingBoard','',false)
                        const heatingButton = document.getElementById('heatingButton') || null;
                        heatingButton.click()
                        console.log('heatingBoard',heatingButton)
                 }
                
                //},100)
                },2000)
                
                
               // }
        }

        rpio.poll(11, pollcb, rpio.POLL_HIGH);

        //only for test; commet for real usage
        pollcb(11)
}

module.exports = { startStopFillingWater }