import prisma from '@/lib/prisma';

export async function createConversation(userId: string, title?: string) {
  return await prisma.conversation.create({
    data: {
      userId,
      title: title || 'New Conversation',
    },
  });
}

export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
  });
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
}

export async function updateConversationTitle(
  conversationId: string,
  userId: string,
  title: string
) {
  await getConversation(conversationId, userId); // Check ownership

  return await prisma.conversation.update({
    where: { id: conversationId },
    data: { title },
  });
}

export async function deleteConversation(conversationId: string, userId: string) {
  await getConversation(conversationId, userId); // Check ownership

  await prisma.conversation.delete({
    where: { id: conversationId },
  });
}

export async function getConversationMessages(conversationId: string, userId: string) {
  await getConversation(conversationId, userId); // Check ownership

  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: any
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
      metadata: metadata || {},
    },
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationHistory(conversationId: string, limit: number = 20) {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
