import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3009; // Puerto diferente para la API
const DB_PATH = path.join(process.cwd(), 'db.json')

// Configura CORS para permitir peticiones desde tu dashboard
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Endpoint que lee y devuelve las conversaciones
app.get('/conversations', (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            // Si el archivo no existe (por ejemplo, la primera vez que se ejecuta),
            // devuelve un array vacío, que es un estado válido.
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            console.error("Error leyendo db.json:", err);
            return res.status(500).json({ message: "Error al leer la base de datos." });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            console.error("Error al parsear db.json (probablemente está corrupto o vacío):", parseErr.message);
            // Si el archivo está corrupto, devolvemos un array vacío para no colapsar la app.
            res.json([]);
        }
    });
});

// Endpoint para servir la imagen del QR
app.get('/qr', (req, res) => {
    const qrPath = path.join(process.cwd(), 'bot.qr.png');
    fs.access(qrPath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si el QR no existe todavía, envía un 404
            return res.status(404).send('QR code not generated yet.');
        }
        // Envía el archivo de imagen
        res.sendFile(qrPath);
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de API escuchando en http://localhost:${PORT}`);
});
