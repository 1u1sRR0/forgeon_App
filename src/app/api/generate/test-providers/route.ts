import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: Record<string, unknown> = {};

    // 1. Check ENV vars
    results.env = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `✅ set (${process.env.GEMINI_API_KEY.substring(0, 12)}...)` : '❌ NOT SET',
      GEMINI_MODEL: process.env.GEMINI_MODEL || 'not set (default: gemini-2.0-flash)',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? `✅ set (${process.env.OPENAI_API_KEY.substring(0, 12)}...)` : '❌ NOT SET',
      OPENAI_MODEL: process.env.OPENAI_MODEL || 'not set (default: gpt-4o-mini)',
      OLLAMA_ENABLED: process.env.OLLAMA_ENABLED || 'not set',
      OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'not set',
      OLLAMA_HOST: process.env.OLLAMA_HOST || 'not set',
    };

    // 2. Test Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
        const result = await model.generateContent('Say "Gemini OK" in exactly 2 words.');
        const text = result.response.text();
        results.gemini = { status: '✅ WORKING', response: text.substring(0, 100) };
      } catch (e) {
        results.gemini = { status: '❌ FAILED', error: e instanceof Error ? e.message : String(e) };
      }
    } else {
      results.gemini = { status: '⚠️ SKIPPED', reason: 'No API key' };
    }

    // 3. Test OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say "OpenAI OK" in exactly 2 words.' }],
          max_tokens: 10,
        });
        const text = response.choices[0]?.message?.content || '';
        results.openai = { status: '✅ WORKING', response: text.substring(0, 100) };
      } catch (e) {
        results.openai = { status: '❌ FAILED', error: e instanceof Error ? e.message : String(e) };
      }
    } else {
      results.openai = { status: '⚠️ SKIPPED', reason: 'No API key' };
    }

    // 4. Test Ollama
    if (process.env.OLLAMA_ENABLED === 'true') {
      try {
        const { Ollama } = await import('ollama');
        const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
        const response = await ollama.chat({
          model: process.env.OLLAMA_MODEL || 'llama3.2',
          messages: [{ role: 'user', content: 'Say "Ollama OK" in exactly 2 words.' }],
        });
        results.ollama = { status: '✅ WORKING', response: response.message.content.substring(0, 100) };
      } catch (e) {
        results.ollama = { status: '❌ FAILED', error: e instanceof Error ? e.message : String(e) };
      }
    } else {
      results.ollama = { status: '⚠️ SKIPPED', reason: 'OLLAMA_ENABLED not true' };
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
