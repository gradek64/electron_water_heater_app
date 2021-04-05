const { debug } = require('./debug');
const { setBubble } = require('./setRangeInputBadge');

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

  //overlay elements
  const overlay = document.querySelector('.overlay') || null;
  const overlayContent = document.querySelector('#overlay-settings') || null;
  const outsideOverlay =
    document.querySelector('.overlay-flex-wrapper') || null;

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

  const clickModalHandler = (position) => (e) => {
    const clickPosition = e.target.getBoundingClientRect();

    !!overlay
      ? ((overlay.style.display = 'block'),
        positionModal(position, clickPosition))
      : debug(`${element} not found`);
  };

  //add listeners to registered buttons
  element.addEventListener('click', clickModalHandler('left'));
  /****** close modal ******/
  outsideOverlay.addEventListener('click', (e) => {
    e.target.className === 'overlay-flex-wrapper'
      ? (overlay.style.display = 'none')
      : false;
  });

  /****** end of modal ******/

  /***** open heating board *****/
  const heatingBoard = document.getElementById('heatingBoard') || null;

  heatingButton.addEventListener('click', () => {
    heatingBoard.style.display = 'block';
  });

  /***** open water filling board *****/
  const waterFillingBoard =
    document.getElementById('waterFillingBoard') || null;

  waterRefilingButton.addEventListener('click', () => {
    waterFillingBoard.style.display = 'block';
  });

  /***** close board *****/
  const terminateProcess = () => {
    heatingBoard.style.display = 'none';
    waterFillingBoard.style.display = 'none';
  };
  const terminateProcessHeating =
    document.getElementById('terminateProcessHeating') || null;
  const terminateProcessFilling =
    document.getElementById('terminateProcessFilling') || null;

  terminateProcessHeating.addEventListener('click', terminateProcess);
  terminateProcessFilling.addEventListener('click', terminateProcess);

  //range input
  const rangeTemperature = document.getElementById('s1');
  //badge or bubble
  const bubble = document.querySelector('.bubble');

  /*  const style = bubble.currentStyle || window.getComputedStyle(bubble);
  console.log('bubble', style.paddingRight);
  console.log('bubble', style.paddingLeft);
  console.log('bubble', style.paddingTop);
  console.log('bubble', style.paddingBottom);
  console.log('bubble', style.offsetWidth); */

  //set badge once moving knob width set hard due to differences is bubble.scrollWidth
  //on load
  setBubble(rangeTemperature, bubble, 55);
  rangeTemperature.addEventListener('input', (e) => {
    const { defaultValue, value: currentValue } = e.target;
    //set badge once moving knob width set hard due to differences is bubble.scrollWidth
    //on load
    setBubble(e.target, bubble, 55);
    debug(`defaultValue ${defaultValue}`);
    debug(`currentValue ${currentValue}`);
  });
});
