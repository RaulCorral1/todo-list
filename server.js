const express = require("express");
const cors = require("cors");
const db = require("./database");

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

app.get("/api/tareas", async (req, res) => {
    try {
        const tareas = await db("tareas").select("*");
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: "No se pudieron consultar las tareas" });
    }
});


app.post("/api/tareas", async (req, res) => {
    const titulo = req.body.titulo;
    if (typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ error: "El título es obligatorio" });
    }

    try {
        const [id] = await db("tareas").insert({
            titulo: titulo.trim(),
            completada: false
        });

        res.status(201).json({
            id: id,
            titulo: titulo.trim(),
            completada: false
        });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la tarea" });
    }
});
app.put("/api/tareas/:id", async (req, res) => {
    const idTarea = Number(req.params.id);
    const estadoCompletada = req.body.completada;

    if (typeof estadoCompletada !== "boolean") {
        return res.status(400).json({ error: "El campo completada debe ser booleano" });
    }

    try {
        const filasModificadas = await db("tareas")
            .where({ id: idTarea })
            .update({ completada: estadoCompletada });

        if (filasModificadas === 0) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        const tareaActualizada = await db("tareas")
            .where({ id: idTarea })
            .first();

        res.json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
});

app.delete("/api/tareas/:id", async (req, res) => {
    try {
        const idTarea = Number(req.params.id);

        const filasEliminadas = await db("tareas")
            .where({ id: idTarea })
            .del();

        if (filasEliminadas === 0) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
});


app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});