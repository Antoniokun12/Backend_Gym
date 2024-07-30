import Maquina from "../models/maquinas.js"

const helpersMaquinas={

    validarExistaId:async (id)=>{
        const existe = await Maquina.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    },
    validarCodigoUnico: async (codigo, id) => {
        const maquina = await Maquina.findOne({ codigo });
        if (maquina && maquina._id.toString() !== id) {
            throw new Error("El código de la máquina ya existe");
        }
    }
    
}

export default helpersMaquinas