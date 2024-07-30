import Ingreso from "../models/ingresos.js"
import Cliente from "../models/clientes.js"

const httpIngresos = {
    getIngresos: async (req, res) => {
        const ingresos = await Ingreso.find()
            .populate('id_cliente')
            .populate('id_sede')
            .sort({ fecha: -1 });
        res.json({ ingresos });
    },

    getIngresosActivos: async (req, res) => {
        try {
            const ingresosActivos = await Ingreso.find({ estado: 1 })
                .populate('id_cliente')
                .populate('id_sede')
                .sort({ fecha: -1 });
            res.json({ ingresosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },

    getIngresosInactivos: async (req, res) => {
        try {
            const ingresosInactivos = await Ingreso.find({ estado: 0 })
                .populate('id_cliente')
                .populate('id_sede')
                .sort({ fecha: -1 });
            res.json({ ingresosInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getIngresosPorCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const ingresos = await Ingreso.find({ id_cliente: id })
                .populate('id_cliente')
                .populate('id_sede');

            res.json({ ingresos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los ingresos del cliente.' });
        }
    },

    getIngresosID: async (req, res) => {
        const { id } = req.params
        const cliente = await Cliente.findById(id)
        res.json({ cliente })
    },

    getIngresofecha: async (req, res) => {
        const { fecha } = req.params;

        try {
            if (!fecha) {
                return res.status(400).json({ error: "Fecha es requerida" });
            }

            const parsedFecha = new Date(fecha);
            if (isNaN(parsedFecha.getTime())) {
                return res.status(400).json({ error: "Fecha inválida" });
            }

            // Consulta para obtener ingresos desde la fecha proporcionada
            const ingresos = await Ingreso.find({ fecha: { $gte: parsedFecha } })
                .populate('id_cliente')
                .populate('id_sede');

            res.json({ ingresos });
        } catch (error) {
            console.error('Error en getIngresofecha:', error); // Agregar log de error para depuración
            res.status(500).json({ error: error.message });
        }
    },

    postIngresos: async (req, res) => {
        try {
            const { id_cliente, fecha, id_sede, estado } = req.body
            const ingreso = new Ingreso({ id_cliente, fecha, id_sede, estado })
            await ingreso.save()
            res.json({ ingreso })
        } catch (error) {
            res.status(400).json({ err: "No se pudo crear el registro" })
            console.log(error)
        }
    },

    putIngresos: async (req, res) => {

        try {
            const { id } = req.params;
            const { _id, estado, ...resto } = req.body;

            const ingreso = await Ingreso.findByIdAndUpdate(id, resto, { new: true });
            res.json({ ingreso });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }

    },

    putIngresosActivar: async (req, res) => {
        const { id } = req.params
        const ingreso = await Ingreso.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ ingreso })
    },

    putIngresosDesactivar: async (req, res) => {
        const { id } = req.params
        const ingreso = await Ingreso.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ ingreso })
    },
}

export default httpIngresos