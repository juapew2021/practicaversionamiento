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
// Asegura que estas funciones estén disponibles para onclick en HTML

window.simularErrorDB = async function () {
  console.log("Simular error DB real (CHECK monto > 0)");

  // Asegúrate de tener estas variables en el mismo archivo:
  // const SUPABASE_URL = "https://TU-PROJECT.supabase.co";
  // const API_KEY = "TU-ANON-KEY";

  if (typeof SUPABASE_URL === "undefined" || typeof API_KEY === "undefined") {
    alert("Faltan SUPABASE_URL / API_KEY en presupuesto.js");
    return;
  }

  const payload = {
    concepto: "TEST DB ERROR",
    monto: -10,
    moneda: "EUR",
    estado: "BORRADOR"
  };

  try {
    if (typeof mostrarLoader === "function") mostrarLoader();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => ({}));

    if (typeof ocultarLoader === "function") ocultarLoader();

    if (!res.ok) {
      if (typeof mostrarPopup === "function") {
        mostrarPopup("DB rechazó (constraint CHECK)\n" + JSON.stringify(body, null, 2));
      } else {
        alert("DB rechazó (constraint CHECK)\n" + JSON.stringify(body, null, 2));
      }
      return;
    }

    if (typeof mostrarPopup === "function") {
      mostrarPopup("La DB aceptó monto negativo (BUG)\n" + JSON.stringify(body, null, 2));
    } else {
      alert("La DB aceptó monto negativo (BUG)\n" + JSON.stringify(body, null, 2));
    }

  } catch (e) {
    if (typeof ocultarLoader === "function") ocultarLoader();
    alert("Error de red/CORS: " + (e?.message || e));
  }
};

window.simularErrorAPI = function () {
  console.log("Simular error API (500)");
  if (typeof mostrarPopup === "function") {
    mostrarPopup("Error API (500) - Simulado");
  } else {
    alert("Error API (500) - Simulado");
  }
};

window.simularTimeout = function () {
  console.log("Simular timeout (504)");
  if (typeof mostrarLoader === "function") mostrarLoader();

  setTimeout(() => {
    if (typeof ocultarLoader === "function") ocultarLoader();
    if (typeof mostrarPopup === "function") {
      mostrarPopup("Timeout (504) - Simulado");
    } else {
      alert("Timeout (504) - Simulado");
    }
  }, 2000);
};

window.simularDuplicado = function () {
  console.log("Simular duplicado (409)");
  if (typeof mostrarPopup === "function") {
    mostrarPopup("Duplicado (409) - Simulado");
  } else {
    alert("Duplicado (409) - Simulado");
  }
};
// ---------- Helpers visuales ----------
function resetPipeline(){
  ["step-front","step-api","step-db"].forEach(id=>{
    const el=document.getElementById(id);
    if(el){ el.classList.remove("ok","fail"); el.classList.add("neutral"); }
  });
  const log=document.getElementById("qaLog");
  if(log) log.textContent="";
}

function mark(id, status){
  const el=document.getElementById(id);
  if(!el) return;
  el.classList.remove("ok","fail","neutral");
  el.classList.add(status);
}

function logQA(msg){
  const log=document.getElementById("qaLog");
  if(log) log.textContent += msg + "\n";
}

// ---------- Config ----------
const REST_TABLE_URL = `${SUPABASE_URL}/rest/v1/presupuesto`;
// Edge Function que crearemos:
const EDGE_URL = `${SUPABASE_URL}/functions/v1/presupuesto-qa`;

// ---------- 1) FRONT bloquea ----------
window.qa_front_bloquea = function(){
  resetPipeline();
  logQA("Escenario 1: FRONT bloquea (no llega a API/DB)");
  // Simulamos: usuario mete monto negativo y el front lo detecta
  mark("step-front","fail");
  mark("step-api","neutral");
  mark("step-db","neutral");
  mostrarPopup("FRONT: bloqueado por validación (monto debe ser > 0)");
};

