import Usuario from "../models/usuarios.js";

const helpersUsuarios={
    validarExistaId:async (id)=>{
        const existe = await Usuario.findById(id)
        if (existe===undefined){
            throw new Error ("Id de inventario no existe")
        }
    },
    validarCorreoUnico:async (email)=>{
        const existe = await Usuario.findOne({email})
        console.log(existe);
        if (existe){
            throw new Error ("El email ya esta en uso")
        }
    },
}

export default helpersUsuarios