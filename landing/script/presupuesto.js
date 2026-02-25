const SUPABASE_URL = "https://walkqbqzvqgccrlwavgp.supabase.co";
const API_KEY = "sb_publishable_O9PvpNkhB9PrwJO36kpQNQ_YhKLrr16";

// CREATE
async function crear() {
  const concepto = document.getElementById("concepto").value;
  const monto = document.getElementById("monto").value;

  mostrarLoader();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ concepto, monto })
  });

  const data = await res.json();

  ocultarLoader();

  if (res.ok) {
    mostrarPopup("Presupuesto creado correctamente");
  } else {
    mostrarPopup("Error al crear presupuesto");
  }

  mostrar(data, "CREATE");
}

// READ
async function listar() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto?select=*`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    }
  });

  const data = await res.json();
  mostrar(data, "READ");
}

// UPDATE
async function aprobar() {
  const id = document.getElementById("updateId").value;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ estado: "APROBADO" })
  });

  const data = await res.json();
  mostrar(data, "UPDATE");
}

// DELETE
async function eliminar() {
  const id = document.getElementById("updateId").value;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    }
  });

  document.getElementById("output").textContent =
    res.ok ? `DELETE OK → ID ${id}` : "Error DELETE";
}
// Abrir listado en nueva pestaña
function abrirListado() {
  window.open("listado.html", "_blank");
}

// Mostrar resultados
function mostrar(data, tipo) {
  document.getElementById("output").textContent =
    `${tipo} RESPONSE:\n` + JSON.stringify(data, null, 2);
}
function mostrarPopup(mensaje) {
  document.getElementById("popup-msg").textContent = mensaje;
  document.getElementById("popup").style.display = "flex";
}

function cerrarPopup() {
  document.getElementById("popup").style.display = "none";
}
function mostrarLoader() {
  document.getElementById("loader").style.display = "flex";
}

function ocultarLoader() {
  document.getElementById("loader").style.display = "none";
}
// Confirmar eliminación
let idAEliminar = null;

function pedirConfirmEliminar() {
  idAEliminar = document.getElementById("updateId").value;

  if (!idAEliminar) {
    alert("Ingresa el ID");
    return;
  }

  document.getElementById("confirmDelete").style.display = "flex";
}

function cerrarConfirm() {
  document.getElementById("confirmDelete").style.display = "none";
}
// Confirmar eliminación
async function confirmarEliminar() {
  cerrarConfirm();
  mostrarLoader();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto?id=eq.${idAEliminar}`, {
    method: "DELETE",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    }
  });

  ocultarLoader();

  if (res.ok) {
    mostrarPopup("Presupuesto eliminado");
  } else {
    mostrarPopup("Error eliminando");
  }
}