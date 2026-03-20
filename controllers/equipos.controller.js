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

        matches.forEach(match => {
            const isWinner = (match.equipoA_id === parseInt(id) && match.scoreA > match.scoreB) ||
                             (match.equipoB_id === parseInt(id) && match.scoreB > match.scoreA);
            if (isWinner) won++;
            else lost++;
        });

        // 2. Obtener el MVP (Jugador con más puntos del equipo)
        const [mvpRows] = await pool.query(
            'SELECT nombre, apellido, puntos FROM jugadores WHERE equipo_id = ? ORDER BY puntos DESC LIMIT 1',
            [id]
        );

        const mvp = mvpRows.length > 0 ? mvpRows[0] : null;

        res.json({ won, lost, mvp });
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

module.exports = { updateEquipo, getEquipoStats, getEquipo };
