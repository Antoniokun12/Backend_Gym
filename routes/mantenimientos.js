import { Router } from "express";
import httpMantenimiento from "../controllers/mantenimientos.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersMantenimientos from "../helpers/mantenimientos.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpMantenimiento.getMantenimientos)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpMantenimiento.getMantenimientosActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpMantenimiento.getMantenimientosInactivos)
router.get("/maquina/:id", [
    validarJWT,
    validarCampos
], httpMantenimiento.getMantenimientosByMaquina)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMantenimientos.validarExistaId),
    validarCampos
], httpMantenimiento.getMantenimientoByID)
router.get("/listar/entrefechas", [
    validarJWT,
    check('fechaInicio', "Debe ingresar la primer fecha").notEmpty(),
    check('fechaFin', "Debe ingresar la segunda fecha").notEmpty(),
    validarCampos
], httpMantenimiento.getTotalMantenimientosEntreFechas)
router.post("/", [
    validarJWT,
    check('id_maquina', "Debe agregar una maquina").notEmpty(),
    check('fecha_mantenimiento', "Debe agregar la fecha del mantenimiento").notEmpty(),
    check('descripcion', "Debe agregar las descripcion").notEmpty(),
    check('responsable', "Debe agregar un responsable").notEmpty(),
    check('precio_mantenimiento', "Debe agregar el precio del mantenimiento").notEmpty(),
    validarCampos
], httpMantenimiento.postMantenimiento)
router.put("/actualizar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMantenimientos.validarExistaId),
    validarCampos
], httpMantenimiento.putMantenimiento)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMantenimientos.validarExistaId),
    validarCampos
], httpMantenimiento.putMantenimientoActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersMantenimientos.validarExistaId),
    validarCampos
], httpMantenimiento.putMantenimientoDesactivar)

export default router