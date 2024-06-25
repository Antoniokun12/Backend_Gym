import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    sede: { type: mongoose.Schema.Types.ObjectId, ref: 'Sede', required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    estado: { type: Number, default: 1 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
});

export default mongoose.model("Usuario", usuarioSchema);