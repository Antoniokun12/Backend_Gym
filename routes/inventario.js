import { Router } from "express";
import httpInventario from "../controllers/inventario.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersInventarios from "../helpers/inventario.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpInventario.getInventarios)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpInventario.getInventariosActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpInventario.getInventariosInactivos)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventarios.validarExistaId),
    validarCampos
], httpInventario.getInventariosID)
router.post("/", [
    validarJWT,
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('codigo').custom(helpersInventarios.validarCodigoUnico),       
    check('descripcion', "La descripcion no debe estar vacia").notEmpty(),
    check('valorUnitario', "El valor unitario no debe estar vacia").notEmpty(),
    check('valorUnitario', 'Solo numeros').isNumeric(),
    check('cantidad', "La cantidad no debe estar vacia").notEmpty(),
    check('cantidad', 'Solo numeros').isNumeric(),
    validarCampos
], httpInventario.postInventarios)
router.put("/actualizar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventarios.validarExistaId),
    validarCampos
], httpInventario.putInventarios)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventarios.validarExistaId),
    validarCampos
], httpInventario.putInventariosActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventarios.validarExistaId),
    validarCampos
], httpInventario.putInventariosDesactivar)

export default router