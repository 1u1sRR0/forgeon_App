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
import { getAssistantProvider } from '@/modules/assistantEngine/assistantProvider';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message } = body;

    if (!conversationId || !message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (message.length > 10000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // Save user message
    const userMessage = await saveMessage(conversationId, 'user', message);

    // Get conversation history
    const history = await getConversationHistory(conversationId, 20);

    // Build user context
    const userContext = await buildUserContext(session.user.id);

    // Generate response using provider
    const provider = getAssistantProvider();
    const assistantResponse = await provider.generateResponse(
      userContext,
      message,
      history.map((m) => ({ role: m.role, content: m.content }))
    );

    // Save assistant message
    const assistantMessage = await saveMessage(conversationId, 'assistant', assistantResponse);

    // Auto-generate title on first exchange
    let generatedTitle: string | null = null;
    const totalMessages = history.length + 2;
    if (shouldGenerateTitle(totalMessages)) {
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
