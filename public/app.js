document.querySelector("#saludar").addEventListener("click", async () => {
    const respuesta = await fetch("/api/saludo");
    const datos = await respuesta.json();
    document.querySelector("#resultado").textContent = datos.mensaje;
});
document.querySelector("#btn-curso").addEventListener("click", async () => {
    const respuesta = await fetch("/api/curso");
    const datos = await respuesta.json();
    document.querySelector("#info-curso").textContent = `Curso: ${datos.curso} - Alumnos: ${datos.alumnos}`;
});
