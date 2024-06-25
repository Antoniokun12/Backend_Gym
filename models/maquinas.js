import mongoose from "mongoose";

const maquinaSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    id_sede: { type: mongoose.Schema.Types.ObjectId, ref: 'Sede', required: true, },
    descripcion: { type: String, required: true },
    fecha_ingreso: { type: Date, required: true },
    fecha_ultimo_mantenimiento: { type: Date, default: null},
    estado: { type: Number, default: 1}
});

export default mongoose.model("Maquina", maquinaSchema);
