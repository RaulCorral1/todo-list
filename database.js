const knex = require("knex");

const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./tareas.sqlite"
    },
    useNullAsDefault: true
});

module.exports = db;
