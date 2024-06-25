import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Usuario from '../models/usuarios.js';


const generarJWT = (id) => {
    return new Promise((resolve, reject) => {
        const payload = {id};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            //100 years
            expiresIn: "100y"
        }, (err, token) => {
            if (err) {

                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const generarTokenReset = (id, resetToken) => {
    return new Promise((resolve, reject) => {
        const payload = { id, resetToken };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "2h"
        }, (err, token) => {
            if (err) {
                reject("No se pudo generar el token de restablecimiento");
            } else {
                resolve(token);
            }
        });
    });
};

const validarTokenReset = (token) => {
    try {
        return jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    } catch (error) {
        throw new Error("Token no válido o expirado");
    }
};

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Usuario.findById(id);


        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido! ."//- usuario no existe DB
            })
        }

        if (usuario.estado == 0) {
            return res.status(401).json({
                msg: "Token no válido!!  " //- usuario con estado: false
            })
        }

        req.usuariobdtoken = usuario

        next();

    } catch (error) {


        res.status(401).json({
            msg: "Token no valido"
        })
    }
}


export { generarJWT, generarTokenReset, validarTokenReset, validarJWT }