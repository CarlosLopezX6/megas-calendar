const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {
    
    //Manejo de errores.
    const errors = validationResult( req );
    if( !errors.isEmpty() ){                      //Si el arreglo de errores no es vacio
        return res.status(400).json({             //mando como respuesta un status 400 bad request con los errores.
            ok: false,
            errors: errors.mapped()
        })
    }

    next();  //Si no hay ningun error en un middleware o en una validacion, ps se apsa a la otra y asi.

}

module.exports = {
    validarCampos
}