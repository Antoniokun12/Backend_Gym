import Inventario from "../models/inventario.js";

const helpersInventarios={

    validarExistaId:async (id)=>{
        const existe = await Inventario.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    }
    
}

export default helpersInventarios