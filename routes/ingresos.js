import { Router } from 'express'
import httpIngresos from '../controllers/ingresos.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersIngresos from '../helpers/ingresos.js'
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpIngresos.getIngresos)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpIngresos.getIngresosActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpIngresos.getIngresosInactivos)
router.get("/ingresos/:id", [
    validarJWT,
    validarCampos
], httpIngresos.getIngresosPorCliente)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersIngresos.validarExistaIngresoId),
    validarCampos
], httpIngresos.getIngresosID)
router.get("/fecha/:fecha", [
    validarJWT,
    validarCampos
], httpIngresos.getIngresofecha)
router.post("/", [
    validarJWT,
    check('id_cliente', 'El id_cliente no debe estar vacio').isMongoId(),
    check('id_cliente').custom(helpersIngresos.validarExistaClienteId),
    check('id_sede', 'El id_sede no debe estar vacio').isMongoId(),
    check('id_sede').custom(helpersIngresos.validarExistaSedeId),
    validarCampos
], httpIngresos.postIngresos)
router.put("/actualizar/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersIngresos.validarExistaIngresoId),
    validarCampos
], httpIngresos.putIngresos)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersIngresos.validarExistaIngresoId),
    validarCampos
], httpIngresos.putIngresosActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersIngresos.validarExistaIngresoId),
    validarCampos
], httpIngresos.putIngresosDesactivar)

export default router