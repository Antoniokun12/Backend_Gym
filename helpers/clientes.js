import Plan from "../models/planes.js";
import Cliente from "../models/clientes.js"
const helpersClientes={

    validarExistaplanId: async (id_plan) => {
        // Busca un documento en la colección Plan donde el campo id sea igual al id_plan proporcionado
        const existe = await Plan.findOne({ id: id_plan });
        if (existe===undefined) {
            throw new Error("id de plan no existe")
        }
    },

    validarDocumentoUnico: async (documento, id) => {
        const cliente = await Cliente.findOne({ documento });
        if (cliente && cliente._id.toString() !== id) {
            throw new Error("Este documento ya está registrado");
        }
    },

    validarExistaclienteId:async (id)=>{
        const existe = await Cliente.findById(id)
        if (existe===undefined){
            throw new Error ("Id de cliente no existe")
        }
    }
}

export default helpersClientes