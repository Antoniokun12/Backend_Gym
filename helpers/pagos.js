import Pago from "../models/sedes.js"
import Cliente from "../models/clientes.js"
import Plan from "../models/planes.js";

const helpersPagos={
    validarExistaId:async (id)=>{
        const existe = await Pago.findById(id)
        if (existe===undefined){
            throw new Error ("Id no existe")
        }
    },
    validarExistaclienteId:async (id_cliente)=>{
        const existe = await Cliente.findById(id_cliente)
        if (existe===undefined){
            throw new Error ("Id de cliente no existe")
        }
    },
    validarExistaPlanId:async (id_plan)=>{
        const existe = await Plan.findById(id_plan)
        if (existe===undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersPagos
