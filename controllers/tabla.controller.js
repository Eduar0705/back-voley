const pool = require('../models/conexion');

const getStandings = async (req, res) => {
    try {
        const [teams] = await pool.query('SELECT id, nombre, logo FROM equipos');
        const [matches] = await pool.query('SELECT * FROM partidos WHERE status = "finished"');

        const standings = teams.map(team => {
            let pj = 0, pg = 0, pe = 0, pp = 0, pts = 0;

            matches.forEach(match => {
                const isA = match.equipoA_id === team.id;
                const isB = match.equipoB_id === team.id;

                if (isA || isB) {
                    pj++;
                    const scoreMe = isA ? match.scoreA : match.scoreB;
                    const scoreOp = isA ? match.scoreB : match.scoreA;

                    if (scoreMe > scoreOp) { pg++; pts += 5; }
                    else if (scoreMe === scoreOp) { pe++; pts += 3; }
                    else { pp++; pts += 2; }
                }
            });

            return { id: team.id, nombre: team.nombre, logo: team.logo, pj, pg, pe, pp, pts };
        });

        standings.sort((a, b) => b.pts - a.pts || b.pg - a.pg || a.nombre.localeCompare(b.nombre));

        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la tabla de posiciones' });
    }
};

module.exports = { getStandings };
