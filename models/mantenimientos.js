import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema({
    id_maquina: { type: mongoose.Schema.Types.ObjectId, ref: 'Maquina', required: true, },
    fecha_mantenimiento: { type: Date, required: true},
    descripcion: { type: String, required: true },
    responsable: { type: String, required: true },
    precio_mantenimiento: { type: Number, required: true },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Mantenimiento", mantenimientoSchema);
