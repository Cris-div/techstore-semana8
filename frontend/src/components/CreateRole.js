import { useState } from "react";
import { createRoleRequest } from "../services/api";

export default function CreateRole({ token }) {

  const [nombre, setNombre] = useState("");

  const handleCreate = async () => {
    const res = await createRoleRequest(token, { nombre });
    const data = await res.json();

    if (!res.ok) {
      alert(data.msg); // 🔥 AQUÍ SE VE EL ERROR 403
      return;
    }

    alert("Rol creado");
    setNombre("");
  };

  return (
    <div className="card">
      <h2>Crear Rol</h2>

      <input
        placeholder="Nombre del rol"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <button onClick={handleCreate}>
        Crear Rol
      </button>
    </div>
  );
}