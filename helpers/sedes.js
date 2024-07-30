import Sede from "../models/sedes.js"
const helpersSedes={
    validarSedeUnico:async (nombre)=>{
        const existe = await Sede.findOne({nombre})
        console.log(existe);
        if (existe){
            throw new Error ("Nombre de sede ya Existe")
        }
    },
    validarCodigoUnico: async (codigo, id) => {
        const sede = await Sede.findOne({ codigo });
        if (sede && sede._id.toString() !== id) {
            throw new Error("Este código ya existe");
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