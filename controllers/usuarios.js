import Usuario from "../models/usuarios.js";
import bcryptjs from "bcryptjs";
import { generarJWT, generarTokenReset, validarTokenReset  } from '../middlewares/validar-jwt.js';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

const httpUsuario = {
    getUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            res.json({ usuarios });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getUsuariosActivos: async (req, res) => {
        try {
            const usuariosActivos = await Usuario.find({ estado: 1 });
            res.json({ usuariosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },

    getUsuariosInactivos: async (req, res) => {
        try {
            const usuariosInactivos = await Usuario.find({ estado: 0 });
            res.json({ usuariosInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getUsuarioByID: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json({ usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    postUsuario: async (req, res) => {
        try {
            const { sede, nombre, email, telefono, password, rol, estado } = req.body;
            const usuario = new Usuario({ sede, nombre, email, telefono, password, rol, estado });
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(password, salt)
            await usuario.save();
            res.json({ usuario });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "No se pudo crear el usuario", details: error.message });
        }
    },

    login: async (req, res) => {

        const { email, password } = req.body;


        try {
            const user = await Usuario.findOne({ email })
            if (!user) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos"
                })
            }

            if (user.estado === 0) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos"
                })
            }

            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos"
                })
            }


            const token = await generarJWT(user.id);
            res.json({
                usuario: user,
                token
            })

        } catch (error) {
            console.log(error);

            return res.status(500).json({


                msg: "Hable con el WebMaster"
            })
        }
    },

    putUsuario: async (req, res) => {
        try {
            const { id } = req.params;
            const { _id, password, ...resto } = req.body;
            const usuario = await Usuario.findByIdAndUpdate(id, password, resto, { new: true });
            if (!usuario) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ usuario });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putUsuarioActivar: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json({ usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putUsuarioDesactivar: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json({ usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(404).json({
                    msg: "Usuario no encontrado"
                });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetPasswordToken = await generarTokenReset(usuario.id, resetToken);
            // const resetLink = `http://localhost:2500/api/usuarios/reset-password/${resetPasswordToken}`;
            const resetLink = `https://gymappa.netlify.app/#/reset-password?token=${resetPasswordToken}`;

            const message = `
                <h1>Recuperación de Contraseña</h1>
                <p>Por favor, haga clic en el siguiente enlace para restablecer su contraseña:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Este enlace expirará en 2 horas.</p>
            `;

            await sendEmail(usuario.email, "Recuperación de Contraseña", message);
            res.json({
                msg: "Correo de recuperación enviado"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor"
            });
        }
    },

    resetPassword: async (req, res) => {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                msg: "Las contraseñas no coinciden"
            });
        }

        try {
            const { id } = validarTokenReset(token);

            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(newPassword, salt);

            await Usuario.findByIdAndUpdate(id, { password: hashedPassword });

            res.json({
                msg: "Contraseña restablecida exitosamente"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor"
            });
        }
    }

};

export default httpUsuario;
