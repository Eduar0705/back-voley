const pool = require('../models/conexion');

const getPartidos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, 
            eA.nombre as equipoA_nombre, eA.logo as equipoA_logo,
            eB.nombre as equipoB_nombre, eB.logo as equipoB_logo
            FROM partidos p
            JOIN equipos eA ON p.equipoA_id = eA.id
            JOIN equipos eB ON p.equipoB_id = eB.id
            ORDER BY p.fecha DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los partidos' });
    }
};

const createPartido = async (req, res) => {
    const { equipoA_id, equipoB_id, fecha, detalle } = req.body;
    try {
        await pool.query(
            'INSERT INTO partidos (equipoA_id, equipoB_id, fecha, detalle, status) VALUES (?, ?, ?, ?, "upcoming")',
            [equipoA_id, equipoB_id, fecha, detalle]
        );
        res.json({ success: true, message: 'Partido creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el partido' });
    }
};

const updatePartido = async (req, res) => {
    const { id } = req.params;
    const { scoreA, scoreB, status, detalle, fecha } = req.body;
    try {
        await pool.query(
            'UPDATE partidos SET scoreA = ?, scoreB = ?, status = ?, detalle = ?, fecha = ? WHERE id = ?',
            [scoreA, scoreB, status, detalle, fecha, id]
        );
        res.json({ success: true, message: 'Partido actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el partido' });
    }
};

const deletePartido = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM partidos WHERE id = ?', [id]);
        res.json({ success: true, message: 'Partido eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el partido' });
    }
};

module.exports = { getPartidos, createPartido, updatePartido, deletePartido };
