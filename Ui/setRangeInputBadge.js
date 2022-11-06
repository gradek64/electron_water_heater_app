const {updateUI} = require('./updateUI')
const { debug } = require('./debug');


// <!--look for: HERE WHERE U DEFINE RANGE and DEFAULT TEMPERATURE in template.html-->
function setBubble(range, bubble, bubbleSize) {
  const { value, max, min } = range;
  const minValue = min ? min : 0;
  const maxValue = max ? max : 100;
  const newValue = Number(((value - minValue) * 100) / (maxValue - minValue));
  bubble.innerHTML = parseFloat(value).toFixed(2);
  debug(`bubblesize..., ${bubbleSize}`);
  debug(`newValue percentage', ${newValue / 100}`);

  //calculation
  const draggableSize = bubbleSize / 2;
  //the half size has to be set from -bubbleSize/2 for 100% and bubbleSize/2 for 0
  //example size: 26 0%= 13-0 for 100%: 13-26
  const rangeFromPositiveNegativeSize = (draggableSize / 100) * 2;
  debug(
    `newValue rangeFromPositiveNegativeSize
    ${newValue * rangeFromPositiveNegativeSize}`
  );

  bubble.style.left = `calc(${newValue}% + (${
    draggableSize - newValue * rangeFromPositiveNegativeSize
  }px))`;

  //SETTINGS needs to be move to seperate file
  //display desireTemperature
  const temperature = Number(value).toFixed(2);
  global.SET_TEMPERATURE = temperature;
  global.START_HEATING_AFTER_FILLING = true;
  global.WATER_IS_FULL = false;

  updateUI('desireTemperature',`${parseFloat(temperature).toFixed(1)}&#xb0;C`)
  updateUI('desireTemperatureInfo',`${parseFloat(temperature).toFixed(1)}&#xb0;C`)

}

module.exports = { setBubble };
