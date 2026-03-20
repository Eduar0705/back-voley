const pool = require('../models/conexion');

const getJuegos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, 
            eA.nombre as equipoA_nombre, eA.logo as equipoA_logo,
            eB.nombre as equipoB_nombre, eB.logo as equipoB_logo,
            jM.nombre as mvp_nombre, jM.apellido as mvp_apellido,
            jAr.nombre as armador_nombre, jAr.apellido as armador_apellido,
            jAt.nombre as atacante_nombre, jAt.apellido as atacante_apellido,
            jR.nombre as receptor_nombre, jR.apellido as receptor_apellido
            FROM partidos p
            LEFT JOIN equipos eA ON p.equipoA_id = eA.id
            LEFT JOIN equipos eB ON p.equipoB_id = eB.id
            LEFT JOIN jugadores jM ON p.mvp_id = jM.id
            LEFT JOIN jugadores jAr ON p.armador_id = jAr.id
            LEFT JOIN jugadores jAt ON p.atacante_id = jAt.id
            LEFT JOIN jugadores jR ON p.receptor_id = jR.id
            ORDER BY p.fecha DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los juegos' });
    }
};

const createJuego = async (req, res) => {
    const { equipoA_id, equipoB_id, fecha, detalle } = req.body;
    try {
        await pool.query(
            'INSERT INTO partidos (equipoA_id, equipoB_id, fecha, detalle, status) VALUES (?, ?, ?, ?, "upcoming")',
            [equipoA_id, equipoB_id, fecha, detalle]
        );
        res.json({ success: true, message: 'Juego creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el juego' });
    }
};

const updateJuego = async (req, res) => {
    const { id } = req.params;
    const { scoreA, scoreB, status, detalle, fecha, mvp_id, armador_id, atacante_id, receptor_id } = req.body;
    try {
        await pool.query(
            'UPDATE partidos SET scoreA = ?, scoreB = ?, status = ?, detalle = ?, fecha = ?, mvp_id = ?, armador_id = ?, atacante_id = ?, receptor_id = ? WHERE id = ?',
            [scoreA, scoreB, status, detalle, fecha, mvp_id || null, armador_id || null, atacante_id || null, receptor_id || null, id]
        );
        res.json({ success: true, message: 'Juego actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el juego' });
    }
};

const deleteJuego = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM partidos WHERE id = ?', [id]);
        res.json({ success: true, message: 'Juego eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el juego' });
    }
};

module.exports = { getJuegos, createJuego, updateJuego, deleteJuego };
