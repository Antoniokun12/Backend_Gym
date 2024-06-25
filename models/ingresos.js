import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
    id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true, },
    fecha: { type: Date, default: Date.now },
    id_sede: { type: mongoose.Schema.Types.ObjectId, ref: 'Sede', required: true, },
    estado: { type: Number, default: 1}
});
export default mongoose.model("Ingreso", ingresoSchema);
