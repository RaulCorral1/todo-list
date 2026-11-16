const db = require("./database");

async function crearTablas() {
    const existe = await db.schema.hasTable("tareas");
    if (!existe) {
        await db.schema.createTable("tareas", tabla => {
            tabla.increments("id").primary();
            tabla.string("titulo").notNullable();
            tabla.boolean("completada").notNullable().defaultTo(false);
        });
    }
    console.log("Base de datos preparada");
}

crearTablas()
    .catch(console.error)
    .finally(() => db.destroy());
