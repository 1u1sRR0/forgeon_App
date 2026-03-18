import prisma from '@/lib/prisma';
import { execute } from '@/modules/aiRuntime';
import { AIModelTask } from '@/modules/aiRuntime/aiTypes';

// ─── Types ───

export type DocumentType =
  | 'BUSINESS_PLAN'
  | 'STRATEGY'
  | 'GROWTH_PLAN'
  | 'TECHNICAL_ARCHITECTURE'
  | 'FINANCIAL_PROJECTIONS';

export interface GeneratedDocument {
  type: DocumentType;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}

export interface DocumentGenerationResult {
  documents: GeneratedDocument[];
  errors: Array<{ type: DocumentType; error: string }>;
}

export interface BusinessContext {
  projectName: string;
  businessType: string;
  questionnaireResponses: Record<string, unknown>;
  blueprints: Record<string, unknown>;
}

// ─── Document → AIModelTask Mapping ───

const DOCUMENT_TASK_MAP: Record<DocumentType, AIModelTask> = {
  BUSINESS_PLAN: AIModelTask.STRATEGY_DRAFT,
  STRATEGY: AIModelTask.STRATEGY_DRAFT,
  GROWTH_PLAN: AIModelTask.GROWTH_DRAFT,
  TECHNICAL_ARCHITECTURE: AIModelTask.CODE_ARCHITECTURE,
  FINANCIAL_PROJECTIONS: AIModelTask.STRATEGY_DRAFT,
};

// ─── Document Metadata ───

const DOCUMENT_CONFIG: Record<DocumentType, { title: string; agentType: string }> = {
  BUSINESS_PLAN: { title: 'Plan de Negocio', agentType: 'DOCUMENT_BUSINESS_PLAN' },
  STRATEGY: { title: 'Estrategia', agentType: 'DOCUMENT_STRATEGY' },
  GROWTH_PLAN: { title: 'Plan de Crecimiento', agentType: 'DOCUMENT_GROWTH_PLAN' },
  TECHNICAL_ARCHITECTURE: { title: 'Arquitectura Técnica', agentType: 'DOCUMENT_TECHNICAL_ARCHITECTURE' },
  FINANCIAL_PROJECTIONS: { title: 'Proyecciones Financieras', agentType: 'DOCUMENT_FINANCIAL_PROJECTIONS' },
};

const ALL_DOCUMENT_TYPES: DocumentType[] = [
  'BUSINESS_PLAN',
  'STRATEGY',
  'GROWTH_PLAN',
  'TECHNICAL_ARCHITECTURE',
  'FINANCIAL_PROJECTIONS',
];

// ─── Prompt Builders ───

function buildSystemPrompt(type: DocumentType, context: BusinessContext): string {
  const base = `Eres un experto consultor de negocios digitales. Genera documentos profesionales en español para el proyecto "${context.projectName}" (tipo: ${context.businessType}).`;

  switch (type) {
    case 'BUSINESS_PLAN':
      return `${base} Genera un Plan de Negocio completo en formato Markdown. Incluye: resumen ejecutivo, propuesta de valor, modelo de negocio, análisis de mercado, estrategia de monetización, plan operativo y métricas clave.`;
    case 'STRATEGY':
      return `${base} Genera un documento de Estrategia en formato Markdown. Incluye: visión y misión, objetivos estratégicos, análisis FODA, ventajas competitivas, posicionamiento de mercado y roadmap estratégico.`;
    case 'GROWTH_PLAN':
      return `${base} Genera un Plan de Crecimiento en formato Markdown. Incluye: estrategia de adquisición de usuarios, canales de crecimiento, métricas de tracción, plan de escalabilidad, partnerships estratégicos y milestones de crecimiento.`;
    case 'TECHNICAL_ARCHITECTURE':
      return `${base} Genera un documento de Arquitectura Técnica en formato Markdown. Incluye: stack tecnológico recomendado, arquitectura del sistema, diagrama de componentes, modelo de datos, APIs principales, estrategia de despliegue y consideraciones de seguridad.`;
    case 'FINANCIAL_PROJECTIONS':
      return `${base} Genera un documento de Proyecciones Financieras en formato Markdown. Incluye: modelo de ingresos, estructura de costos, proyección a 12 meses, punto de equilibrio, métricas financieras clave (CAC, LTV, MRR) y escenarios optimista/conservador/pesimista.`;
  }
}

function buildUserPrompt(context: BusinessContext): string {
  const parts: string[] = [
    `Proyecto: ${context.projectName}`,
    `Tipo de negocio: ${context.businessType}`,
  ];

  if (Object.keys(context.questionnaireResponses).length > 0) {
    parts.push(`Respuestas del cuestionario: ${JSON.stringify(context.questionnaireResponses)}`);
  }

  if (Object.keys(context.blueprints).length > 0) {
    parts.push(`Blueprints generados: ${JSON.stringify(context.blueprints)}`);
  }

  return parts.join('\n\n');
}

// ─── DocumentGenerator Class ───

export class DocumentGenerator {
  /**
   * Generates all 5 key business documents.
   * Uses AI Runtime with smart routing for each document.
   * If one document fails, continues with the remaining ones.
   */
  async generateAll(
    sessionId: string,
    businessContext: BusinessContext,
  ): Promise<DocumentGenerationResult> {
    const documents: GeneratedDocument[] = [];
    const errors: Array<{ type: DocumentType; error: string }> = [];

    for (const docType of ALL_DOCUMENT_TYPES) {
      try {
        const doc = await this.generateDocument(docType, businessContext);
        await this.storeDocument(sessionId, doc);
        documents.push(doc);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[DocumentGenerator] Failed to generate ${docType}:`, message);
        errors.push({ type: docType, error: message });
      }
    }

    return { documents, errors };
  }

  /**
   * Generates a single document using the appropriate AI provider.
   */
  async generateDocument(
    type: DocumentType,
    context: BusinessContext,
  ): Promise<GeneratedDocument> {
    const task = DOCUMENT_TASK_MAP[type];
    const config = DOCUMENT_CONFIG[type];
    const systemPrompt = buildSystemPrompt(type, context);
    const userPrompt = buildUserPrompt(context);

    const response = await execute(task, systemPrompt, userPrompt);

    return {
      type,
      title: config.title,
      content: response.content,
      metadata: {
        provider: response.provider,
        model: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        latencyMs: response.latencyMs,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Stores a generated document as an AgentArtifact linked to the GenerationSession.
   */
  async storeDocument(
    sessionId: string,
    document: GeneratedDocument,
  ): Promise<void> {
    const config = DOCUMENT_CONFIG[document.type];

    // Get the current session iteration
    const session = await prisma.generationSession.findUnique({
      where: { id: sessionId },
      select: { iteration: true },
    });
    const iteration = session?.iteration ?? 1;

    // Create an AgentRun for this document generation
    const agentRun = await prisma.agentRun.create({
      data: {
        sessionId,
        agentType: config.agentType,
        status: 'COMPLETED',
        iteration,
        inputSummary: `Generate ${config.title}`,
        outputSummary: document.content.substring(0, 200),
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    // Create the AgentArtifact linked to the run
    await prisma.agentArtifact.create({
      data: {
        sessionId,
        agentRunId: agentRun.id,
        agentType: config.agentType,
        iteration,
        content: {
          type: document.type,
          title: document.title,
          markdown: document.content,
        },
        metadata: document.metadata,
      },
    });
  }
}
