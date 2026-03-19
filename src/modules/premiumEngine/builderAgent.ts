// Builder Agent — processes natural language change requests on generated HTML

import { execute, AIModelTask } from '@/modules/aiRuntime';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BusinessContext {
  projectName: string;
  businessType: string;
  colors: { primary: string; secondary: string };
}

export interface BuilderAgentResponse {
  modifiedHtml: string;
  assistantMessage: string;
  success: boolean;
}

const SYSTEM_PROMPT = `Eres un agente de diseño web experto. El usuario te pedirá cambios sobre el HTML de su negocio digital.

REGLAS:
1. Recibe el HTML actual y una solicitud de cambio en lenguaje natural.
2. Devuelve SOLO un JSON con dos campos:
   - "html": el HTML completo modificado (todo el documento, no fragmentos)
   - "message": un mensaje breve en español confirmando qué cambiaste
3. Si no puedes interpretar la solicitud, devuelve el HTML sin cambios y un mensaje explicativo.
4. Mantén la estructura general del HTML. Solo modifica lo que el usuario pide.
5. Puedes cambiar: colores, textos, tamaños, tipografía, agregar/quitar secciones, reordenar elementos.
6. Usa clases Tailwind CSS para los estilos.
7. Responde SIEMPRE en español.
8. NO agregues comentarios en el HTML.
9. El JSON debe ser válido y parseable.`;

export class BuilderAgent {
  async processRequest(params: {
    message: string;
    currentHtml: string;
    businessContext: BusinessContext;
    conversationHistory: ChatMessage[];
  }): Promise<BuilderAgentResponse> {
    const { message, currentHtml, businessContext, conversationHistory } = params;

    const historyText = conversationHistory.length > 0
      ? conversationHistory
          .slice(-6) // last 3 exchanges
          .map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
          .join('\n')
      : 'Sin historial previo.';

    const userPrompt = `CONTEXTO DEL NEGOCIO:
- Nombre: ${businessContext.projectName}
- Tipo: ${businessContext.businessType}
- Color primario: ${businessContext.colors.primary}
- Color secundario: ${businessContext.colors.secondary}

HISTORIAL DE CONVERSACIÓN:
${historyText}

HTML ACTUAL:
${currentHtml}

SOLICITUD DEL USUARIO:
${message}

Responde con un JSON válido: { "html": "...", "message": "..." }`;

    try {
      const response = await execute(
        AIModelTask.BUILDER_CHAT,
        SYSTEM_PROMPT,
        userPrompt,
      );

      const parsed = this.parseResponse(response.content, currentHtml);
      return parsed;
    } catch (error: any) {
      return {
        modifiedHtml: currentHtml,
        assistantMessage: 'Lo siento, hubo un error al procesar tu solicitud. Intenta reformular tu petición.',
        success: false,
      };
    }
  }

  private parseResponse(raw: string, fallbackHtml: string): BuilderAgentResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          modifiedHtml: fallbackHtml,
          assistantMessage: 'No pude interpretar la respuesta. Intenta ser más específico con tu solicitud.',
          success: false,
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (typeof parsed.html === 'string' && typeof parsed.message === 'string') {
        return {
          modifiedHtml: parsed.html,
          assistantMessage: parsed.message,
          success: true,
        };
      }

      return {
        modifiedHtml: fallbackHtml,
        assistantMessage: 'No pude aplicar los cambios. Intenta con una solicitud más específica.',
        success: false,
      };
    } catch {
      return {
        modifiedHtml: fallbackHtml,
        assistantMessage: 'Error al procesar la respuesta. Intenta reformular tu petición.',
        success: false,
      };
    }
  }
}
