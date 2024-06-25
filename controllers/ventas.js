import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";

const httpVentas = {
    getVentas: async (req, res) => {
        const venta = await Venta.find(); 
        res.json({ venta });
    },

    getVentasActivos: async (req, res) => {
        try {
            const ventasActivos = await Venta.find({ estado: 1 });
            res.json({ ventasActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getVentasInactivos: async (req, res) => {
        try {
            const ventasInactivos = await Venta.find({ estado: 0 });
            res.json({ ventasInactivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes inactivos.' });
        }
    },

    getVentaID: async (req, res) => {
        const { id } = req.params
        const venta = await Venta.findById(id)
        res.json({ venta })
    },

    postVenta: async (req, res) => {
        try {
            const { fecha, codigo_producto, cantidad } = req.body;
    
     
            const producto = await Inventario.findOne({ codigo: codigo_producto });
    
            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
    
            if (producto.cantidad < cantidad) {
                return res.status(400).json({ error: "No hay suficiente stock disponible" });
            }
    
          
            const total = producto.valorUnitario * cantidad;
    
          
            const venta = new Venta({ fecha, codigo_producto, valor_unitario: producto.valorUnitario, cantidad, total });
            await venta.save();
    
          
            producto.cantidad -= cantidad;
            producto.valorTotal -= total; 

            await producto.save();
    
            res.json({ venta });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear la venta", details: error.message });
        }
    },
    
    putVenta: async (req, res) => {
        try {
            const { id } = req.params;
            const { codigo_producto, cantidad } = req.body;
    
            const venta = await Venta.findById(id);
    
            if (!venta) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
    
            const producto = await Inventario.findOne({ codigo: codigo_producto });
    
            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
    
            if (venta.cantidad !== cantidad) {
                
                producto.cantidad += venta.cantidad;
                producto.valorTotal += venta.total; 
                
                if (producto.cantidad < cantidad) {
                    return res.status(400).json({ error: "No hay suficiente stock disponible" });
                }
              
                venta.total = producto.valorUnitario * cantidad;
                
                venta.cantidad = cantidad;
                
                producto.cantidad -= venta.cantidad;
                producto.valorTotal -= venta.total;
                await producto.save();
            }
    
            await venta.save();
    
            res.json({ venta });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
    putVentaActivar: async (req, res) => {
        const { id } = req.params
        const venta = await Venta.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ venta })
    },

    putVentaDesactivar: async (req, res) => {
        const { id } = req.params
        const venta = await Venta.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ venta })
    },
};

export default httpVentas;
