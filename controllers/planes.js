import Plan from "../models/planes.js"

const httpPlanes = {
    
    getPlanes: async (req, res) => {
        const plan = await Plan.find().sort({ createAt: -1 });
        res.json({ plan });
    },

    getPlanesActivos: async (req, res) => {
        try {
            const planesActivos = await Plan.find({ estado: 1 }).sort({ createAt: -1 });
            res.json({ planesActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getPlanesInactivos: async (req, res) => {
        try {
            const planesInactivos = await Plan.find({ estado: 0 }).sort({ createAt: -1 });
            res.json({ planesInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getPlanesID: async (req, res) => {
        const { id } = req.params
        const plan = await Plan.findById(id)
        res.json({ plan })
    },

    postPlanes: async (req, res) => {
        try {
            const { codigo, descripcion, valor, dias } = req.body;
            const plan = new Plan({ codigo, descripcion, valor, dias });
            await plan.save();
            res.status(201).json({ plan });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el plan" });
        }
    },

    putPlanes: async (req, res) => {
        try {
            const { id } = req.params;
            const { _id, ...resto } = req.body;

            const plan = await Plan.findByIdAndUpdate(id, resto, { new: true });
            if (!plan) {
                return res.status(404).json({ error: "Plan no encontrado" });
            }
            res.json({ plan });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putPlanesActivar: async (req, res) => {
        const { id } = req.params
        const plan = await Plan.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ plan })
    },

    putPlanesDesactivar: async (req, res) => {
        const { id } = req.params
        const plan = await Plan.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ plan })
    },
};

export default httpPlanes