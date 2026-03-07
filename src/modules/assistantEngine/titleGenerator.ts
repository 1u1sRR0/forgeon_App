export function shouldGenerateTitle(messageCount: number): boolean {
  return messageCount >= 2 && messageCount <= 3;
}

export async function generateTitle(messages: any[]): Promise<string> {
  try {
    // Extract first user message
    const firstUserMessage = messages.find((m) => m.role === 'user');
    if (!firstUserMessage) {
      return 'New Conversation';
    }

    // Simple title generation: take first 50 chars
    const title = firstUserMessage.content.slice(0, 50);
    
    // Clean up and format
    const cleanTitle = title
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Ensure it's 4-7 words
    const words = cleanTitle.split(' ').slice(0, 7);
    return words.join(' ') + (words.length >= 7 ? '...' : '');
  } catch (error) {
    console.error('Error generating title:', error);
    return extractTitleFromMessage(messages[0]?.content || '');
  }
}

export function extractTitleFromMessage(message: string): string {
  const title = message.slice(0, 50).replace(/\n/g, ' ').trim();
  return title || 'New Conversation';
}
