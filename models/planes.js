import mongoose from "mongoose";

const planesSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    descripcion: { type: String, required: true },
    valor: { type: Number, required: true },
    dias: { type: Number, required: true },
    estado: { type: Number, default: 1 },
    createAt: { type: Date, default: Date.now }
});

export default mongoose.model("Plan", planesSchema);
