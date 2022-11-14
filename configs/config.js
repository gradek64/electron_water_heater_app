
/*
    Those pins are set with rpio library that 
    uses physical pins number from 1 to 40 

    *********************************************************
    *2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38 40*
    *1 3 5 7 9  11 13 15 17 19 21 23 25 27 29 31 33 35 37 39*
    *********************************************************

*/

//Below Pins in general SHOULD NOT be changed
//those pins are attached to 4 relays
//If U need to add imerse heater for spare Pin 
//do it but make sure not other up is using it

const setPins = { 
    immerse_heaters:
    [{
        setup:"OUTPUT",
        pinNumber:28 },
        {
        setup:"OUTPUT",
        pinNumber:26 },
        {
        setup:"OUTPUT",
        pinNumber:24 }
    ],
    water_pump:{
        setup:"OUTPUT",
        pinNumber:22
    },
    //this pin CAN NOT BE changed
    water_level_check:{
        setup:"INPUT",
        pinNumber:11
    },
}


module.exports = {setPins}