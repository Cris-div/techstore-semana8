import { useState } from "react";
import { verifyMFARequest } from "../services/api";

export default function MFA({ email, setToken, setStep }) {

  const [code, setCode] = useState("");

  const verify = async () => {
    const res = await verifyMFARequest(email, code);
    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token); // 🔥 guardar sesión
      setStep("dashboard");
    } else {
      alert(data.msg);
    }
  };

  return (
  <div className="center-screen">
    <div className="card">
      <h2>Verificación MFA</h2>

      <input
        placeholder="Código"
        onChange={e => setCode(e.target.value)}
      />

      <button className="btn-full" onClick={verify}>
        Verificar
      </button>
    </div>
  </div>
);
}