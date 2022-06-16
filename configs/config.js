
/*
    Those pins are set with rpio library that 
    uses physical pins number from 1 to 40 

    *********************************************************
    *2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38 40*
    *1 3 5 7 9  11 13 15 17 19 21 23 25 27 29 31 33 35 37 39*
    *********************************************************

*/

const setPins = {
    immerse_heater_1:{
        setup:"OUTPUT",
        pinNumber:28,
    },
    immerse_heater_2:{
        setup:"OUTPUT",
        pinNumber:26,
    },
    immerse_heater_3:{
        setup:"OUTPUT",
        pinNumber:24,
    },
    water_pump:{
        setup:"OUTPUT",
        pinNumber:22,
    },
    water_level_check:{
        setup:"INPUT",
        pinNumber:11,
    },
   
}

const globals ={

}

module.exports = {setPins,globals}