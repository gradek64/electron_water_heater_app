
/**
 * @params {string} elementID
 * @params {string} value
 * @params {boolean} show = true
 * 
 */
let elements = {}

const updateUI = (elementID,value,show) => {
    if(!elements[elementID]) {
        elements[elementID] = document.getElementById(elementID); 
    }

    if(!!value && typeof value ==='string') elements[elementID].innerHTML=value


    if(show===true) elements[elementID].style.display='block';
    if(show===false) elements[elementID].style.display='none';



}


module.exports={updateUI}