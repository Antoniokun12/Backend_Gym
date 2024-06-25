import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    fecha_nacimiento: { type: Date, required: true },
    foto: {type: String, required: true},
    edad: { type: Number, min: 0 },
    fecha_ingreso: { type: Date, default: Date.now },
    fecha_vencimiento: { type: Date },
    documento: { type: String, required: true, unique: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    objetivo: { type: String, required: true, trim: true },
    observaciones_limitaciones: { type: String, required: true, trim: true },
    estado: { type: Number, default: 1, enum: [0, 1] },
    id_plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    seguimiento: [{
        fecha: { type: Date },
        peso: { type: Number, min: 0 },
        altura: { type: Number, min: 0 },
        imc: { type: Number, min: 0 },
        medida_brazo: { type: Number, min: 0 },
        medida_pierna: { type: Number, min: 0 },
        medida_cintura: { type: Number, min: 0 }
    }]
}, { timestamps: true });

clienteSchema.methods.calcularEdad = function() {
    const today = new Date();
    const birthDate = new Date(this.fecha_nacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

clienteSchema.methods.calcularIMC = function(peso, altura) {
    // Convertir altura a metros si está en cm
    if (altura > 3) { // Asumimos que la altura en metros no superará los 3 metros
        altura = altura / 100;
    }
    return (peso / (altura * altura)).toFixed(2);
};

clienteSchema.pre('save', function(next) {
    // Calcular la edad antes de guardar
    this.edad = this.calcularEdad();

    // Calcular el IMC para cada entrada de seguimiento
    this.seguimiento.forEach(entry => {
        if (entry.peso && entry.altura) {
            entry.imc = this.calcularIMC(entry.peso, entry.altura);
        }
    });

    next();
});

export default mongoose.model("Cliente", clienteSchema);


