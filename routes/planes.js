import { Router } from "express";
import httpPlanes from '../controllers/planes.js'
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersPlanes from "../helpers/planes.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router()

router.get("/",[
    validarJWT,
    validarCampos
], httpPlanes.getPlanes)
router.get("/activos",[
    validarJWT,
    validarCampos
], httpPlanes.getPlanesActivos)
router.get("/inactivos",[
    validarJWT,
    validarCampos
], httpPlanes.getPlanesInactivos)
router.get("/:id",[
    validarJWT,
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPlanes.validarExistaId),
    validarCampos
], httpPlanes.getPlanesID)
router.post("/",[
    validarJWT,
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('codigo').custom(helpersPlanes.validarCodigoUnico),
    check('descripcion', "La descripcion no debe estar vacia").notEmpty(),
    check('valor', "El valor no debe estar vacio").notEmpty(),
    check('dias', "El campo dias no debe estar vacio").notEmpty(),
    validarCampos
], httpPlanes.postPlanes)
router.put("/actualizar/:id",[
    validarJWT,
    check('codigo', "El codigo no debe estar vacio").notEmpty(),
    check('descripcion', "La descripcion no debe estar vacia").notEmpty(),
    check('valor', "El valor no debe estar vacio").notEmpty(),
    check('dias', "El campo dias no debe estar vacio").notEmpty(),
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPlanes.validarExistaId),
    check('codigo').custom((codigo, { req }) => helpersPlanes.validarCodigoUnico(codigo, req.params.id)),
    validarCampos
], httpPlanes.putPlanes)
router.put("/activar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPlanes.validarExistaId),
    validarCampos
], httpPlanes.putPlanesActivar)
router.put("/desactivar/:id",[
    check('id', 'Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersPlanes.validarExistaId),
    validarCampos
], httpPlanes.putPlanesDesactivar)

export default router