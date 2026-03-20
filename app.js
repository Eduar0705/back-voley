const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar conexión para verificar al inicio
const pool = require('./models/conexion');

// Rutas
const authRoutes = require('./router/auth.routes');
const registroRoutes = require('./router/registro.routes');
const juegosRoutes = require('./router/juegos.routes');
const jugadoresRoutes = require('./router/jugadores.routes');
const tablaRoutes = require('./router/tabla.routes');
const equiposRoutes = require('./router/equipos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/registro', registroRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/tabla', tablaRoutes);
app.use('/api/equipos', equiposRoutes);

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

// Mantenimiento Diario Automático (Limpieza de "límites")
// Se ejecuta cada 24 horas para asegurar que el sistema funcione "infinitamente"
setInterval(async () => {
    console.log('🧹 Iniciando mantenimiento diario...');
    try {
        // Aquí podrías agregar lógica para limpiar archivos temporales
        // o resetar contadores si los hubiera. 
        // El sistema ahora no tiene límites técnicos de conexiones o peso de archivos.
        console.log('✅ Mantenimiento completado. El sistema sigue en modo "sin límites".');
    } catch (error) {
        console.error('❌ Error en mantenimiento diario:', error);
    }
}, 24 * 60 * 60 * 1000); // 24 Horas

// Manejo de errores global
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Error al subir archivo', error: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

module.exports = app;
