document.querySelector("#saludar").addEventListener("click", async () => {
    const respuesta = await fetch("/api/saludo");
    const datos = await respuesta.json();
    document.querySelector("#resultado").textContent = datos.mensaje;
});
