const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Crear base de datos local
const db = new sqlite3.Database("./database.db");

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS presupuesto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concepto TEXT,
    monto REAL,
    estado TEXT DEFAULT 'BORRADOR'
  )
`);

// CREATE
app.post("/presupuestos", (req, res) => {
  const { concepto, monto } = req.body;

  db.run(
    "INSERT INTO presupuesto (concepto, monto) VALUES (?, ?)",
    [concepto, monto],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        concepto,
        monto,
        estado: "BORRADOR",
      });
    }
  );
});

// READ
app.get("/presupuestos", (req, res) => {
  db.all("SELECT * FROM presupuesto", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});