const pool = require('../models/conexion');

const registrarEquipo = async (req, res) => {
    // Cuando enviamos FormData, los objetos suelen venir como strings JSON
    const capitan = typeof req.body.capitan === 'string' ? JSON.parse(req.body.capitan) : req.body.capitan;
    const jugadores = typeof req.body.jugadores === 'string' ? JSON.parse(req.body.jugadores) : req.body.jugadores;
    
    let logo = capitan.logo;
    if (req.file) {
        logo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar el equipo
        const [equipoResult] = await connection.query(
            'INSERT INTO equipos (nombre, logo) VALUES (?, ?)',
            [capitan.equipo, logo || null]
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

const getEquipos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM equipos ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los equipos' });
    }
};

module.exports = { registrarEquipo, getEquipos };
