import Inventario from "../models/inventario.js";

const helpersInventarios={

    validarCodigoUnico:async (codigo)=>{
        const existe = await Inventario.findOne({codigo})
        console.log(existe);
        if (existe){
            throw new Error ("Codigo de Inventario ya existe, Inserte otro codigo")
        }
    },

    validarExistaId:async (id)=>{
        const existe = await Inventario.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    }
    
}

export default helpersInventarios