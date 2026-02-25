const SUPABASE_URL = "https://walkqbqzvqgccrlwavgp.supabase.co";
const API_KEY = "sb_publishable_O9PvpNkhB9PrwJO36kpQNQ_YhKLrr16";

async function cargar() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/presupuesto?select=*`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    }
  });

  const data = await res.json();
  pintarTabla(data);
}

function pintarTabla(lista) {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  lista.forEach(p => {
    const row = `
      <tr>
        <td>${p.id}</td>
        <td>${p.concepto}</td>
        <td>${p.monto}</td>
        <td>${p.moneda}</td>
        <td>${p.estado}</td>
        <td>${new Date(p.creado_en).toLocaleString()}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Cargar automáticamente al abrir
cargar();