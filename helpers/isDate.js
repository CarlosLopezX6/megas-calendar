/*
    -Funcion basada en la documentaion de check que es la que valida las cosas:
    -si nosotros mandamos ( value, res ), puedes poner un console.log de res para ver con que otras cosas mas
        puedes hacer las validaciones.
    https://express-validator.github.io/docs/custom-validators-sanitizers.html
*/
const moment = require("moment");


const isDate = ( value ) => {

    if ( !value ){
        return false
    }

    const fecha = moment( value );
    if( fecha.isValid() ){          //isValid() es propia de moment.
        return true
    } else {
        return false
    }
}

module.exports = { isDate };