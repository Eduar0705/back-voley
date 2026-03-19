const pool = require('../models/conexion');

const getStandings = async (req, res) => {
    try {
        const [teams] = await pool.query('SELECT id, nombre, logo FROM equipos');
        const [matches] = await pool.query('SELECT * FROM partidos WHERE status = "finished"');

        const standings = teams.map(team => {
            let pj = 0;
            let pg = 0;
            let puntos = 0;

            matches.forEach(match => {
                if (match.equipoA_id === team.id || match.equipoB_id === team.id) {
                    pj++;
                    const isWinner = (match.equipoA_id === team.id && match.scoreA > match.scoreB) ||
                                     (match.equipoB_id === team.id && match.scoreB > match.scoreA);
                    if (isWinner) pg++;
                }
            });

            puntos = pg * 3; // 3 puntos por victoria

            return {
                id: team.id,
                nombre: team.nombre,
                logo: team.logo,
                pj,
                pg,
                puntos
            };
        });

        // Ordenar por puntos desc, luego por PG desc
        standings.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            return b.pg - a.pg;
        });

        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la tabla de posiciones' });
    }
};

module.exports = { getStandings };
