import { Router } from "express";
import httpClientes from "../controllers/clientes.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersClientes from "../helpers/clientes.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/", [
    validarJWT,
    validarCampos
], httpClientes.getClientes)
router.get("/activos", [
    validarJWT,
    validarCampos
], httpClientes.getClientesActivos)
router.get("/inactivos", [
    validarJWT,
    validarCampos
], httpClientes.getClientesInactivos)
router.get("/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.getClientesID)
router.get("/seguimiento/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.getSeguimientoCliente)
router.get("/clientes/plan/:id", [
    validarJWT,
    validarCampos
], httpClientes.getClientesPorPlan)
router.get("/clientes/cumples", [
    validarJWT,
    validarCampos
], httpClientes.getClientesCumpleaños)
router.get("/clientes/igrdia/:id_cliente", [
    validarJWT,
    check('id_cliente', 'Se necesita un mongoid valido').isMongoId(),
    check('id_cliente').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.getTotalPersonasIngresadasMismoDia)
router.post("/", [
    validarJWT,
    check('nombre', "El nombre no debe estar vacio").notEmpty(),
    check('fecha_nacimiento', "La fecha de nacimiento no debe estar vacia").notEmpty(),
    check('fecha_nacimiento', "La fecha no esta en el formato adecuado").isISO8601().toDate(),
    check('foto', "El campo de la foto no puede estar vacio").notEmpty(),
    // check('fecha_ingreso', "La fecha de ingreso no debe estar vacia").notEmpty(),
    // check('fecha_ingreso', "La fecha no esta en el formato adecuado").isISO8601().toDate(),
    // check('fecha_vencimiento', "La fecha de vencimiento no debe estar vacia").notEmpty(),
    // check('fecha_vencimiento', "La fecha no esta en el formato adecuado").isISO8601().toDate(),
    check('documento', "El documento no debe estar vacio").notEmpty(),
    check('documento', 'El documento debe contener solo números').isNumeric(),
    check('documento').custom(helpersClientes.validarDocumentoUnico),
    check('direccion', "La direccion no debe estar vacia").notEmpty(),
    check('telefono', "El telefono no debe estar vacio").notEmpty(),
    check('telefono', 'El telefono debe contener solo números').isNumeric(),
    check('objetivo', "El objetivo no debe estar vacio").notEmpty(),
    check('observaciones_limitaciones', "debe agregar observaciones").notEmpty(),
    check('id_plan', "Debe agregar un plan").notEmpty(),
    check('id_plan').custom(helpersClientes.validarExistaplanId),
    // check('foto', "Debe agregar una foto").notEmpty(),
    // check('seguimiento', "Debe llenar el seguimiento").notEmpty().isArray().custom((seguimiento) => {
    //     if (seguimiento.length === 0) {
    //         throw new Error('Debe haber al menos un elemento en el seguimiento');
    //     }
    //     return seguimiento.every(item => typeof item === 'object' && 'fecha' in item && 'peso' in item && 'altura' in item && 'imc' in item && 'medida_brazo' in item && 'medida_pierna' in item && 'medida_cintura' in item);
    // }),
    validarCampos
], httpClientes.postClientes)
router.post("/:id/seguimiento", [
    validarJWT,
], httpClientes.addSeguimientoCliente)
// router.put("/seguimiento/:id", [
//     check('id', 'Se necesita un mongoid valido').isMongoId(),
//     check('id').custom(helpersClientes.validarExistaclienteId),
//     check('seguimiento', "Debe llenar el seguimiento").notEmpty().isArray().withMessage('El seguimiento no debe estar vacío y debe ser un array')
// .custom((seguimiento, { req }) => {
//     if (seguimiento.length === 0) {
//         throw new Error('Debe haber al menos un elemento en el seguimiento');
//     }
//     return seguimiento.every(item => typeof item === 'object' && 'fecha' in item && 'peso' in item && 'altura' in item && 'imc' in item && 'medida_brazo' in item && 'medida_pierna' in item && 'medida_cintura' in item);
// }),
//     validarCampos
// ], httpClientes.putSeguimientoCliente)
router.put("/actualizar/:id", [
    validarJWT,
    check('documento', 'El documento debe contener solo números').isNumeric(),
    check('telefono', 'El telefono debe contener solo números').isNumeric(),
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.putClientes)
router.put("/seguimiento/:id", [
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    validarCampos
], httpClientes.putSeguimientoCliente)
router.put("/activar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.putClientesActivar)
router.put("/desactivar/:id", [
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaclienteId),
    validarCampos
], httpClientes.putClientesDesactivar)


export default router

