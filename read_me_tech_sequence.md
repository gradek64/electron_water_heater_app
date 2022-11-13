Sequeance of files called in this files called in this Electron App

```
electron starts calling
```

1. launch.js
   => sets window object
   => sets templete.html
2. preload.js
   => sets window listeners
   => sets button listeners

```

Filling the water only:

```

1. global.START_HEATING_AFTER_FILLING = false

2. startStopFillingWater.js

3. global.WATER_IS_FULL = false
   ( note !! => even we just finished filling
   up the water we need this flag false for start heating proccess
   confirmation pop up window)

```

Filling the water with heating with confirm pop up:

```

1. global.START_HEATING_AFTER_FILLING = false

2. startStopFillingWater.js

3. heatingWaterProccess.js
   confirmWaterLevelBttn.addEventListener('click', () => {

global.WATER_IS_FULL = true;  
 updateUI('waterLevelBoard','',false);
updateUI('heatingBoard','',true);
startHeatingProccess();

});

```

Filling the water with heating but NO confirm pop up:

```

1. global.START_HEATING_AFTER_FILLING = true

2. startStopFillingWater.js

3. heatingWaterProccess.js

```

Heating the water only:

```

1. global.WATER_IS_FULL = true;

2. heatingWaterProccess.js
   starts the promises chaining as below:

   callbackOn:[readTemperature,compareTemperature,turnGPIOPinOnOff]
