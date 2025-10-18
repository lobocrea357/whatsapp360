import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3009; // Puerto diferente para la API
const DB_PATH = path.join(process.cwd(), 'db.json')

// Confiar en el proxy (Caddy)
app.set('trust proxy', true)

// Configura CORS para permitir peticiones desde tu dashboard y desde cualquier origen
app.use(cors({
    origin: '*', // Permite acceso desde cualquier origen (útil para Google Cloud VM y Caddy)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// Endpoint para verificar el estado de autenticación
app.get('/status', (req, res) => {
    const qrPath = path.join(process.cwd(), 'bot.qr.png');
    const sessionPath = path.join(process.cwd(), 'bot_sessions');
    
    const qrExists = fs.existsSync(qrPath);
    const sessionExists = fs.existsSync(sessionPath) && fs.readdirSync(sessionPath).length > 0;
    
    res.json({
        qrAvailable: qrExists,
        authenticated: sessionExists,
        message: sessionExists 
            ? 'Bot autenticado correctamente' 
            : qrExists 
                ? 'Esperando escaneo del código QR' 
                : 'Generando código QR...'
    });
});

// Página HTML simple para mostrar el QR
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Bot - QR Code</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    text-align: center;
                    max-width: 500px;
                }
                h1 {
                    margin-bottom: 20px;
                    font-size: 2em;
                }
                #qr-container {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #qr-image {
                    max-width: 100%;
                    height: auto;
                }
                #status {
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    font-size: 1.1em;
                }
                .loading {
                    color: #ffd700;
                }
                .success {
                    color: #00ff00;
                }
                .error {
                    color: #ff6b6b;
                }
                .instructions {
                    margin-top: 20px;
                    text-align: left;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                }
                .instructions ol {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .instructions li {
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 WhatsApp Bot</h1>
                <div id="qr-container">
                    <img id="qr-image" src="/qr" alt="QR Code" onerror="this.style.display='none'; document.getElementById('qr-error').style.display='block';">
                    <div id="qr-error" style="display:none; color: #333;">
                        <p>⏳ Generando código QR...</p>
                        <p style="font-size: 0.9em;">Esto puede tardar unos segundos</p>
                    </div>
                </div>
                <div id="status" class="loading">Cargando estado...</div>
                <div class="instructions">
                    <h3>📱 Instrucciones:</h3>
                    <ol>
                        <li>Abre WhatsApp en tu teléfono</li>
                        <li>Ve a <strong>Configuración</strong> > <strong>Dispositivos vinculados</strong></li>
                        <li>Toca en <strong>Vincular un dispositivo</strong></li>
                        <li>Escanea el código QR que aparece arriba</li>
                    </ol>
                    <p><strong>⚠️ Nota:</strong> El código QR se actualiza cada minuto</p>
                </div>
            </div>
            <script>
                async function checkStatus() {
                    try {
                        const response = await fetch('/status');
                        const data = await response.json();
                        const statusDiv = document.getElementById('status');
                        
                        if (data.authenticated) {
                            statusDiv.className = 'success';
                            statusDiv.innerHTML = '✅ ' + data.message;
                            // Detener la actualización si está autenticado
                            clearInterval(statusInterval);
                            clearInterval(qrInterval);
                        } else if (data.qrAvailable) {
                            statusDiv.className = 'loading';
                            statusDiv.innerHTML = '⏳ ' + data.message;
                        } else {
                            statusDiv.className = 'loading';
                            statusDiv.innerHTML = '🔄 ' + data.message;
                        }
                    } catch (error) {
                        console.error('Error checking status:', error);
                    }
                }
                
                function refreshQR() {
                    const img = document.getElementById('qr-image');
                    const errorDiv = document.getElementById('qr-error');
                    img.src = '/qr?t=' + new Date().getTime();
                    img.style.display = 'block';
                    errorDiv.style.display = 'none';
                }
                
                // Verificar estado cada 3 segundos
                checkStatus();
                const statusInterval = setInterval(checkStatus, 3000);
                
                // Actualizar QR cada 30 segundos
                const qrInterval = setInterval(refreshQR, 30000);
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de API escuchando en http://localhost:${PORT}`);
    console.log(`📱 Para escanear el QR, abre: http://localhost:${PORT}`);
});
