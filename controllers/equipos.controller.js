const pool = require('../models/conexion');

const updateEquipo = async (req, res) => {
    const { id } = req.params;
    console.log('Update Equipo Body:', req.body);
    console.log('Update Equipo File:', req.file);
    let { nombre } = req.body;
    let logo = req.body.logo; 

    if (req.file) {
        logo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('New Logo URL:', logo);
    }

    try {
        await pool.query(
            'UPDATE equipos SET nombre = ?, logo = ? WHERE id = ?',
            [nombre, logo, id]
        );
        res.json({ success: true, message: 'Equipo actualizado correctamente', logo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el equipo' });
    }
};

const getEquipoStats = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Obtener juegos ganados y perdidos
        const [matches] = await pool.query(
            'SELECT * FROM partidos WHERE (equipoA_id = ? OR equipoB_id = ?) AND status = "finished"',
            [id, id]
        );

        let won = 0;
        let lost = 0;
        let mvpCount = 0;
        let armadorCount = 0;
        let atacanteCount = 0;
        let receptorCount = 0;

        matches.forEach(match => {
            const isWinner = (match.equipoA_id === parseInt(id) && match.scoreA > match.scoreB) ||
                             (match.equipoB_id === parseInt(id) && match.scoreB > match.scoreA);
            if (isWinner) won++;
            else lost++;
        });

        // Contar premios específicos del equipo
        const [awards] = await pool.query(`
            SELECT 
                COUNT(CASE WHEN mvp_id IN (SELECT id FROM jugadores WHERE equipo_id = ?) THEN 1 END) as mvps,
                COUNT(CASE WHEN armador_id IN (SELECT id FROM jugadores WHERE equipo_id = ?) THEN 1 END) as armadores,
                COUNT(CASE WHEN atacante_id IN (SELECT id FROM jugadores WHERE equipo_id = ?) THEN 1 END) as atacantes,
                COUNT(CASE WHEN receptor_id IN (SELECT id FROM jugadores WHERE equipo_id = ?) THEN 1 END) as receptores
            FROM partidos
        `, [id, id, id, id]);

        const { mvps, armadores, atacantes, receptores } = awards[0];

        // 2. Obtener el mejor jugador real del equipo (por puntos o por MVPs?)
        // Dejaré el MVP por puntos como estaba o lo cambiaré por el que tiene más premios?
        // El usuario dijo "seleccionar quien fue el mejor jugador...", así que usaré los premios.
        
        const [topPlayer] = await pool.query(`
            SELECT j.nombre, j.apellido, COUNT(p.mvp_id) as total_mvps
            FROM jugadores j
            JOIN partidos p ON j.id = p.mvp_id
            WHERE j.equipo_id = ?
            GROUP BY j.id
            ORDER BY total_mvps DESC
            LIMIT 1
        `, [id]);

        res.json({ 
            won, 
            lost, 
            mvp: topPlayer[0] || null,
            awards: { mvps, armadores, atacantes, receptores }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las estadísticas del equipo' });
    }
};

const getEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM equipos WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el equipo' });
    }
};

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

            return { ...team, pj, pg, pe, pp, pts };
        });

        // Ordenar por puntos desc, luego por nombre
        standings.sort((a, b) => b.pts - a.pts || a.nombre.localeCompare(b.nombre));

        res.json(standings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la tabla de posiciones' });
    }
};

const deleteEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM equipos WHERE id = ?', [id]);
        res.json({ success: true, message: 'Equipo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar equipo' });
    }
};

module.exports = { updateEquipo, getEquipoStats, getEquipo, getStandings, deleteEquipo };
