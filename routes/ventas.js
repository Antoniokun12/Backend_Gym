import { Router } from "express";
import httpVentas from "../controllers/ventas.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersVentas from "../helpers/ventas.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpVentas.getVentas)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpVentas.getVentasActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpVentas.getVentasInactivos)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersVentas.validarExistaId),
    validarCampos
], httpVentas.getVentaID)
router.get("/fecha/:fecha", [
    validarJWT,
    validarCampos
], httpVentas.getVentasPorFechaVenta)
router.post("/", [
    validarJWT,
    check('codigo_producto', "Debe selecionar el codigo").notEmpty(),
    check('cantidad', "Debe agregar una cantidad").notEmpty(),
    check('cantidad', 'Solo numeros').isNumeric(),
    check('cantidad', 'La cantidad debe ser mayor a 0').isFloat({ min: 0.01 }),
    validarCampos
], httpVentas.postVenta)
router.put("/actualizar/:id", [
    validarJWT,
    check('codigo_producto', "Debe seleccionar el codigo").notEmpty(),
    check('cantidad', 'Solo numeros').isNumeric(),
    check('cantidad', 'La cantidad debe ser mayor a 0').isFloat({ min: 0.01 }),
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersVentas.validarExistaId),
    validarCampos
], httpVentas.putVenta)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersVentas.validarExistaId),
    validarCampos
], httpVentas.putVentaActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersVentas.validarExistaId),
    validarCampos
], httpVentas.putVentaDesactivar)

export default router