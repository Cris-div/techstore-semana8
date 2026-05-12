import { useState, useEffect } from "react";

import Login from "./components/Login";
import MFA from "./components/MFA";
import Dashboard from "./components/Dashboard";

import { getProductsRequest } from "./services/api";

import "./index.css";
import "./App.css";

function App() {

  // 🔥 estados principales
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);

  // 🔥 recuperar sesión
  useEffect(() => {

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      setStep("dashboard");
    }

  }, []);

  // 🔥 cargar productos
  const loadProducts = async () => {

    try {

      const res = await getProductsRequest(token);
      const data = await res.json();

      setProducts(data);

    } catch (error) {

      console.error(error);
      alert("Error cargando productos");

    }
  };

  return (
    <div>

      {/* 🔐 LOGIN */}
      {step === "login" && (
        <Login
          setEmail={setEmail}
          setStep={setStep}
        />
      )}

      {/* 🔐 MFA */}
      {step === "mfa" && (
        <MFA
          email={email}
          setToken={setToken}
          setStep={setStep}
        />
      )}

      {/* 📊 DASHBOARD */}
      {step === "dashboard" && (
        <Dashboard
          token={token}
          products={products}
          loadProducts={loadProducts}
          setStep={setStep}
          setToken={setToken}
        />
      )}

    </div>
  );
}

export default App;