import Plan from "../models/planes.js";
const helpersPlanes={
    validarCodigoUnico: async (codigo, id) => {
        const plan = await Plan.findOne({ codigo });
        if (plan && plan._id.toString() !== id) {
            throw new Error("El código de plan ya existe");
        }
    },
    validarExistaId:async (id)=>{
        const existe = await Plan.findById(id)
        if (existe===undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersPlanes