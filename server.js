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
let tareas = [
    { id: 1, titulo: "Aprender Express", completada: false }
];
let siguienteId = 2;

app.get("/api/tareas", (req, res) => {
    res.json(tareas);
});

app.post("/api/tareas", (req, res) => {
    const titulo = req.body.titulo;
    if (typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ error: "El título es obligatorio" });
    }
    const tarea = {
        id: siguienteId++,
        titulo: titulo.trim(),
        completada: false
    };
    tareas.push(tarea);
    res.status(201).json(tarea);
});
app.delete("/api/tareas/:id", (req, res) => {
    const id = Number(req.params.id);
    const existe = tareas.find(t => t.id === id);

    if (!existe) {
        return res.status(404).json({ error: "No encontrada" });
    }

    tareas = tareas.filter(t => t.id !== id);
    res.status(204).end();
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});