// ---------- 2) DB bloquea (Front deja pasar, API deja pasar, DB NO) ----------
window.qa_db_bloquea = async function(){
  resetPipeline();
  logQA("Escenario 2: Front deja pasar → API deja pasar → DB bloquea (CHECK monto>0)");
  mark("step-front","ok");
  mark("step-api","ok");

  const payload = { concepto:"TEST DB BLOQUEA", monto:-10, moneda:"EUR", estado:"BORRADOR" };

  try{
    mostrarLoader();
    const res = await fetch(REST_TABLE_URL, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":API_KEY,
        "Authorization":`Bearer ${API_KEY}`,
        "Prefer":"return=representation"
      },
      body:JSON.stringify(payload)
    });
    const body = await res.json().catch(()=> ({}));
    ocultarLoader();

    if(!res.ok){
      mark("step-db","fail");
      logQA("DB Rechazó por constraint. HTTP=" + res.status);
      logQA(JSON.stringify(body, null, 2));
      mostrarPopup("DB: Rechazó (constraint CHECK monto>0)");
      return;
    }

    // Si llegara a pasar, sería un bug
    mark("step-db","ok");
    mostrarPopup("BUG: DB aceptó monto negativo");
  }catch(e){
    ocultarLoader();
    mark("step-db","fail");
    mostrarPopup("Error de red: " + (e?.message || e));
  }
};

// ---------- 3) API bloquea (Front deja pasar, API NO, DB no recibe) ----------
window.qa_api_bloquea = async function(){
  resetPipeline();
  logQA("Escenario 3: Front deja pasar → API bloquea (regla de negocio) → DB no recibe");
  mark("step-front","ok");

  const payload = { concepto:"TEST API BLOQUEA", monto:99999999, moneda:"EUR", estado:"BORRADOR" };

  try{
    mostrarLoader();
    const res = await fetch(EDGE_URL, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":API_KEY,
        "Authorization":`Bearer ${API_KEY}`
      },
      body:JSON.stringify(payload)
    });
    const body = await res.json().catch(()=> ({}));
    ocultarLoader();

    if(!res.ok){
      mark("step-api","fail");
      mark("step-db","neutral");
      logQA("API Bloqueó. HTTP=" + res.status);
      logQA(JSON.stringify(body, null, 2));
      mostrarPopup("API: bloqueó por regla de negocio (simulado)");
      return;
    }

    // Si pasa, DB debería recibir (depende del edge)
    mark("step-api","ok");
    mark("step-db","ok");
    mostrarPopup("API permitió y DB guardó");
  }catch(e){
    ocultarLoader();
    mark("step-api","fail");
    mostrarPopup("Error de red: " + (e?.message || e));
  }
};

// ---------- 4) Bug funcional backend (API responde 200 pero hace algo incorrecto) ----------
window.qa_bug_backend = async function(){
  resetPipeline();
  logQA("Escenario 4: Bug funcional backend (API responde OK pero lógica incorrecta)");
  mark("step-front","ok");

  const payload = { concepto:"TEST BUG BACKEND", monto:100, moneda:"EUR", estado:"BORRADOR" };

  try{
    mostrarLoader();
    const res = await fetch(EDGE_URL + "?mode=bug", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":API_KEY,
        "Authorization":`Bearer ${API_KEY}`
      },
      body:JSON.stringify(payload)
    });
    const body = await res.json().catch(()=> ({}));
    ocultarLoader();

    if(!res.ok){
      mark("step-api","fail");
      mostrarPopup("API falló (no era el objetivo)");
      return;
    }

    // aquí simulamos que la API devuelve 200 pero “monto” queda mal (ej: lo guarda como 0)
    mark("step-api","ok");
    mark("step-db","ok");
    logQA("API respondió 200, pero revisa el resultado: " + JSON.stringify(body, null, 2));
    mostrarPopup("BUG BACKEND: API OK pero resultado incorrecto (simulado)");
  }catch(e){
    ocultarLoader();
    mark("step-api","fail");
    mostrarPopup("Error de red: " + (e?.message || e));
  }
};
// ---------- helpers visuales ----------

function qaLog(msg){

document.getElementById("output").textContent = msg;

}


// ---------- 1 FRONT bloquea ----------

