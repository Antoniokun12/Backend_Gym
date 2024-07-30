import Inventario from "../models/inventario.js";

const helpersInventarios={

    validarCodigoUnico: async (codigo, id) => {
        const inventario = await Inventario.findOne({ codigo });
        if (inventario && inventario._id.toString() !== id) {
            throw new Error("El código de inventario ya existe");
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