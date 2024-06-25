import mongoose from 'mongoose';
import cron from "node-cron";
import Cliente from "../models/clientes.js"
import Plan from "../models/planes.js"


const httpClientes = {
    getClientes: async (req, res) => {
        const clientes = await Cliente.find().populate("id_plan");
        res.json({ clientes });
    },

    getClientesActivos: async (req, res) => {
        try {
            const clientesActivos = await Cliente.find({ estado: 1 }).populate("id_plan");
            res.json({ clientesActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getClientesInactivos: async (req, res) => {
        try {
            const clientesInactivos = await Cliente.find({ estado: 0 }).populate("id_plan");
            res.json({ clientesInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },


    getClientesID: async (req, res) => {
        const { id } = req.params
        const cliente = await Cliente.findById(id).populate("id_plan")
        res.json({ cliente })
    },

    getSeguimientoCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            const seguimiento = cliente.seguimiento;
            res.json({ seguimiento });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    getClientesPorPlan: async (req, res) => {
        try {
            const { id } = req.params;
            const clientes = await Cliente.find({ id_plan: id })
                .populate('id_plan')
            res.json({ clientes })
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    getClientesCumpleaños: async (req, res) => {
        try {
            const { mes } = req.query;

            // Convertir mes a un número entero
            const mesConsulta = parseInt(mes);

            // Asegurarse de que el mes proporcionado sea válido (entre 1 y 12)
            if (mesConsulta < 1 || mesConsulta > 12) {
                return res.status(400).json({ error: "El mes proporcionado no es válido." });
            }

            // Consultar clientes cuyo mes de nacimiento coincida con el mes proporcionado
            const clientes = await Cliente.find({
                $expr: {
                    $eq: [{ $month: "$fecha_nacimiento" }, mesConsulta]
                }
            });

            // Crear un array para almacenar los resultados formateados
            const cumpleañosClientes = clientes.map(cliente => {
                return {
                    nombre: cliente.nombre,
                    fecha_nacimiento: cliente.fecha_nacimiento.toISOString().split('T')[0]  // Formatear la fecha a formato YYYY-MM-DD
                };
            });

            res.json({ cumpleañosClientes });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    getTotalPersonasIngresadasMismoDia: async (req, res) => {
        try {
            const { id_cliente } = req.params; // Cambio de req.query a req.params
            const cliente = await Cliente.findById(id_cliente);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            const fecha_ingreso = cliente.fecha_ingreso;
            const totalPersonas = await Cliente.countDocuments({ fecha_ingreso });
            res.json({ totalPersonas });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    postClientes: async (req, res) => {
        try {
            const { nombre, fecha_nacimiento, foto, documento, direccion,
                telefono, objetivo, observaciones_limitaciones, id_plan, seguimiento } = req.body;

            const plan = await Plan.findById(id_plan);
            if (!plan) {
                return res.status(400).json({ error: "El plan seleccionado no existe." });
            }
            if (plan.estado !== 1) {
                return res.status(400).json({ error: "El plan seleccionado se encuentra inactivo." });
            }

            // Calcular la fecha de vencimiento sumando los días del plan a la fecha de ingreso
            const fecha_ingreso = new Date();
            const fechaVencimiento = new Date(fecha_ingreso);
            fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.dias);

            // Crear un nuevo cliente con la fecha de vencimiento calculada
            const cliente = new Cliente({
                nombre, fecha_nacimiento, foto, fecha_ingreso, fecha_vencimiento: fechaVencimiento,
                documento, direccion, telefono, objetivo, observaciones_limitaciones, id_plan, seguimiento
            });
            await cliente.save();

            // Crear un nuevo pago
            const Pago = mongoose.model('Pago');
            const pago = new Pago({
                id_cliente: cliente._id,
                plan: plan.descripcion,
                fecha: new Date(),
                valor: plan.valor,
                estado: 1
            });
            await pago.save();

            res.json({ cliente, pago });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el registro", details: error.message });
        }
    },

    addSeguimientoCliente: async (req, res) => {
        try {
            const { id } = req.params; // ID del cliente
            const { seguimiento } = req.body; // Datos de seguimiento a agregar

            // Buscar al cliente por ID
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }

            // Agregar los datos de seguimiento al cliente
            cliente.seguimiento.push(seguimiento);
            await cliente.save();

            res.json({ cliente });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    putClientes: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const cliente = await Cliente.findByIdAndUpdate(id, updateData, { new: true });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }


            res.json({ cliente });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    putSeguimientoCliente: async (req, res) => {
        try {
            const { id } = req.params; 
            const { idSeguimiento, updateSeguimiento } = req.body; 

            
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }

            const seguimientoIndex = cliente.seguimiento.findIndex(seg => seg._id.toString() === idSeguimiento);
            if (seguimientoIndex === -1) {
                return res.status(404).json({ error: "Seguimiento no encontrado" });
            }

            
            cliente.seguimiento[seguimientoIndex] = { ...cliente.seguimiento[seguimientoIndex], ...updateSeguimiento };
            await cliente.save();

            res.json({ cliente });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor", details: error.message });
        }
    },

    putClientesActivar: async (req, res) => {
        const { id } = req.params
        const cliente = await Cliente.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ cliente })
    },

    putClientesDesactivar: async (req, res) => {
        const { id } = req.params
        const cliente = await Cliente.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ cliente })
    }
}

cron.schedule('0 0 * * *', async () => {
    try {
        const currentDate = new Date();

        // Buscar todos los clientes cuya fecha de vencimiento sea mayor que la fecha actual
        const clientes = await Cliente.find({ fecha_vencimiento: { $lt: currentDate } });

        // Iterar sobre los clientes y actualizar su estado
        for (const cliente of clientes) {
            cliente.estado = 0; // Cambiar el estado del cliente a cero
            await cliente.save(); // Guardar los cambios en la base de datos
        }

        console.log('Tarea cron ejecutada con éxito');
    } catch (error) {
        console.error('Error en la tarea cron del modelo Cliente:', error);
    }
});

export default httpClientes