const pyshell = require('python-shell');
const { debug } = require('./debug');
const { setBubble } = require('./Ui/setRangeInputBadge');
const {
  startHeatingProccess,
  stopHeatingProccess,
} = require('./Pi/heatingWaterProccess');
const { startStopFillingWater } = require('./Pi/startStopFillingWater');
const { updateUI } = require('./Ui/updateUI');
const { getIsHeatedTimeAgo } = require('./Pi/heatingWaterProccess');

//read settings.json
const settings = require('./configs/settings.json');
const { saveConfig } = require('./configs/writeChangeConfig');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  /****** open modal ******/

  //register button for opening modal
  const element = document.querySelector('#demo-menu-lower-right') || null;
  const waterRefilingButton =
    document.querySelector('#waterRefilingButton') || null;
  const heatingButton = document.querySelector('#heatingButton') || null;

  const closePieButton = document.getElementById('closePieButton');
  closePieButton.addEventListener('click', () => {
    window.close();
  });
  /***** open overlay to close Pi all together*****/
  const overlayClosePi = document.getElementById('overlayClosePi');
  overlayClosePi.addEventListener('click', () => {
    //test
    pyshell.run('./python/hello.py', function (err, results) {
      if (err) throw err;
      console.log('hello.py finished.');
      console.log('results', results);
    });

    document.getElementById('closePie').style.display = 'block';
  });

  //overlay elements
  const outsideOverlay =
    document.querySelectorAll('.overlay-flex-wrapper') || null;
  /****** close overlay ******/
  const closingElements = [outsideOverlay[0], outsideOverlay[1]];
  closingElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      if (e.target.className === 'overlay-flex-wrapper') {
        //update settings.json on close modal
        settings.SET_TEMPERATURE_VALUE = global.SET_TEMPERATURE_VALUE;
        settings.START_HEATING_AFTER_FILLING_FLAG =
          global.START_HEATING_AFTER_FILLING;
        saveConfig(JSON.stringify(settings));
        //close modal
        overlay.style.display = 'none';
      }

      if (
        e.target.classList.contains('progressBoardContent') ||
        e.target.classList.contains('save')
      ) {
        if (document.querySelector('#closePie'))
          document.querySelector('#closePie').style.display = 'none';
        if (document.querySelector('#heatingBoard'))
          document.querySelector('#heatingBoard').style.display = 'none';
      }
    });
  });

  /****** end of close overlay ******/

  //overlay elements
  const overlay = document.querySelector('.overlay') || null;
  const overlayContent = document.querySelector('#overlay-settings') || null;

  const positionModal = (side = 'right', clickPosition) => {
    const overlayContentWidth = overlayContent.clientWidth;
    switch (side) {
      case 'right':
        overlayContent.style.right = `${
          clickPosition.right + overlayContentWidth
        }px`;
        break;
      case 'left':
        overlayContent.style.left = `${
          clickPosition.left - overlayContentWidth
        }px`;
        break;
      default:
        overlayContent.style.left = `${clickPosition.left}px`;
        break;
    }
    overlayContent.style.top = `${clickPosition.top}px`;
  };

  //reset button water full tank in settings
  const resetWaterTankBttn = document.getElementById('resetWaterTankBttn');
  const iconContainer = document.getElementById('waterIsResetted');
  const doneIcone = document.createElement('i');
  doneIcone.classList.add('material-icons');
  doneIcone.style.color = 'green';
  const text = document.createTextNode('done');

  const clickModalHandler = (position) => (e) => {
    const clickPosition = e.target.getBoundingClientRect();

    //button is disabled when the water tank is already set false
    if (global.WATER_IS_FULL === true) {
      resetWaterTankBttn.removeAttribute('disabled');
    } else {
      resetWaterTankBttn.setAttribute('disabled', true);
    }

    if (iconContainer.children.length) {
      iconContainer.removeChild(doneIcone);
    }

    !!overlay
      ? ((overlay.style.display = 'block'),
        positionModal(position, clickPosition))
      : debug(`${element} not found`);
  };

  //add listeners to registered buttons
  element.addEventListener('click', clickModalHandler('left'));

  /****** close modal ******
  outsideOverlay.addEventListener("click", (e) => {
    if (e.target.className === "overlay-flex-wrapper") {
      //update settings.json on close modal
      settings.SET_TEMPERATURE_VALUE = global.SET_TEMPERATURE_VALUE;
      settings.START_HEATING_AFTER_FILLING_FLAG =
        global.START_HEATING_AFTER_FILLING;
      saveConfig(JSON.stringify(settings));
      //close modal
      overlay.style.display = "none";
    }
  });

  /****** end of modal ******/

  /******display hight and low set Pins ******/
  //pins for immerse heater
  const { setPins } = require('./configs/config');
  const immerse_heaters_pins = setPins.immerse_heaters;
  const inputPins = [...immerse_heaters_pins, setPins.water_pump];

  const PinsContainer = document.getElementById('pinContainer');
  inputPins.forEach(({ pinNumber }) => {
    const pin = document.createElement('div');
    pin.classList.add('material-icons');
    pin.classList.add('mdl-badge');
    pin.classList.add('mdl-badge--overlap');
    pin.classList.add('navyBlueColor');
    pin.classList.add('mdl-badge--no-background');
    pin.id = `pin${pinNumber}`;
    pin.setAttribute('data-badge', pinNumber);
    pin.textContent = 'power';
    PinsContainer.appendChild(pin);
  });

  /****** end of modal ******/

  /***** open heating board *****/
  heatingButton.addEventListener('click', () => {
    updateUI('heatingBoard', '', true);
    startHeatingProccess();
  });

  /***** open water filling board *****/
  waterRefilingButton.addEventListener('click', () => {
    updateUI('waterFillingBoard', '', true);
    startStopFillingWater();
  });

  /*** water tank full info chip**/
  updateUI('fullTankInfo', '', false);
  /*** water heated info chip**/
  getIsHeatedTimeAgo({ stop: true });

  /***** open water level board *****/
  const confirmWaterLevelBttn =
    document.getElementById('confirmWaterLevelBttn') || null;

  confirmWaterLevelBttn.addEventListener('click', () => {
    global.WATER_IS_FULL = true;
    updateUI('waterLevelBoard', '', false);
    updateUI('heatingBoard', '', true);
    /*** water heated info chip**/
    getIsHeatedTimeAgo({ stop: true });

    startHeatingProccess();
  });

  /***** close board *****/
  const terminateProcess = (e) => {
    updateUI('heatingBoard', '', false);
    updateUI('waterFillingBoard', '', false);
    updateUI('waterLevelBoard', '', false);

    stopHeatingProccess();
    startStopFillingWater({ stop: true });
  };
  const terminateProcessButtons =
    document.querySelectorAll('.terminateProcess') || null;

  terminateProcessButtons.forEach((bttn) => {
    bttn.addEventListener('click', terminateProcess);
  });

  //badge or bubble
  const bubble = document.querySelector('.bubble');

  /*  
  const style = bubble.currentStyle || window.getComputedStyle(bubble);
  console.log('bubble', style.paddingRight);
  console.log('bubble', style.paddingLeft);
  console.log('bubble', style.paddingTop);
  console.log('bubble', style.paddingBottom);
  console.log('bubble', style.offsetWidth); 
  set badge once moving knob width set hard due to differences is bubble.scrollWidth
  */

  //range input
  const rangeInputContainer = document.querySelector('.rangeInputContainer');
  const rangeTemperature = document.createElement('input');
  rangeTemperature.classList.add('mdl-slider');
  rangeTemperature.classList.add('mdl-js-slider');
  rangeTemperature.setAttribute('type', 'range');
  rangeTemperature.setAttribute(
    'min',
    JSON.parse(settings.SET_TEMPERATURE_MIN),
  );
  rangeTemperature.setAttribute(
    'value',
    JSON.parse(settings.SET_TEMPERATURE_VALUE),
  );
  rangeTemperature.setAttribute(
    'max',
    JSON.parse(settings.SET_TEMPERATURE_MAX),
  );
  rangeTemperature.setAttribute('step', 'any');
  rangeInputContainer.appendChild(rangeTemperature);
  setBubble(rangeTemperature, bubble, 55);

  rangeTemperature.addEventListener('input', (e) => {
    const { defaultValue, value: currentValue } = e.target;
    //set badge once moving knob width set hard due to differences is bubble.scrollWidth
    setBubble(e.target, bubble, 55);
    debug(`defaultValue ${defaultValue}`);
    debug(`currentValue ${currentValue}`);
  });

  //listener for start heating after filling switch
  const startHeatingAfterFillingSwitch = document.getElementById(
    'switch-start-heating-filling',
  );
  startHeatingAfterFillingSwitch.addEventListener('change', (e) => {
    var previousValue = e.target.getAttribute('previousChecked');
    if (previousValue == 'true') {
      this.checked = false;
      e.target.setAttribute('previousChecked', this.checked);
      global.START_HEATING_AFTER_FILLING = true;
    } else {
      this.checked = true;
      e.target.setAttribute('previousChecked', this.checked);
    }
    global.START_HEATING_AFTER_FILLING = this.checked;
  });

  //reset full tank set handler
  resetWaterTankBttn.addEventListener('click', (e) => {
    if (!iconContainer.children.length) {
      doneIcone.appendChild(text);
      iconContainer.appendChild(doneIcone);
    }
    //update info cheap
    updateUI('fullTankInfo', '', false);
    global.WATER_IS_FULL = false;
  });

  //set initial settings
  global.START_HEATING_AFTER_FILLING = JSON.parse(
    settings.START_HEATING_AFTER_FILLING_FLAG,
  );
  global.WATER_IS_FULL = false;
  startHeatingAfterFillingSwitch.checked = JSON.parse(
    settings.START_HEATING_AFTER_FILLING_FLAG,
  );
  startHeatingAfterFillingSwitch.setAttribute(
    'previousChecked',
    startHeatingAfterFillingSwitch.checked,
  );
});
