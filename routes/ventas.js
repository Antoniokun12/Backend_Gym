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
router.post("/", [
    validarJWT,
    check('codigo_producto', "El codigo no debe estar vacio").notEmpty(),
    check('cantidad', "Debe agregar una cantidad").notEmpty(),
], httpVentas.postVenta)
router.put("/actualizar/:id", [
    validarJWT,
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