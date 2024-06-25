import Plan from "../models/planes.js";
const helpersPlanes={
    validarCodigoUnico:async (codigo)=>{
        const existe = await Plan.findOne({codigo})
        console.log(existe);
        if (existe){
            throw new Error ("Codigo de plan ya Existe")
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