import mongoose from "mongoose";

const sedeSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    codigo: { type: String, required: true },
    horario: { type: String, required: true },
    ciudad: { type: String, required: true },
    telefono: { type: String, required: true },
    estado: { type: Number, default: 1},
    createAt: { type: Date, default: Date.now }  
});

export default mongoose.model("Sede", sedeSchema);
