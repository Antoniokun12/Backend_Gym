import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    codigo_producto: { type: String, required: true },
    valor_unitario: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    total: { type: Number, required: true },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Venta", ventaSchema);
