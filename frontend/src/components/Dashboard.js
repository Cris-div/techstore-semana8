import Products from "./Products";
import CreateProduct from "./CreateProduct";
import CreateRole from "./CreateRole";

const stats = [
  { label: "Estado del sistema", value: "OK", note: "Todo operativo" },
  { label: "Autenticación", value: "MFA", note: "Verificado" },
  { label: "Tienda activa", value: "Lima", note: "Sede principal" },
];

export default function Dashboard({
  token,
  products,
  loadProducts,
  setStep,
  setToken
}) {

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setStep("login");
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-title">
          Panel de gestión
        </div>

        <button onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <div className="container">

        <h1>Panel de control</h1>

        <div className="stats">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-title">
                {s.label}
              </div>

              <div className="stat-value">
                {s.value}
              </div>

              <div>
                {s.note}
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">

          <div className="products-box">
            <Products
              products={products}
              reload={loadProducts}
              token={token} 
            />
          </div>

          <div className="create-box">
            <CreateProduct
              token={token}
              reloadProducts={loadProducts}
            />
          </div>

          <div className="create-box">
            <CreateRole
              token={token}
            />
          </div>

        </div>

      </div>
    </>
  );
}