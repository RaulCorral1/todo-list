const formulario = document.querySelector("#formulario-tarea");
const inputTitulo = document.querySelector("#titulo");
const listaTareas = document.querySelector("#lista-tareas");
const mensajeError = document.querySelector("#mensaje-error");
const selectCategoria = document.querySelector("#categoria");


async function cargarTareas() {
    const respuesta = await fetch("/api/tareas");
    const tareas = await respuesta.json();
    pintarTareas(tareas);
}

function pintarTareas(tareas) {
    listaTareas.innerHTML = "";

    tareas.forEach(tarea => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(tarea.completada);
        checkbox.addEventListener("change", async () => {
            await fetch(`/api/tareas/${tarea.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completada: checkbox.checked })
            });
            cargarTareas();
        });

        const texto = document.createElement("span");
        texto.textContent = ` ${tarea.titulo} `;
        if (tarea.completada) {
            texto.style.textDecoration = "line-through";
        }

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", async () => {
            await fetch(`/api/tareas/${tarea.id}`, {
                method: "DELETE"
            });
            cargarTareas();
        });

        li.appendChild(checkbox);
        li.appendChild(texto);
        li.appendChild(btnEliminar);
        listaTareas.appendChild(li);
    });
}

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeError.textContent = "";

    const titulo = inputTitulo.value.trim();
    if (!titulo) return;

    const respuesta = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo })
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        mensajeError.textContent = error.error || "Error al guardar";
        return;
    }

    inputTitulo.value = "";
    cargarTareas();
});
async function cargarCategorias() {
    const respuesta = await fetch("/api/categorias");
    const categorias = await respuesta.json();

    categorias.forEach(cat => {
        const opcion = document.createElement("option");
        opcion.value = cat.id;
        opcion.textContent = cat.nombre;
        selectCategoria.appendChild(opcion);
    });
}

cargarTareas();
