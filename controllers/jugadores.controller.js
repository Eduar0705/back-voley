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

module.exports = { getJugadores };