window.qa_front_bloquea = function(){

qaLog("FRONT bloquea: validación detecta monto negativo");

mostrarPopup("Frontend bloqueó el envío (validación)");

}



// ---------- 2 DB bloquea ----------

window.qa_db_bloquea = async function(){

qaLog("Front deja pasar → API deja pasar → DB bloquea");

const datos = {

concepto:"QA TEST DB",

monto:-5,

moneda:"EUR",

estado:"BORRADOR"

};

try{

const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto`,{

method:"POST",

headers:{
"Content-Type":"application/json",
"apikey":API_KEY,
"Authorization":`Bearer ${API_KEY}`,
"Prefer":"return=representation"
},

body:JSON.stringify(datos)

});

const data = await res.json();

if(!res.ok){

qaLog("DB bloqueó por constraint");

mostrarPopup("DB rechazó monto negativo");

return;

}

qaLog("⚠️ DB aceptó el dato (BUG)");

}catch(e){

qaLog("Error conexión");

}

}



// ---------- 3 API error ----------

window.qa_api_error = async function(){

qaLog("Simulando error API");

try{

const res = await fetch(`${SUPABASE_URL}/rest/v1/tabla_que_no_existe`,{

method:"GET",

headers:{
"apikey":API_KEY
}

});

if(res.status === 404){

mostrarPopup("API error: endpoint no existe (404)");

}

}catch(e){

qaLog("Error conexión API");

}

}



// ---------- 4 Timeout ----------

window.qa_timeout = function(){

qaLog("Simulando timeout servidor");

mostrarLoader();

setTimeout(()=>{

ocultarLoader();

mostrarPopup("Timeout servidor (simulado)");

},3000)

}



// ---------- 5 Bug backend ----------

window.qa_bug_backend = async function(){

qaLog("Simulando bug funcional backend");

const datos = {

concepto:"BUG TEST",

monto:100,

moneda:"EUR",

estado:"BORRADOR"

};

try{

const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto`,{

method:"POST",

headers:{
"Content-Type":"application/json",
"apikey":API_KEY,
"Authorization":`Bearer ${API_KEY}`,
"Prefer":"return=representation"
},

body:JSON.stringify(datos)

});

const data = await res.json();

qaLog("Registro creado pero con lógica incorrecta (bug backend)");

mostrarPopup("API respondió OK pero la lógica es incorrecta (bug)");

}catch(e){

qaLog("Error backend");

}

}
document.getElementById("formPresupuesto")
.addEventListener("submit", function(e){

e.preventDefault()

let valido = true

valido &= validarConcepto()
valido &= validarMonto()
valido &= validarEmail()

if(valido){

mostrarPopup("Formulario válido")

}

})
function validarConcepto(){

const campo = document.getElementById("concepto")
const error = document.getElementById("errorConcepto")

if(campo.value.trim() === ""){

campo.classList.add("errorInput")
error.textContent = "El concepto es obligatorio"

return false

}

campo.classList.remove("errorInput")
campo.classList.add("validInput")
error.textContent = ""

return true

}
function validarMonto(){

const campo = document.getElementById("monto")
const error = document.getElementById("errorMonto")

const valor = parseFloat(campo.value)

if(isNaN(valor)){

campo.classList.add("errorInput")
error.textContent = "Debe ser un número"

return false

}

if(valor <= 0){

campo.classList.add("errorInput")
error.textContent = "El monto debe ser mayor que 0"

return false

}

campo.classList.remove("errorInput")
campo.classList.add("validInput")
error.textContent = ""

return true

}
function validarEmail(){

const campo = document.getElementById("email")
const error = document.getElementById("errorEmail")

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if(!regex.test(campo.value)){

campo.classList.add("errorInput")
error.textContent = "Email inválido"

return false

}

campo.classList.remove("errorInput")
campo.classList.add("validInput")
error.textContent = ""

return true

}
document.getElementById("monto")
.addEventListener("input", validarMonto)

document.getElementById("concepto")
.addEventListener("input", validarConcepto)

document.getElementById("email")
.addEventListener("input", validarEmail)