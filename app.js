import express from "express";
import cors from 'cors'
import dbConexion from "./database/cnxmongoose.js";
import 'dotenv/config';
import sedes from "./routes/sedes.js";
import pagos from "./routes/pagos.js"
import planes from "./routes/planes.js";
import ingresos from "./routes/ingresos.js";
import clientes from "./routes/clientes.js";
import inventario from "./routes/inventario.js";
import ventas from "./routes/ventas.js";
import maquinas from "./routes/maquinas.js";
import mantenimientos from "./routes/mantenimientos.js";
import usuarios from "./routes/usuarios.js";

const app = express();
dbConexion();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/sedes", sedes)
app.use("/api/pagos", pagos)
app.use("/api/planes", planes)
app.use("/api/ingresos", ingresos)
app.use("/api/clientes", clientes)
app.use("/api/inventario", inventario)
app.use("/api/ventas", ventas)
app.use("/api/maquinas", maquinas)
app.use("/api/mantenimientos", mantenimientos)
app.use("/api/usuarios", usuarios)

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})