/*
    Rutas de Usuarios / Auth:

    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Registro
// POST     localhost:4000/api/auth/new
router.post( '/new',
    [   //middlewares de errores.
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario );


// Login
// POST     localhost:4000/api/auth
router.post( '/',
    [   //middlewares de errores.
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario );


// Renovar Token
// GET     localhost:4000/api/auth/renew        Headers:  key -> x-token   value -> Un token valido
router.get( '/renew', validarJWT, revalidarToken );



module.exports = router;