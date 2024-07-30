import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";

const httpVentas = {
    getVentas: async (req, res) => {
        const venta = await Venta.find().sort({ fecha: -1 });
        res.json({ venta });
    },

    getVentasActivos: async (req, res) => {
        try {
            const ventasActivos = await Venta.find({ estado: 1 }).sort({ fecha: -1 });
            res.json({ ventasActivos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los planes activos.' });
        }
    },
    
    getVentasInactivos: async (req, res) => {
        try {
            const ventasInactivos = await Venta.find({ estado: 0 }).sort({ fecha: -1 });
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

    getVentasPorFechaVenta: async (req, res) => {
        const { fecha } = req.params;
    
        try {
            if (!fecha) {
                return res.status(400).json({ error: "Fecha es requerida" });
            }
    
            // Convertir la fecha al formato ISO 8601 con la zona horaria UTC
            const parsedFecha = new Date(fecha + 'T00:00:00Z');
            if (isNaN(parsedFecha.getTime())) {
                return res.status(400).json({ error: "Fecha inválida" });
            }
    
            // Definir el rango para la fecha
            const startOfDay = new Date(parsedFecha.toISOString().split('T')[0] + 'T00:00:00Z');
            const endOfDay = new Date(parsedFecha.toISOString().split('T')[0] + 'T23:59:59Z');
    
            const ventas = await Venta.find({
                fecha: { $gte: startOfDay, $lt: endOfDay }
            }).sort({ fecha: -1 });
    
            res.json({ ventas });
        } catch (error) {
            console.error('Error en getVentasPorFechaVenta:', error);
            res.status(500).json({ error: error.message });
        }
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
    
            const productoAnterior = await Inventario.findOne({ codigo: venta.codigo_producto });
            const productoNuevo = await Inventario.findOne({ codigo: codigo_producto });
    
            if (!productoAnterior || !productoNuevo) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
    
            if (venta.codigo_producto !== codigo_producto) {

                productoAnterior.cantidad += venta.cantidad;
                productoAnterior.valorTotal += venta.total;
                
                if (productoNuevo.cantidad < cantidad) {
                    return res.status(400).json({ error: "No hay suficiente stock disponible" });
                }
    
                venta.total = productoNuevo.valorUnitario * cantidad;
                venta.cantidad = cantidad;
                venta.codigo_producto = codigo_producto;
                
                productoNuevo.cantidad -= cantidad;
                productoNuevo.valorTotal -= venta.total;
    
               
                await productoAnterior.save();
                await productoNuevo.save();
            } else {
                
                venta.total = productoAnterior.valorUnitario * cantidad;
                venta.cantidad = cantidad;
                
                productoAnterior.cantidad += venta.cantidad;
                productoAnterior.valorTotal += venta.total;
                
                await productoAnterior.save();
            }
    
       
            await venta.save();
    
            res.json({ venta });
        } catch (error) {
            console.error(error);
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
