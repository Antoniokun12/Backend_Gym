import Mantenimiento from "../models/mantenimientos.js";
import Maquina from "../models/maquinas.js";

const httpMantenimiento = {
    getMantenimientos: async (req, res) => {
        const mantenimiento = await Mantenimiento.find().populate("id_maquina");
        res.json({ mantenimiento });
    },

    getMantenimientosActivos: async (req, res) => {
        try {
            const mantenimientosActivos = await Mantenimiento.find({ estado: 1 }).populate("id_maquina");
            res.json({ mantenimientosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getMantenimientosInactivos: async (req, res) => {
        try {
            const mantenimientosInactivos = await Mantenimiento.find({ estado: 0 }).populate("id_maquina");
            res.json({ mantenimientosInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getMantenimientoByID: async (req, res) => {
        try {
            const { id } = req.params;
            const mantenimiento = await Mantenimiento.findById(id);
            if (!mantenimiento) {
                return res.status(404).json({ error: "Mantenimiento no encontrado" });
            }
            res.json({ mantenimiento });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getMantenimientosByMaquina: async (req, res) => {
        try {
            const { id } = req.params;

            const mantenimiento = await Mantenimiento.find({ id_maquina: id }).populate("id_maquina");

            res.json({  mantenimiento });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getTotalMantenimientosEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.body;
    
            const totalMantenimientos = await Mantenimiento.aggregate([
                {
                    $match: {
                        fecha_mantenimiento: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        totalValor: { $sum: "$precio_mantenimiento" } // Calcula la suma del precio_mantenimiento
                    }
                }
            ]);
    
            const mantenimientos = await Mantenimiento.aggregate([
                {
                    $match: {
                        fecha_mantenimiento: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                    // Agrega aquí cualquier otra etapa de agregación que necesites
                }
            ]);
    
            const total = totalMantenimientos.length > 0 ? totalMantenimientos[0].total : 0;
            const totalValor = totalMantenimientos.length > 0 ? totalMantenimientos[0].totalValor : 0;
    
            res.json({ totalMantenimientos: total, totalValorMantenimientos: totalValor, mantenimientos: mantenimientos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },        

    postMantenimiento: async (req, res) => {
        try {
            const { id_maquina, fecha_mantenimiento, descripcion, responsable, precio_mantenimiento, estado } = req.body;
            const mantenimiento = new Mantenimiento({ id_maquina, fecha_mantenimiento, descripcion, responsable, precio_mantenimiento, estado });
            await mantenimiento.save();

            await actualizarFechaUltimoMantenimiento(id_maquina, fecha_mantenimiento);

            res.json({ mantenimiento });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el mantenimiento", details: error.message });
        }
    },

    putMantenimiento: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_maquina, fecha_mantenimiento, descripcion, responsable, precio_mantenimiento, estado } = req.body;
            const mantenimiento = await Mantenimiento.findByIdAndUpdate(id, { id_maquina, fecha_mantenimiento, descripcion, responsable, precio_mantenimiento, estado }, { new: true });
            if (!mantenimiento) {
                return res.status(404).json({ error: "Mantenimiento no encontrado" });
            }

            await actualizarFechaUltimoMantenimiento(id_maquina, fecha_mantenimiento);

            res.json({ mantenimiento });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putMantenimientoActivar: async (req, res) => {
        try {
            const { id } = req.params;
            const mantenimiento = await Mantenimiento.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!mantenimiento) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ mantenimiento });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putMantenimientoDesactivar: async (req, res) => {
        try {
            const { id } = req.params;
            const mantenimiento = await Mantenimiento.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!mantenimiento) {
                return res.status(404).json({ error: "Maquina no encontrada" });
            }
            res.json({ mantenimiento });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

async function actualizarFechaUltimoMantenimiento(idMaquina, fechaMantenimiento) {
    try {
        await Maquina.findByIdAndUpdate(idMaquina, { fecha_ultimo_mantenimiento: fechaMantenimiento });
    } catch (error) {
        throw new Error("Error al actualizar la fecha de último mantenimiento en la máquina");
    }
}

export default httpMantenimiento;
