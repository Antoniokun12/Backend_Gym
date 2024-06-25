import Sede from "../models/sedes.js"
const helpersSedes={
    validarSedeUnico:async (nombre)=>{
        const existe = await Sede.findOne({nombre})
        console.log(existe);
        if (existe){
            throw new Error ("Nombre de sede ya Existe")
        }
    },
    validarCodigoUnico:async (codigo)=>{
        const existe = await Sede.findOne({codigo})
        console.log(existe);
        if (existe){
            throw new Error ("Este codigo ya Existe")
        }
    },
    validarExistaId:async (id)=>{
        const existe = await Sede.findById(id)
        if (existe===undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersSedes