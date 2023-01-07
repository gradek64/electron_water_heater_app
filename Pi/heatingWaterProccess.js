const { runOnOffWithTimer } = require("./onOff");
const { readTemperature } = require("./PromiseBased/readWaterTemperature");
const { compareTemperature } = require("./PromiseBased/compareTemperature");
const { turnGPIOPinOnOff } = require("./PromiseBased/turnGPIOPinOnOff");
const { updateUI } = require("../Ui/updateUI");
const { turnPins } = require("./PromiseBased/turnGPIOPinOnOff");
const { debug } = require("../debug");

let seconds = 0;
let minutes = 0;
const runOutTime = 1; //min
let timer;
const getIsHeatedTimeAgo = ({ stop = false } = {}) => {
  if (timer) clearTimeout(timer);
  if (stop === true) {
    console.log("Timer is cleared !!!");
    updateUI("waterHeatedInfo", "", false);
    //reset
    minutes = 0;
    seconds = 0;
    return;
  }
  const myTimeoutFunction = () => {
    if (stop === true) {
      clearTimeout(timer);
      return;
    }
    seconds++;
    if (seconds === 59) {
      minutes++;
      seconds = 0;
    }
    debug("timer is running");

    const formatedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const formatedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const message =
      minutes < runOutTime
        ? `Water was heated ${formatedMinutes}:${formatedSeconds} seconds ago`
        : "Water is cold .. heat it up again !";

    updateUI("waterHeatedInfo", message, true);

    if (minutes >= runOutTime) {
      clearTimeout(timer);
      return;
    }
    //repeat
    timer = setTimeout(myTimeoutFunction, 1000);
  };

  myTimeoutFunction();
};

const startHeatingProccess = async () => {
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
  if (global.WATER_IS_FULL === false) {
    updateUI("heatingBoard", "", false);
    updateUI("waterLevelBoard", "", true);
    return;
  }
  //reset pins state to LOW
  global.SET_PINS = "LOW";

  runOnOffWithTimer({
    delay: 3,
    callbackOn: [readTemperature, compareTemperature, turnGPIOPinOnOff],
  });
};

const stopHeatingProccess = () => {
  //reset previus pin state to HIGH
  global.SET_PINS = "HIGH";
  turnPins({ LOW_HIGH: "LOW" });

  //on turn off no need for any callback
  runOnOffWithTimer({
    run: false,
    callbackOn: () => debug("water heating terminated"),
  });

  /*this has to be reset cause
 //there no way to check if pin is set high
 //unless starting filling water method is called again
 // better mannualy confirm ?*/
  global.WATER_IS_FULL = false;
  updateUI("fullTankInfo", "", false);
};

module.exports = {
  startHeatingProccess,
  stopHeatingProccess,
  getIsHeatedTimeAgo,
};
