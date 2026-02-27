const SUPABASE_URL = "https://walkqbqzvqgccrlwavgp.supabase.co";
const API_KEY = "sb_publishable_O9PvpNkhB9PrwJO36kpQNQ_YhKLrr16";

document.getElementById("formPresupuesto")
.addEventListener("submit", async function(e){

e.preventDefault();

const form = e.target;

if(!validarFormulario(form)){
return;
}

const datos = {

concepto: form.concepto.value,

monto: parseFloat(form.monto.value),

descripcion: form.descripcion.value || null,

moneda: form.moneda.value,

estado: form.estado.value,

urgente: form.urgente.checked,

fecha_estimada: form.fecha_estimada.value || null,

email: form.email.value,

telefono: form.telefono.value || null,

creado_por: form.creado_por.value

};

await enviarSupabase(datos);

});



async function enviarSupabase(datos){

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


if(res.status === 200 || res.status === 201){

const data = await res.json();

mostrarMensaje("Presupuesto creado correctamente");

return;

}


if(res.status === 400){
mostrarMensaje("Datos incorrectos enviados");
return;
}

if(res.status === 401){
mostrarMensaje("Usuario no autenticado");
return;
}

if(res.status === 403){
mostrarMensaje("No tienes permisos");
return;
}

if(res.status === 404){
mostrarMensaje("Recurso no encontrado");
return;
}

if(res.status === 409){
mostrarMensaje("Registro duplicado");
return;
}

if(res.status === 422){
mostrarMensaje("Error de validación backend");
return;
}

if(res.status === 500){
mostrarMensaje("Error interno del servidor");
return;
}

if(res.status === 504){
mostrarMensaje("Timeout del servidor");
return;
}

}catch(err){

mostrarMensaje("Error de conexión con la API");

}

}



function validarFormulario(form){

let valido = true;

limpiarErrores();

if(!form.concepto.value.trim()){
mostrarError("concepto","El concepto es obligatorio");
valido=false;
}

const monto = parseFloat(form.monto.value);

if(!form.monto.value){
mostrarError("monto","El monto es obligatorio");
valido=false;
}else if(monto <= 0){
mostrarError("monto","El monto debe ser mayor a 0");
valido=false;
}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!form.email.value){
mostrarError("email","El email es obligatorio");
valido=false;
}else if(!emailRegex.test(form.email.value)){
mostrarError("email","Email inválido");
valido=false;
}

if(!form.moneda.value){
mostrarError("moneda","Seleccione una moneda");
valido=false;
}

return valido;

}



function mostrarError(campo,mensaje){

const errorDiv = document.getElementById("error-"+campo);
const input = document.querySelector(`[name="${campo}"]`);

errorDiv.textContent = mensaje;

if(input){
input.classList.add("error-input");
}

}



function limpiarErrores(){

document.querySelectorAll(".error").forEach(e=>{
e.textContent="";
});

document.querySelectorAll(".error-input").forEach(e=>{
e.classList.remove("error-input");
});

}



function mostrarMensaje(texto){

document.getElementById("resultado").textContent = texto;

}
async function simularErrorDB(){

const datos = {

concepto:"TEST ERROR DB",

monto:-10,

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

mostrarPopup("Error Base de Datos (constraint CHECK)");

return;

}

mostrarPopup("La base de datos aceptó el dato (BUG)");

}catch(err){

mostrarPopup("Error conexión");

}

}
function simularErrorAPI(){

mostrarPopup("Error interno del servidor (500)");

}
function simularTimeout(){

mostrarLoader();

setTimeout(()=>{

ocultarLoader();

mostrarPopup("Timeout del servidor (504)");

},3000)

}
function simularDuplicado(){

mostrarPopup("Registro duplicado (409)");

}
document.getElementById("formPresupuesto")
.addEventListener("submit", function(e){

e.preventDefault()

let valido = true

valido &= validarConcepto()
valido &= validarMonto()
valido &= validarEmail()
valido &= validarMoneda()

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
function validarMoneda(){

const campo = document.getElementById("moneda")
const error = document.getElementById("errorMoneda")

if(campo.value === ""){

campo.classList.add("errorInput")
error.textContent = "Seleccione una moneda"

return false
}

campo.classList.remove("errorInput")
campo.classList.add("validInput")
error.textContent = ""

return true
}
