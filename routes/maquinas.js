import { Router } from "express";
import httpMaquina from "../controllers/maquinas.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersMaquinas from "../helpers/maquinas.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpMaquina.getMaquinas)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpMaquina.getMaquinasActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpMaquina.getMaquinasInactivos)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMaquinas.validarExistaId),
    validarCampos
], httpMaquina.getMaquinaByID)
router.get("/mantenimientos/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMaquinas.validarExistaId),
    validarCampos
], httpMaquina.getMantenimientosByMaquinaID)
router.post("/", [
    validarJWT,
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('codigo').custom(helpersMaquinas.validarCodigoUnico),
    check('id_sede', "debe agregar la sede").notEmpty(),
    check('descripcion', "La descripcion no debe estar vacia").notEmpty(),
    check('fecha_ingreso', "Debe colocar una fecha de ingreso").notEmpty(),
    check('fecha_ultimo_mantenimiento', "Debe colocar una fecha de ultimo mantenimiento").notEmpty(),
    validarCampos
], httpMaquina.postMaquina)
router.put("/actualizar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMaquinas.validarExistaId),
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('descripcion', "La descripcion no denbe estar vacia").notEmpty(),
    check('fecha_ingreso', "Debe colocar una fecha de ingreso").notEmpty(),
    check('fecha_ultimo_mantenimiento', "Debe colocar una fecha de ultimo mantenimiento").notEmpty(),
    check('codigo').custom((codigo, { req }) => helpersMaquinas.validarCodigoUnico(codigo, req.params.id)),
    validarCampos
], httpMaquina.putMaquina)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMaquinas.validarExistaId),
    validarCampos
], httpMaquina.putMaquinaActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMaquinas.validarExistaId),
    validarCampos
], httpMaquina.putMaquinaDesactivar)

export default router 
