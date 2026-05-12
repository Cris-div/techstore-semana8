const API = "http://localhost:3000";

export const loginRequest = (email, password) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

export const verifyMFARequest = (email, code) =>
  fetch(`${API}/auth/verify-mfa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });

export const getProductsRequest = (token) =>
  fetch(`${API}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createProductRequest = (token, data) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const createRoleRequest = (token, data) =>
  fetch(`${API}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // ✔ correcto
    },
    body: JSON.stringify(data)
  });

export const updateProductRequest = (token, id, data) =>
  fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteProductRequest = (token, id) =>
  fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });