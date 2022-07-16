const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

        /*
            La URL de coneccion va a ser la que le pusimos al mongoDB Compass seguido del nombre que le 
            queremos poner a la base de datos:

            mongodb+srv://megas:5WGpJYgJDXjDjaUL@calendardb.bme7d.mongodb.net/calendarDB
            La guardamos en las variables de entorno.

        */

        await mongoose.connect( process.env.DB_CNN );
        
        console.log('Base de Datos Conectada');
        
    } catch (error) {

        console.log(error);
        throw new Error('Error al iniciar la Base de Datos');

    }

}

module.exports = {
    dbConnection
}