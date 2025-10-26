import { join } from 'path'
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { downloadContentFromMessage } from '@leifermendez/baileys'
import fs from 'fs'
import { writeFile, readFile, unlink } from 'fs/promises'
import 'dotenv/config'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const PORT = process.env.PORT ?? 3008
const BOT_ID = process.env.BOT_IDENTIFIER || 'bot5'

/**
 * Convierte un stream de datos en un buffer.
 * @param {ReadableStream} stream - El stream a convertir.
 * @returns {Promise<Buffer>}
 */
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * Transcribe un archivo de audio usando OpenAI Whisper.
 * @param {string} filePath - La ruta al archivo de audio.
 * @returns {Promise<string>} - La transcripción del audio.
 */
const transcribeAudio = async (filePath) => {
    try {
        console.log(`[Whisper] Transcribiendo audio en: ${filePath}`);
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });
        console.log(`[Whisper] Transcripción exitosa: "${transcription.text}"`);
        return transcription.text;
    } catch (error) {
        console.error('[Whisper] Error al transcribir el audio:', error.message);
        return '[Error al transcribir audio]';
    }
};

const main = async () => {
    try {
        console.log('Iniciando el bot...')
        const adapterFlow = createFlow([])
        
        console.log('Creando el proveedor de Baileys...')
        const adapterProvider = createProvider(Provider, {
            version: [2, 3000, 1025190524],
            name: `bot_sessions_${BOT_ID}`,
            gifPlayback: false,
            usePairingCode: false,
            phoneNumber: null
        })
        
        console.log('Creando la base de datos en archivo JSON...')
        const adapterDB = new Database({ filename: 'db.json' })
        const DB_PATH = join(process.cwd(), 'db.json')

        console.log('Creando la instancia principal del bot...')
        const { httpServer } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        }, {
            port: 3001
        })
        
        console.log('Instancia del bot creada.')

        adapterProvider.on('ready', () => {
            const sock = adapterProvider.getInstance()
            console.log('Proveedor listo. Adjuntando listener de guardado robusto.')
            
            sock.ev.on('messages.upsert', async (update) => {
                try {
                    for (const message of update.messages) {
                        if (!message.message || !message.key.remoteJid) continue;

                        const from = message.key.remoteJid;
                        const fromMe = message.key.fromMe;
                        let text = message.message.conversation || message.message.extendedTextMessage?.text || '';

                        const audioMessage = message.message.audioMessage || message.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage;

                        if (audioMessage) {
                            console.log(`[Audio] Mensaje de audio detectado de ${from}.`);
                            
                            // Lógica de descarga CORRECTA
                            const stream = await downloadContentFromMessage(audioMessage, 'audio');
                            const buffer = await streamToBuffer(stream);

                            const tempFilePath = join(process.cwd(), `temp_audio_${Date.now()}.ogg`);
                            await writeFile(tempFilePath, buffer);
                            
                            const transcription = await transcribeAudio(tempFilePath);
                            text = `[Audio]: ${transcription}`;

                            await unlink(tempFilePath);
                        } else if (!text) {
                            text = '[Mensaje no textual]';
                        }

                        // Guardar en la base de datos
                        let conversations = [];
                        try {
                            const data = await readFile(DB_PATH, 'utf8');
                            if (data) conversations = JSON.parse(data);
                        } catch (e) {
                            if (e.code !== 'ENOENT') console.error('Error leyendo db.json:', e);
                        }

                        let conversation = conversations.find(c => c.from === from);
                        if (!conversation) {
                            conversation = { from, name: message.pushName || from, messages: [] };
                            conversations.push(conversation);
                        }

                        conversation.messages.push({
                            body: text,
                            fromMe,
                            timestamp: new Date().toISOString()
                        });
                        
                        await writeFile(DB_PATH, JSON.stringify(conversations, null, 2));
                        console.log(`✅ ¡ÉXITO! Mensaje de/para ${from} guardado en db.json.`);
                    }
                } catch (e) {
                    console.error('❌ ¡ERROR GRAVE DENTRO DEL LISTENER messages.upsert!', e);
                }
            });
        })

        httpServer(+PORT)
        console.log(`Servidor HTTP escuchando en el puerto ${PORT}. El bot está listo.`)

    } catch (err) {
        console.error('Error fatal durante la inicialización del bot:', err)
    }
}

main()

