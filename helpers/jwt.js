const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    //Creamos una promesa a mano ya que el paquete de JWT hasta ahora aun no trabaja por si solo con promesas.
    return new Promise( ( resolve, reject ) => {
        
        const payload = { uid, name };

        //generamos y firmamos el jwt, la SECRET_JWT_SEED es una variable de entorno que yo mismo cree.
        //Si se cambia la SECRET_JWT_SEED deshabilita todos los tokens existentes.
        //Recibe el payload, la secret seed y las opciones que solo ponemos que el token dure 2 horas.
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, ( err, token ) => {

            if( err ){
                console.log(err);
                reject('No se pudo generar el token.');
            }

            resolve( token );

        })

        
    })

}

module.exports = {
    generarJWT
}