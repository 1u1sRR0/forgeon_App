import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function createConversation(userId: string, title?: string) {
  return await prisma.conversation.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      title: title || 'New Conversation',
      updatedAt: new Date(),
    },
  });
}

export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      Message: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { Message: true },
      },
    },
  });
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conversation) throw new Error('Conversation not found');
  return conversation;
}

export async function updateConversationTitle(
  conversationId: string,
  userId: string,
  title: string
) {
  await getConversation(conversationId, userId);
  return await prisma.conversation.update({
    where: { id: conversationId },
    data: { title, updatedAt: new Date() },
  });
}

export async function deleteConversation(conversationId: string, userId: string) {
  await getConversation(conversationId, userId);
  await prisma.conversation.delete({ where: { id: conversationId } });
}

export async function getConversationMessages(conversationId: string, userId: string) {
  await getConversation(conversationId, userId);
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
      id: crypto.randomUUID(),
      conversationId,
      role,
      content,
      metadata: metadata || {},
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationHistory(conversationId: string, limit: number = 20) {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}
