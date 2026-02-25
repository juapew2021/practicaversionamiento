const SUPABASE_URL = "https://walkqbqzvqgccrlwavgp.supabase.co";
const API_KEY = "sb_publishable_O9PvpNkhB9PrwJO36kpQNQ_YhKLrr16";

document.getElementById("formPresupuesto")
  .addEventListener("submit", async function(e) {

  e.preventDefault();
  const form = e.target;

  const datos = {
    concepto: form.concepto.value,
    monto: parseFloat(form.monto.value),
    descripcion: form.descripcion.value || null,

    moneda: form.moneda.value,
    estado: form.estado.value,

    urgente: form.urgente.checked,                 // BOOLEAN
    fecha_estimada: form.fecha_estimada.value || null,  // DATE

    email: form.email.value,
    telefono: form.telefono.value || null,

    creado_por: form.creado_por.value
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(datos)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    document.getElementById("resultado").textContent =
      "Guardado en Supabase:\n" + JSON.stringify(data, null, 2);

    form.reset();

  } catch (err) {
    document.getElementById("resultado").textContent =
      "Error:\n" + err.message;
  }
});