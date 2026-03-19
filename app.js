const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Importar conexión para verificar al inicio
const pool = require('./models/conexion');

// Rutas
const authRoutes = require('./router/auth.routes');
const registroRoutes = require('./router/registro.routes');
const juegosRoutes = require('./router/juegos.routes');
const jugadoresRoutes = require('./router/jugadores.routes');
const tablaRoutes = require('./router/tabla.routes');

app.use('/api/auth', authRoutes);
app.use('/api/registro', registroRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/tabla', tablaRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenido a la API de Voley Sistems',
        version: '1.0.0',
        endpoints: [
            '/api/auth/login',
            '/api/registro',
            '/api/juegos',
            '/api/jugadores'
        ]
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
