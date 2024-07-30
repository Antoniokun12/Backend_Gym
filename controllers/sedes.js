import Sede from "../models/sedes.js"

const httpSedes = {
    getSedes: async (req, res) => {
        const sede = await Sede.find().sort({ createAt: -1 });
        res.json({ sede });
    },

    getSedesActivos: async (req, res) => {
        try {
            const sedesActivos = await Sede.find({ estado: 1 }).sort({ createAt: -1 });
            res.json({ sedesActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getSedesInactivos: async (req, res) => {
        try {
            const sedesInactivos = await Sede.find({ estado: 0 }).sort({ createAt: -1 });
            res.json({ sedesInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },


    getSedesID: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findById(id)
        res.json({ sede })
    },

    postSedes: async (req, res) => {
        try {
            const { nombre, direccion, codigo, horario, ciudad, telefono } = req.body
            const sede = new Sede({ nombre, direccion, codigo, horario, ciudad, telefono })
            await sede.save()
            res.json({ sede })
        } catch (error) {
            res.status(400).json({ err: "No se pudo crear el registro" })
            console.log(error)
        }
    },

    putSedes: async (req, res) => {

        try {
            const { id } = req.params;
            const { _id, estado, createAt, ...resto } = req.body;

            const sede = await Sede.findByIdAndUpdate(id, resto, { new: true });
            res.json({ sede });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }

    },

    putSedesActivar: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ sede })
    },

    putSedesDesactivar: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ sede })
    },
}

export default httpSedes