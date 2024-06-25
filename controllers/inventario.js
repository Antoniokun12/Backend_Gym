import Inventario from "../models/inventario.js";

const httpInventario = {

    getInventarios: async (req, res) => {
        const inventarios = await Inventario.find(); 
        res.json({ inventarios });
    },

    getInventariosActivos: async (req, res) => {
        try {
            const inventariosActivos = await Inventario.find({ estado: 1 });
            res.json({ inventariosActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getInventariosInactivos: async (req, res) => {
        try {
            const inventariosInactivos = await Inventario.find({ estado: 0 });
            res.json({ inventariosInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getInventariosID: async (req, res) => {
        const { id } = req.params
        const inventario = await Inventario.findById(id)
        res.json({ inventario })
    },

    postInventarios: async (req, res) => {
        try {
            const { codigo, descripcion, valorUnitario, cantidad, estado } = req.body;
    
            // Calcular el valor total
            const valorTotal = valorUnitario * cantidad;
    
            const inventario = new Inventario({ codigo, descripcion, valorUnitario, cantidad, valorTotal, estado  });
            await inventario.save();
            res.json({ inventario });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el registro", details: error.message });
        }
    },
    
    putInventarios: async (req, res) => {
        try {
            const { id } = req.params;
            const { codigo, estado, ...resto } = req.body;
    
            // Calcular el valor total si valorUnitario y cantidad están presentes en la solicitud
            let valorTotal;
            if ('valorUnitario' in resto && 'cantidad' in resto) {
                valorTotal = resto.valorUnitario * resto.cantidad;
            }
    
            // Actualizar el inventario
            const inventario = await Inventario.findByIdAndUpdate(id, { codigo, estado, valorTotal, ...resto }, { new: true });
    
            res.json({ inventario });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    

    putInventariosActivar: async (req, res) => {
        const { id } = req.params
        const inventario = await Inventario.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ inventario })
    },

    putInventariosDesactivar: async (req, res) => {
        const { id } = req.params
        const inventario = await Inventario.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ inventario })
    },

}

export default httpInventario
