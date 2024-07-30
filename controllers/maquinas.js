import Maquina from "../models/maquinas.js";
import Mantenimiento from "../models/mantenimientos.js";

const httpMaquina = {
    getMaquinas: async (req, res) => {
        const maquinas = await Maquina.find().sort({ fecha_ingreso: -1 });
        res.json({ maquinas });
    },

    getMaquinasActivos: async (req, res) => {
        try {
            const maquinasActivos = await Maquina.find({ estado: 1 }).sort({ fecha_ingreso: -1 });
            res.json({ maquinasActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getMaquinasInactivos: async (req, res) => {
        try {
            const maquinasInactivos = await Maquina.find({ estado: 0 }).sort({ fecha_ingreso: -1 });
            res.json({ maquinasInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },


    getMaquinaByID: async (req, res) => {
        try {
            const { id } = req.params;
            const maquina = await Maquina.findById(id);
            if (!maquina) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ maquina });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getMantenimientosByMaquinaID: async (req, res) => {
        try {
            const { id } = req.params;

            // Buscar los mantenimientos por el id de la máquina
            const mantenimientos = await Mantenimiento.find({ id_maquina: id });

            // Verificar si hay mantenimientos para la máquina
            if (!mantenimientos || mantenimientos.length === 0) {
                return res.status(404).json({ error: "No se encontraron mantenimientos para esta máquina" });
            }

            res.json({ mantenimientos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    postMaquina: async (req, res) => {
        try {
            const { codigo, id_sede, descripcion, fecha_ingreso, fecha_ultimo_mantenimiento, estado } = req.body;
            const maquina = new Maquina({ codigo, id_sede, descripcion, fecha_ingreso, fecha_ultimo_mantenimiento, estado });
            await maquina.save();
            res.json({ maquina });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear la máquina", details: error.message });
        }
    },

    putMaquina: async (req, res) => {
        try {
            const { id } = req.params;
            const { _id, estado, ...resto } = req.body;
            const maquina = await Maquina.findByIdAndUpdate(id, resto, { new: true });
            if (!maquina) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ maquina });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }

    },

    putMaquinaActivar: async (req, res) => {
        try {
            const { id } = req.params;
            const maquina = await Maquina.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!maquina) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ maquina });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putMaquinaDesactivar: async (req, res) => {
        try {
            const { id } = req.params;
            const maquina = await Maquina.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!maquina) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ maquina });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default httpMaquina;
