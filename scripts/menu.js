function mostrarSeccion(seccion) {

    // Oculta todas
    document.getElementById("home").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("contacto").style.display = "none";

    // Muestra la seleccionada
    document.getElementById(seccion).style.display = "block";
}