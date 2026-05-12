import { useState } from "react";
import { loginRequest } from "../services/api";

export default function Login({ setEmail, setStep }) {

  const [emailLocal, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginRequest(emailLocal, password);
    const data = await res.json();

    if (res.ok) {
      setEmail(emailLocal);
      setStep("mfa");
    }

    alert(data.msg);
  };

    return (
  <div className="center-screen">
    <div className="card">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setEmailLocal(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button className="btn-full" onClick={handleLogin}>
        Login
      </button>
    </div>
  </div>
);
}