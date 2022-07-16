const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async( req, res = response ) => {

    try {

        /*
            El populate es como si unieramos colecciones, con esto quiero hacer que me venga la ingo del usuario que creo el evento
            para esto le ponemos populate, le especificamos la referencia y luego los campos que queremos que nos traiga, si no le
            ponemos campos o no añadimos otra propiedad tal que asi .populate('user'); , traera todos los campos dde la referencia en este caso de 
            usuario, pero nosotros podemos especificarle los campos tal que asi .populate('user', 'name password' ); y si 
            los campos deben adentro del mismo ' '. aunque no metamos el id ahi este vendra por default.
        */
    
        const eventos = await Evento.find()  //Trae todos los eventos guardados en la DB. Aqui se pueden aplicar filtros dentro de {}.
                                .populate('user', 'name'); //Metemos la info del usuario que lo creo con .populate con su campo name.
    
        res.json({
            ok: true,
            eventos,
            msg: 'Eventos cargados correctamente.',
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({                               
            ok: false,
            msg: 'Error al cargar los eventos.'
        })
    }
}



const crearEvento = async( req, res = response ) => {
    
    // Verificar que tenga el evento.
    //console.log( req.body );
    
    const evento = new Evento( req.body );

    try {

        //Para crear un evento acuerdate que tambien se le debe de mandar el usuario para saber quien lo hizo.
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado,
            msg: 'Evento guardado correctamente.',
        })
    
    } catch(error) {
        console.log(error);
        res.status(500).json({                               
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}



const actualizarEvento = async( req, res = response ) => {

    /*
        Para que se pueda probar esta peticion, en los headers tienes que poner el token del usuario que hizo el evento,
        recuerda que para obtener el token te debes de logear con el usuario y extraer el token que se genere de ahi, si no se
        hace esto, la peticion te dira que no tienes permisos para editar ese evento, ya sea por que el token expiro o
        porque ese token pertenece a otro usuario que no hizo dicho evento.

        Tambien recuerda que el id que le pongamos a la peticion en la ip debe de ser un id de un evento que exista.
    */

    const eventoId = req.params.id;    //obtenemos el id del evento.
    const uid = req.uid;               //obtenemos el id del usuario logueado.

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ){
            return res.status(404).json({                 //Status de error de algo que no existe.                               
                ok: false,
                msg: 'El evento no existe por ese id.'
            })
        }

        //verificamos que la persona que creo el evento es la misma que lo quiere editar, si no que no grabe cambios.
        if( evento.user.toString() !== uid ){
            return res.status(401).json({                 //Status de error cuando algo no esta autorizado.                            
                ok: false,
                msg: 'No tiene privilegio de editar este evento.'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        /*
            En esta funcion propia de mongoose mandamos el id del evento, la actualizacion del mismo y que nos regrese los datos 
            del evento actualizado en la respuesta.
        */
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado,
            msg: 'Evento actualizado correctamente.',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({                               
            ok: false,
            msg: 'Error al actualizar el evento.'
        })
    }

}

const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;    //obtenemos el id del evento.
    const uid = req.uid;               //obtenemos el id del usuario logueado.

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ){
            return res.status(404).json({                 //Status de error de algo que no existe.                               
                ok: false,
                msg: 'El evento no existe por ese id.'
            })
        }

        //verificamos que la persona que creo el evento es la misma que lo quiere editar, si no que no grabe cambios.
        if( evento.user.toString() !== uid ){
            return res.status(401).json({                 //Status de error cuando algo no esta autorizado.                            
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento.'
            })
        }

        /*
            En esta funcion propia de mongoose mandamos el id del evento, la actualizacion del mismo y que nos regrese los datos 
            del evento actualizado en la respuesta.
        */
        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            msg: 'Evento eliminado correctamente.',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({                               
            ok: false,
            msg: 'Error al eliminar el evento.'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}