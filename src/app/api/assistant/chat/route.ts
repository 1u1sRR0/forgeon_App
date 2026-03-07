import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  saveMessage,
  getConversationHistory,
  updateConversationTitle,
} from '@/modules/assistantEngine/conversationManager';
import { shouldGenerateTitle, generateTitle } from '@/modules/assistantEngine/titleGenerator';
import { buildUserContext } from '@/modules/assistantEngine/userContextBuilder';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // Save user message
    const userMessage = await saveMessage(conversationId, 'user', message);

    // Get conversation history
    const history = await getConversationHistory(conversationId, 20);

    // Build user context
    const userContext = await buildUserContext(session.user.id);

    // Generate assistant response (mock for now)
    const assistantResponse = `I understand you're asking about: "${message}". Based on your ${userContext.stats.totalProjects} projects, I can help you with that.`;

    // Save assistant message
    const assistantMessage = await saveMessage(conversationId, 'assistant', assistantResponse);

    // Check if we should generate a title
    let generatedTitle: string | null = null;
    if (shouldGenerateTitle(history.length + 2)) {
      generatedTitle = await generateTitle([...history, userMessage, assistantMessage]);
      await updateConversationTitle(conversationId, session.user.id, generatedTitle);
    }

    return NextResponse.json({
      userMessage,
      assistantMessage,
      title: generatedTitle,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
