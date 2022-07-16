const { response } = require('express'); //Esto y el express.response es nadamas para no perder la ayuda a la hora de estar codificando.
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/Usuario');

const crearUsuario = async( req, res = response ) => {

    const { email, password } = req.body

    try {
       
        //console.log( req );
        //console.log( req.body );

        //const { name, email, password } = req.body    //ya no es necesario mandarle esto ya que creamos un modelo de usuario.

        let usuario = await Usuario.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo.'
            })
        }

        usuario = new Usuario( req.body );

        //Antes de guardar el usuario hay que encriptar su contraseña:
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();                           //Para guardar usuario, es una promesa.

        //Si todo lo de arriba pasa, ahora toca generar nuestro Json Web Token (JWT).
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'El usuario se creo correctamente.'
            // user: req.body           //se puede hacer de esta manera
            //name,                     //Ya no utilizado por crear un modelo de usuario
            //email,                    //Ya no utilizado por crear un modelo de usuario
            //password                  //Ya no utilizado por crear un modelo de usuario
        })

    } catch(error) {
        console.log(error)
        res.status(500).json({                                  //Error con status 500 por que fue error interno.
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}


const loginUsuario = async( req, res = response ) => {
    
    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email.'
            })
        }

        //Confirmando o validando passwords, se compara la password que viene del body con la que esta en la DB.
        const validPassword = bcrypt.compareSync( password, usuario.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password Incorrecta.'
            })
        }

        //Si todo lo de arriba pasa, ahora toca generar nuestro Json Web Token (JWT).
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'Usuario loggeado correctamente.',
        })
    
    } catch(error) {
        console.log(error)
        res.status(500).json({                               
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}


//Revalida el token del usuario y lo prolongamos mas tiempo para que el usuario siga activo mientras este lo este.
const revalidarToken = async( req, res = response ) => {

    const { uid, name } = req;

    //Genera un nuevo JWT y lo retorna en la peticion.
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token,
        msg: 'Token renovado.'
    })

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
