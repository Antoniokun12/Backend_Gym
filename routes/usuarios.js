import { Router } from "express";
import httpUsuario from "../controllers/usuarios.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersUsuarios from "../helpers/usuarios.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpUsuario.getUsuarios)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpUsuario.getUsuariosActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpUsuario.getUsuariosInactivos)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersUsuarios.validarExistaId),
    validarCampos
], httpUsuario.getUsuarioByID)
router.post("/", [
    validarJWT,
    check('sede', "Debe ingresar la sede").notEmpty(),
    check('nombre', "Debe ingresar el nombre").notEmpty(),
    check('email', "Debe ingresar el email").notEmpty(),
    check('email', "Debe ingresar un correo válido").isEmail(),
    check('email').custom(helpersUsuarios.validarCorreoUnico),
    check('telefono', "Debe ingresar el telefono").notEmpty(),
    check('telefono', 'El telefono debe contener solo números').isNumeric(),
    check('password', "Debe ingresar la password").notEmpty(),
    
    check('rol', "Debe ingresar el rol").notEmpty(),
    validarCampos
], httpUsuario.postUsuario)
router.post("/login", [
    check('email', "Debe ingresar el email").notEmpty(),
    check('password', "Debe ingresar la password").notEmpty(),
    validarCampos
],httpUsuario.login)
router.put("/actualizar/:id", [
    validarJWT,
    check('sede', "Debe ingresar la sede").notEmpty(),
    check('nombre', "Debe ingresar el nombre").notEmpty(),
    check('email', "Debe ingresar el email").notEmpty(),
    check('email', "Debe ingresar un correo válido").isEmail(),
    check('telefono', "Debe ingresar el telefono").notEmpty(),
    check('telefono', 'El telefono debe contener solo números').isNumeric(),
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('rol', "Debe ingresar el rol").notEmpty(),
    check('id').custom(helpersUsuarios.validarExistaId),
    validarCampos
], httpUsuario.putUsuario)
router.put("/activar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersUsuarios.validarExistaId),
    validarCampos
], httpUsuario.putUsuarioActivar)
router.put("/desactivar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersUsuarios.validarExistaId),
    validarCampos
], httpUsuario.putUsuarioDesactivar)
router.post('/forgot-password', httpUsuario.forgotPassword);
router.post('/reset-password/:token', httpUsuario.resetPassword);

// router.post('/reset-password/:token', httpUsuario.resetPassword);

export default router