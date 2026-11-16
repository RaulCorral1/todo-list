const formulario = document.querySelector("#formulario-tarea");
const inputTitulo = document.querySelector("#titulo");
const listaTareas = document.querySelector("#lista-tareas");
const mensajeError = document.querySelector("#mensaje-error");
const selectCategoria = document.querySelector("#categoria");
const filtroCategoria = document.querySelector("#filtro-categoria");

async function cargarCategorias() {
    const respuesta = await fetch("/api/categorias");
    const categorias = await respuesta.json();

    categorias.forEach(cat => {
        const opcion = document.createElement("option");
        opcion.value = cat.id;
        opcion.textContent = cat.nombre;
        selectCategoria.appendChild(opcion);

        const opcionFiltro = opcion.cloneNode(true);
        filtroCategoria.appendChild(opcionFiltro);
    });
}

async function cargarTareas() {
    const catId = filtroCategoria.value;
    const url = catId ? `/api/tareas?categoria_id=${catId}` : "/api/tareas";
    const respuesta = await fetch(url);
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
        const etiquetaCat = tarea.categoria ? ` [${tarea.categoria}]` : "";
        texto.textContent = ` ${tarea.titulo}${etiquetaCat} `;
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

    const categoria_id = selectCategoria.value || null;

    const respuesta = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, categoria_id })
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        mensajeError.textContent = error.error || "Error al guardar";
        return;
    }

    inputTitulo.value = "";
    selectCategoria.value = "";
    cargarTareas();
});

filtroCategoria.addEventListener("change", () => {
    cargarTareas();
});

cargarCategorias();
cargarTareas();
