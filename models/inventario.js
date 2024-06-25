import mongoose from "mongoose";

const inventarioSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    valorUnitario: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    valorTotal: { type: Number, default: 0},
    estado: { type: Number, default: 1}
});

export default mongoose.model("Inventario", inventarioSchema);
