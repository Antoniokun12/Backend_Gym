import Usuario from "../models/usuarios.js";

const helpersUsuarios={
    validarExistaId:async (id)=>{
        const existe = await Usuario.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    },
    validarCorreoUnico:async (correo)=>{
        const existe = await Usuario.findOne({correo})
        console.log(existe);
        if (existe){
            throw new Error ("correo ya Existe")
        }
    },
}

export default helpersUsuarios