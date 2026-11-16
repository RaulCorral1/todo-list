const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/api/saludo", (req, res) => {
    res.json({ mensaje: "Hola desde el servidor" });
});
app.get("/api/curso", (req, res) => {
    res.json({ curso: "1º DAW", alumnos: 18 });
});
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});