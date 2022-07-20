const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Para saber las variables de entorno actuales del proyecto y las del archivo .env.
//console.log( process.env );

//Creando servidor de Express.
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use(cors());

//Directorio Publico.
/* 
El use en express es un middleware, un middleware es una funcion que se ejecuta en el momento que 
alguien hace una peticion a mi servidor.
*/
app.use( express.static('public') );

//Lectura y parseo del body.
app.use( express.json() );


//Rutas
// app.get('/', (req, res) => {

//     console.log('Se requiere /');
//     res.json({
//         ok: true
//     })

// })
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );


//Comodin para arreglar el error de rutas en produccion, cualquier ruta que no sean las de arriba las va a servir el index.html.
app.get('*', (req, res) => {
    res.sendFile( __dirname + '/public/index.html');
})


//Escuchar peticiones, se recomienda poner un puerto distinto a los que se usan comunmente.
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
})