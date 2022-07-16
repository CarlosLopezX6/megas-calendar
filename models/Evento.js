const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',                //Referencia al schema Usuario.
        required: true
    }
})

/*
    Hacemos algo para eliminar un campo que se manda en la respuesta, como tal no lo eliminamos de la base de datos solo como
    que no los mandamos, asi las respuestas se veran mas limpias, el _id de cada peticion hecha lo renombraremos a id nadamas.
    
    OJO: esto es solo para que se vea bien en la respuesta de las peticiones, los campos anteriores mencionados no se cambian
    ni se eliminan del registro de la base de datos con este metodo.
*/

EventoSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();         //Referencia a todo el objeto que se guarda en la DB
    object.id = _id;
    return object;
});

module.exports = model( 'Evento', EventoSchema );