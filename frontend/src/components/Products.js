import { useEffect } from "react";
import {
  updateProductRequest,
  deleteProductRequest
} from "../services/api";

export default function Products({
  products,
  reload,
  token
}) {

  useEffect(() => {
    reload();
  }, []);

  // 🔥 ACTUALIZAR PRECIO
  const updatePrice = async (id) => {

    const nuevoPrecio = prompt("Nuevo precio");

    if (!nuevoPrecio) return;

    const res = await updateProductRequest(
      token,
      id,
      { precio: nuevoPrecio }
    );

    const data = await res.json();

    alert(data.msg);

    reload();
  };

  // 🔥 ELIMINAR PRODUCTO
  const deleteProduct = async (id) => {

    const confirmar = window.confirm(
      "¿Eliminar producto?"
    );

    if (!confirmar) return;

    const res = await deleteProductRequest(
      token,
      id
    );

    const data = await res.json();

    alert(data.msg);

    reload();
  };

  return (
    <div className="table-container">

      <h2>Productos</h2>

      <button onClick={reload}>
        Actualizar
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Tienda</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>

              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>S/{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.tienda}</td>

              <td>

                <button
                  className="action-btn"
                  onClick={() => updatePrice(p.id)}
                >
                  Cambiar precio
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteProduct(p.id)}
                >
                  Eliminar
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}