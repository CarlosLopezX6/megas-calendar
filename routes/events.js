/*
    Rutas de Eventos:

    host + /api/events

    NOTA: Si las peticiones mandan como respuesta un token no valido quiere decir que debes de generar un nuevo token
    logueando un usuario X y ese token generarlo pegarlo en el header del token.
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

/* 
    -Todas tienen que pasar por la validacion del JWT.
    -Para no poner el middleware "validarJWT" en cada una de las rutas, lo pondremos hasta arriba.
    -Al hacer esto le digo que cualquier peticion que se encuentre justo abajo de esto, va a tener que tener su token.
    -Si por ejemplo queremos que getEventos sea publica, ps la linea de aqui abajo la tendremos que poner despues de esa peticion,
        haciendo esto en la peticion de obtener eventos no sera necesaria la validacion del token y 
        le quitaremos esa capa de seguridad pero eso ya queda a discrecion de cada quien.
*/
router.use( validarJWT );



// Obtener Eventos.
// GET    localhost:4000/api/events                   Headers:  key -> x-token   value -> Un token valido
router.get( '/', getEventos );



// Crear un evento nuevo.
// POST    localhost:4000/api/events                  Headers:  key -> x-token   value -> Un token valido
router.post( '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),  //Validacion custom para fechas.
        check('end', 'La fecha final es obligatoria').custom( isDate ),        //Validacion custom para fechas.
        validarCampos 
    ],
    crearEvento );



// Actualizar Evento.
// PUT    localhost:4000/api/events/id (del evento que exista en la db)     Headers:  key -> x-token   value -> Un token valido
router.put( '/:id', actualizarEvento );



// Borrar Evento.
// DELETE   localhost:4000/api/events/id (del evento que exista en la db)   Headers:  key -> x-token   value -> Un token valido
router.delete( '/:id', eliminarEvento );



module.exports = router;