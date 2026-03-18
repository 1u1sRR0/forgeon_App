import { NextResponse } from 'next/server';
import { getRuntimeDiagnostics } from '@/modules/aiRuntime';

export async function GET() {
  try {
    const diagnostics = await getRuntimeDiagnostics();
    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('[AI Diagnostics] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
