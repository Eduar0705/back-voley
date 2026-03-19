const pool = require('../models/conexion');

const registrarEquipo = async (req, res) => {
    const { capitan, jugadores } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar el equipo
        const [equipoResult] = await connection.query(
            'INSERT INTO equipos (nombre, logo) VALUES (?, ?)',
            [capitan.equipo, capitan.logo || null]
        );
        const equipoId = equipoResult.insertId;

        // 2. Insertar el capitán
        await connection.query(
            'INSERT INTO capitanes (nombre, carrera, cedula, equipo_id) VALUES (?, ?, ?, ?)',
            [capitan.nombre, capitan.carrera, capitan.cedula, equipoId]
        );

        // 3. Insertar jugadores
        const jugadoresValues = jugadores.map(j => [j.nombre, j.apellido, equipoId]);
        await connection.query(
            'INSERT INTO jugadores (nombre, apellido, equipo_id) VALUES ?',
            [jugadoresValues]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: 'Equipo registrado exitosamente' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al registrar el equipo', error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = { registrarEquipo };
