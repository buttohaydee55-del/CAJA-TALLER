-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS caja_taller;
USE caja_taller;

-- Tabla de movimientos (Ingresos y Egresos)
CREATE TABLE IF NOT EXISTS movimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  tipo ENUM('ingreso', 'egreso') NOT NULL,
  categoria VARCHAR(100) DEFAULT 'General',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba para verificar funcionamiento
INSERT INTO movimientos (descripcion, monto, tipo, categoria) VALUES
('Reparación de tarjeta electrónica', 45.00, 'ingreso', 'Servicio Técnico'),
('Compra de repuestos e insumos', 15.00, 'egreso', 'Inventario');
