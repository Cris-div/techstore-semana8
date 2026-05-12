import { useState } from "react";
import { createProductRequest } from "../services/api";

export default function CreateProduct({ token, reloadProducts }) {

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: ""
  });

  const create = async () => {
    const res = await createProductRequest(token, form);
    const data = await res.json();

    alert(data.msg);

    reloadProducts(); // 🔥 refresca lista

    // limpiar formulario
    setForm({
      nombre: "",
      precio: "",
      stock: "",
      categoria: ""
    });
  };

  return (
  <div className="card">
    <h2>Crear Producto</h2>

    <div className="grid">
      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={e => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        placeholder="Precio"
        value={form.precio}
        onChange={e => setForm({ ...form, precio: e.target.value })}
      />

      <input
        placeholder="Stock"
        value={form.stock}
        onChange={e => setForm({ ...form, stock: e.target.value })}
      />

      <input
        placeholder="Categoría"
        value={form.categoria}
        onChange={e => setForm({ ...form, categoria: e.target.value })}
      />
    </div>

    <button className="btn-full" onClick={create}>
      Crear
    </button>
  </div>
);
}