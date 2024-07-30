import { Router } from "express";
import httpPagos from "../controllers/pagos.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersPagos from "../helpers/pagos.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
],httpPagos.getPagos)
router.get("/activos", [
    validarJWT,
    validarCampos
],httpPagos.getPagosActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
],httpPagos.getPagosInactivos)
// router.get("/:id",[
//     check('id', 'Se necesita un mongoid valido').isMongoId(),
//     check('id').custom(helpersPagos.validarExistaId),
//     validarCampos
// ], httpPagos.getPagosID)
router.get("/fecha/:fecha", [
    validarJWT,
    validarCampos
], httpPagos.getPagosPorFecha);
router.get("/pagos/entrefechas",[
    validarJWT,
    validarCampos
], httpPagos.getTotalPagosEntreFechas)
router.get("/pagosx/plan/:id_plan",[
    validarJWT,
    check('id_plan').custom(helpersPagos.validarExistaPlanId),
    validarCampos
], httpPagos.getTotalPagosPorPlan)
router.get("/pagosx/cliente/:id",[
    validarJWT,
    check('id_cliente').custom(helpersPagos.validarExistaclienteId),
    validarCampos
], httpPagos.getTotalPagosPorCliente)
router.post("/",[
    validarJWT,
    check('id_cliente', "El Cliente no debe estar vacio").notEmpty(),
    check('id_cliente').custom(helpersPagos.validarExistaclienteId),
    validarCampos
], httpPagos.postPagos)
router.put("/actualizar/:id",[
    validarJWT,
    check('id_cliente', "El id_cliente no debe estar vacio").notEmpty(),
    check('id').custom(helpersPagos.validarExistaId),
    validarCampos
], httpPagos.putPagos)
router.put("/activar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPagos.validarExistaId),
    validarCampos
], httpPagos.putPagosActivar)
router.put("/desactivar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPagos.validarExistaId),
    validarCampos
], httpPagos.putPagosDesactivar)

export default router