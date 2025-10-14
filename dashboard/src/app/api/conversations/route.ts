import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    // Point to the new conversations.json file
    const dbPath = path.join(process.cwd(), '..', 'base-js-baileys-json', 'conversations.json')
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf-8')
            const conversations = JSON.parse(data)
            return NextResponse.json(conversations)
        }
        // If the file doesn't exist, return an empty object
        return NextResponse.json({})
    } catch (error) {
        console.error('Failed to read conversations:', error);
        return NextResponse.json({ error: 'Failed to read conversations' }, { status: 500 })
    }
}
