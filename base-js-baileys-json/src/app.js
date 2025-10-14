import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import qrcode from 'qrcode-terminal'

const PORT = process.env.PORT ?? 3008

const welcomeFlow = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer(`🙌 Hola! bienvenido a este *Chatbot*`)
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
    )

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow])
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.on('qr', (qr) => {
        console.log('--- SCAN QR CODE ---');
        qrcode.generate(qr, { small: true });
        console.log('--------------------');
    });

    adapterProvider.on('ready', () => {
        console.log('✅ BOT CONNECTED SUCCESSFULLY ✅');
    });

    adapterProvider.on('auth_failure', (error) => {
        console.error('⚡⚡ AUTHENTICATION ERROR ⚡⚡', error);
    });

    httpServer(+PORT)
}

main()
