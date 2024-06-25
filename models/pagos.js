import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
    id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    plan: { type: String, default: '' },
    fecha: { type: Date, default: Date.now },
    valor: { type: Number, default: 0},
    estado: { type: Number, default: 1}
});

export default mongoose.model("Pago", pagoSchema);
