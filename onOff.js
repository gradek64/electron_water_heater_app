const { debug } = require('./debug');

//clever promise based python type sleep function to stop the code
const sleep = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

/**
 * Determine whether the given `promise` is a Promise.
 *
 * @param {*} promise
 *
 * @returns {Boolean}
 */
 function isPromise(fn) {  
  return !!fn && typeof fn.then === 'function'
}

/**
 * Determine whether the given `promise` is a Promise.
 *
 * @param {*} function
 *
 * @returns {Boolean}
 */
//is regular function
 const isFunction = (fn) => !!fn && typeof fn === 'function'

//is async function
const isAsyncFuntion = (fn) => !!fn && fn.constructor.name === 'AsyncFunction'

const terminateScript = () => {
  debug('terminated by Ctrl+C', 'red');
  //runOnOff({ run: false });
  process.exit();
};


const runOnOff = async ({ run = true } = {}) => {
  if (run) debug('is ON !!!');
  if (!run) debug('is Off !!!');
};

let isRunning;
let checked = false
let isFn;
const runOnOffWithTimer = async (
  { run = true, 
    delay=3, 
    callbackOn,
    callbackOff = ()=>debug('is OFF!! default calback fired off') } = {}
  ) => {
  isRunning = run;
  
  //run forever until break
  while (isRunning === true) {

    //check if callback fn is defined
    if(isRunning && !checked) {
      if(Array.isArray(callbackOn)){
        isFn = callbackOn.every((fn)=>isAsyncFuntion(fn))
        if(!isFn) console.error('YOU NEED DEFINE async callbackOn function in array')
      } else {
        isFn = isFunction(callbackOn)
        if(!isFn) console.error('YOU NEED DEFINE async callbackOn or regular function ')
      }
      checked=true

      if(!isFn){
          runOnOffWithTimer({
            run:false,
            callbackOn:()=>'default'
          })

        return
      }
    }
    
    if(isAsyncFuntion(callbackOn)) {
      debug(`is ON !! ${callbackOn.name} callbackOn fired off`);
      await callbackOn()
    }
    else if(Array.isArray(callbackOn)) {
      //chaining promises callback max 4 fns
      (async () => {
        let r0;
        let r1;
        let r2
        let r3
        r0 = await callbackOn[0]()
        if(callbackOn[1]) r1 = await callbackOn[1](r0)
        if(callbackOn[2]) r2 = await callbackOn[2](r1)
        if(callbackOn[3]) r3 = await callbackOn[3](r2)
        debug(`is ON !! chaing callbackOn result [fn1,fn2,fn3,fn4]: ${r0},${r1},${r2},${r3}`);
      })()
    }
    //regular function
    else callbackOn()

    await sleep(delay);

    // OFF for delay seconds
    callbackOff()
    await sleep(delay);

    if (isRunning === false) {
      debug(`is OFF last !! ${callbackOff.name} callbackOff fired off`);
      break;
    }
  }
  //if came here should be terminated and 
  //meant to be run
  if(isRunning) terminateScript()
};



// Handle Ctrl+C exit cleanly
process.on('SIGINT', () => {
  terminateScript();
});



//tests below
const test0 = async() =>{
  console.log('first async')
  return Promise.resolve(5)
}
const test = async (p)=> {
  console.log('second async')
  return Promise.resolve(p+5)
}
const regularFn = () => console.log('regular fn')

//uncomment when U want to debug this file
runOnOffWithTimer({delay:1,callbackOn:[test0,test]})

module.exports = { runOnOff, runOnOffWithTimer, terminateScript };
