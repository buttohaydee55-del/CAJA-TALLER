const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Coloca tu contraseña de MySQL si tienes una
  database: 'caja_taller'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado con éxito a la base de datos MySQL');
});

// 1. Obtener todos los movimientos (Ingresos y Egresos)
app.get('/api/movimientos', (req, res) => {
  const sql = 'SELECT * FROM movimientos ORDER BY fecha DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Registrar un nuevo movimiento
app.post('/api/movimientos', (req, res) => {
  const { descripcion, monto, tipo, categoria } = req.body;
  const sql = 'INSERT INTO movimientos (descripcion, monto, tipo, categoria) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [descripcion, monto, tipo, categoria], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Movimiento registrado con éxito', id: result.insertId });
  });
});

// 3. Obtener el resumen de saldos
app.get('/api/saldo', (req, res) => {
  const sql = `
    SELECT 
      SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS total_ingresos,
      SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS total_egresos,
      (SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) - 
       SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END)) AS saldo_total
    FROM movimientos
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// 4. Eliminar un movimiento por ID
app.delete('/api/movimientos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM movimientos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Movimiento eliminado correctamente' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor de CAJA-TALLER corriendo en el puerto ${PORT}`);
});
