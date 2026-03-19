const pool = require('../models/conexion');

const getJuegos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, 
                   e1.nombre as equipoA_nombre, e1.logo as equipoA_logo,
                   e2.nombre as equipoB_nombre, e2.logo as equipoB_logo
            FROM partidos p
            LEFT JOIN equipos e1 ON p.equipoA_id = e1.id
            LEFT JOIN equipos e2 ON p.equipoB_id = e2.id
            ORDER BY p.fecha DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los juegos' });
    }
};

module.exports = { getJuegos };
