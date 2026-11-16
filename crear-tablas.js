const db = require("./database");

async function crearTablas() {
    const existeCategorias = await db.schema.hasTable("categorias");
    if (!existeCategorias) {
        await db.schema.createTable("categorias", tabla => {
            tabla.increments("id").primary();
            tabla.string("nombre").notNullable().unique();
        });

        await db("categorias").insert([
            { nombre: "Personal" },
            { nombre: "Estudios" },
            { nombre: "Trabajo" }
        ]);
    }

    const existeTareas = await db.schema.hasTable("tareas");
    if (!existeTareas) {
        await db.schema.createTable("tareas", tabla => {
            tabla.increments("id").primary();
            tabla.string("titulo").notNullable();
            tabla.boolean("completada").notNullable().defaultTo(false);
            tabla.integer("categoria_id").references("id").inTable("categorias");
        });
    } else {
        const tieneColumna = await db.schema.hasColumn("tareas", "categoria_id");
        if (!tieneColumna) {
            await db.schema.table("tareas", tabla => {
                tabla.integer("categoria_id").references("id").inTable("categorias");
            });
        }
    }

    console.log("Tablas preparadas con categorías");
}

crearTablas()
    .catch(console.error)
    .finally(() => db.destroy());
