import Venta from "../models/ventas.js";

const helpersVentas={

    validarExistaId:async (id)=>{
        const existe = await Venta.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    }

}

export default helpersVentas