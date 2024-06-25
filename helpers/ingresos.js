import Ingreso from "../models/ingresos.js"
import Sede from "../models/sedes.js"
import Cliente from "../models/clientes.js"
const helpersIngresos = {
    validarExistaIngresoId: async (id) => {
        const existe = await Ingreso.findById(id)
        if (existe === undefined) {
            throw new Error("Id no existe")
        }
    },

    validarExistaClienteId: async (id_cliente) => {
        const cliente = await Cliente.findOne({ _id: id_cliente});
        if (!cliente) {
            throw new Error("Id de cliente no existe")
        }
    },

    validarExistaSedeId: async (id_sede) => {
        const sede = await Sede.findOne({ _id: id_sede});
        if (!sede) {
            throw new Error("Id de sede no existe")
        }
    },
}

export default helpersIngresos