const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// "Base de datos" temporal en memoria
let usuarios = [];

// REGISTRO
app.post("/register", (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ message: "Usuario y contraseña requeridos." });
  }
  const existe = usuarios.find(u => u.usuario === usuario);
  if (existe) {
    return res.status(409).json({ message: "El usuario ya existe." });
  }
  usuarios.push({ usuario, password });
  return res.json({ message: "Registro exitoso." });
});

// LOGIN
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const user = usuarios.find(
    u => u.usuario === usuario && u.password === password
  );
  if (!user) {
    return res
      .status(401)
      .json({ message: "Error en la autenticación." });
  }
  return res.json({ message: "Autenticación satisfactoria." });
});

app.listen(3000, () => {
  console.log("API escuchando en http://localhost:3000");
});
