import { Router } from 'express'
import httpSedes from '../controllers/sedes.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersSedes from '../helpers/sedes.js'
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/",[
    validarJWT,
    validarCampos
], httpSedes.getSedes)
router.get("/activos",[
    validarJWT,
    validarCampos
], httpSedes.getSedesActivos)
router.get("/inactivos",[
    validarJWT,
    validarCampos
], httpSedes.getSedesInactivos)
router.get("/:id",[
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersSedes.validarExistaId),
    validarCampos
], httpSedes.getSedesID)  
router.post("/",[
    validarJWT,
    check('nombre', "El nombre no debe estar vacio").notEmpty(),
    check('nombre').custom(helpersSedes.validarSedeUnico),
    check('direccion', "La direccion no debe estar vacia").notEmpty(),
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('codigo').custom(helpersSedes.validarCodigoUnico),
    check('horario', "El horario no debe estar vacio").notEmpty(),
    check('ciudad', "La ciudad no debe estar vacia").notEmpty(),
    check('telefono', "El telefono no debe estar vacio").notEmpty(),
    validarCampos
], httpSedes.postSedes)
router.put("/actualizar/:id",[
    validarJWT,
    check('nombre', "El nombre no debe estar vacio").notEmpty(),
    check('direccion', "La direccion no debe estar vacia").notEmpty(),
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('horario', "El horario no debe estar vacio").notEmpty(),
    check('ciudad', "La ciudad no debe estar vacia").notEmpty(),
    check('telefono', "El telefono no debe estar vacio").notEmpty(),
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersSedes.validarExistaId),
    validarCampos
], httpSedes.putSedes)
router.put("/activar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersSedes.validarExistaId),
    validarCampos
], httpSedes.putSedesActivar)
router.put("/desactivar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersSedes.validarExistaId),
    validarCampos
], httpSedes.putSedesDesactivar)

export default router