import Mantenimiento from "../models/mantenimientos.js";

const helpersMantenimientos={
    validarExistaId:async (id)=>{
        const existe = await Mantenimiento.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    },

}

export default helpersMantenimientos