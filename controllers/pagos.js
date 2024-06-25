import Pago from "../models/pagos.js";
import Cliente from "../models/clientes.js";
import Plan from "../models/planes.js"

const httpPagos = {
    getPagos: async (req, res) => {
        const pago = await Pago.find();
        res.json({ pago });
    },

    getPagosActivos: async (req, res) => {
        try {
            const pagosActivos = await Pago.find({ estado: 1 });
            res.json({ pagosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getPagosInactivos: async (req, res) => {
        try {
            const pagosInactivos = await Pago.find({ estado: 0 });
            res.json({ pagosInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },
    
    // getPagosID: async (req, res) => {
    //     const { id } = req.params;
    //     const pagos = await Pago.findById(id);
    //     res.json({ pagos });
    // },

    getTotalPagosEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;

            const totalPagos = await Pago.aggregate([
                {
                    $match: {
                        fecha: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                    }
                }
            ]);

            const pagos = await Pago.aggregate([
                {
                    $match: {
                        fecha: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                },
                {
                    $lookup: {
                        from: "clientes",
                        localField: "id_cliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $addFields: {
                        cliente: { $arrayElemAt: ["$cliente", 0] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id_cliente: 1,
                        plan: 1,
                        fecha: 1,
                        valor: 1,
                        estado: 1,
                        "cliente.nombre": 1,
                        "cliente.email": 1
                    }
                }
            ]);

            const total = totalPagos.length > 0 ? totalPagos[0].total : 0;

            res.json({ totalPagos: total, pagos: pagos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getTotalPagosPorPlan: async (req, res) => {
        try {
            const { id_plan } = req.params;

            // Encuentra los clientes con el plan especificado
            const clientesConPlan = await Cliente.find({ id_plan });

            // Obtiene los IDs de cliente de los clientes con el plan especificado
            const idsClientes = clientesConPlan.map(cliente => cliente._id);

            // Encuentra los pagos asociados a los clientes con el plan especificado
            const pagos = await Pago.find({ id_cliente: { $in: idsClientes } });

            // Obtén el total de pagos
            const totalPagos = pagos.length;

            res.json({ totalPagos, pagos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getTotalPagosPorCliente: async (req, res) => {
        try {
            const { id } = req.params;

            const pagos = await Pago.find({ id_cliente: id });

            // const totalPagos = pagos.length;
            //totalPagos,

            res.json({  pagos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    postPagos: async (req, res) => {
        try {
            const { id_cliente } = req.body;
    
            // Buscar el cliente y su plan asociado
            const cliente = await Cliente.findById(id_cliente).populate('id_plan');
            if (!cliente) {
                return res.status(404).json({ error: "El cliente no existe" });
            }
    
            const plan = cliente.id_plan;
            if (!plan) {
                return res.status(404).json({ error: "El cliente no tiene un plan asociado" });
            }

            
    
            // Crear el pago y asignar el valor del plan
            const pago = new Pago({
                id_cliente,
                plan: plan.descripcion,
                valor: plan.valor
            });
            await pago.save();
    
            // Definir fechaVencimiento como la fecha de vencimiento del cliente
            const fechaVencimiento = new Date(cliente.fecha_vencimiento);
    
            // Actualizar la fecha de vencimiento del cliente sumando los días del plan
            fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.dias);
            cliente.fecha_vencimiento = fechaVencimiento;
            await cliente.save();

            res.json({ pago });
        } catch (error) {
            console.log("Error al crear el pago:", error);
            res.status(400).json({ error: "No se pudo crear el registro" });
        }
    },    

    putPagos: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_cliente } = req.body;

            // Buscar el cliente y su plan asociado
            const cliente = await Cliente.findById(id_cliente).populate('id_plan');
            if (!cliente) {
                return res.status(404).json({ error: "El cliente no existe" });
            }

            // Obtener el plan asociado al cliente
            const plan = cliente.id_plan;
            if (!plan) {
                return res.status(404).json({ error: "El cliente no tiene un plan asociado" });
            }

            // Actualizar el pago con el nuevo id_cliente, valor y plan
            const pago = await Pago.findByIdAndUpdate(id, {
                id_cliente,
                valor: plan.valor,
                plan: plan.descripcion
            }, { new: true });

            if (!pago) {
                return res.status(404).json({ error: "El pago no existe" });
            }

            res.json({ pago });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putPagosActivar: async (req, res) => {
        const { id } = req.params;
        const pago = await Pago.findByIdAndUpdate(id, { estado: 1 }, { new: true });
        res.json({ pago });
    },

    putPagosDesactivar: async (req, res) => {
        const { id } = req.params;
        const pago = await Pago.findByIdAndUpdate(id, { estado: 0 }, { new: true });
        res.json({ pago });
    },

};

export default httpPagos;
