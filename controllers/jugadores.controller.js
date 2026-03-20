const pool = require('../models/conexion');

const getJugadores = async (req, res) => {
    try {
        // Obtenemos todos los equipos con sus jugadores
        const [rows] = await pool.query(`
            SELECT e.id as equipo_id, e.nombre as equipo_nombre, e.logo as equipo_logo,
                   j.id as jugador_id, j.nombre, j.apellido, j.puntos, j.bloqueos, j.aces
            FROM equipos e
            LEFT JOIN jugadores j ON e.id = j.equipo_id
            ORDER BY e.nombre ASC, j.apellido ASC
        `);

        // Agrupamos los jugadores por equipo en el servidor
        const equiposMap = {};
        rows.forEach(row => {
            if (!equiposMap[row.equipo_id]) {
                equiposMap[row.equipo_id] = {
                    id: row.equipo_id,
                    nombre: row.equipo_nombre,
                    logo: row.equipo_logo,
                    jugadores: []
                };
            }
            if (row.jugador_id) {
                equiposMap[row.equipo_id].jugadores.push({
                    id: row.jugador_id,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    puntos: row.puntos,
                    bloqueos: row.bloqueos,
                    aces: row.aces
                });
            }
        });

        const result = Object.values(equiposMap);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los equipos y jugadores' });
    }
};

const getJugadoresByEquipo = async (req, res) => {
    const { equipo_id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM jugadores WHERE equipo_id = ? ORDER BY apellido ASC',
            [equipo_id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los jugadores del equipo' });
    }
};

const addJugador = async (req, res) => {
    const { nombre, apellido, equipo_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO jugadores (nombre, apellido, equipo_id) VALUES (?, ?, ?)',
            [nombre, apellido, equipo_id]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el jugador' });
    }
};

const updateJugador = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido } = req.body;
    try {
        await pool.query(
            'UPDATE jugadores SET nombre = ?, apellido = ? WHERE id = ?',
            [nombre, apellido, id]
        );
        res.json({ success: true, message: 'Jugador actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el jugador' });
    }
};

const deleteJugador = async (req, res) => {
    const { id } = req.params;
    try {
        const [jugador] = await pool.query('SELECT equipo_id FROM jugadores WHERE id = ?', [id]);
        if (jugador.length === 0) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }
        const equipo_id = jugador[0].equipo_id;

        await pool.query('DELETE FROM jugadores WHERE id = ?', [id]);
        res.json({ success: true, message: 'Jugador eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el jugador' });
    }
};

module.exports = { 
    getJugadores, 
    getJugadoresByEquipo, 
    addJugador, 
    updateJugador, 
    deleteJugador 
};
