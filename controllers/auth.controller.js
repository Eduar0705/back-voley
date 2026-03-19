const pool = require('../models/conexion');

const login = async (req, res) => {
    const { cedula, clave } = req.body;

    try {
        // En un caso real usaríamos bcrypt para comparar hashes
        const [rows] = await pool.query(
            'SELECT * FROM capitanes WHERE cedula = ? AND clave = ?', 
            [cedula, clave]
        );

        if (rows.length > 0) {
            const user = rows[0];
            res.json({
                success: true,
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    cedula: user.cedula,
                    equipo_id: user.equipo_id
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Cédula o clave incorrecta'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };
