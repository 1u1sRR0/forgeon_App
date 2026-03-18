/**
 * DocumentExporter - Genera documentos exportables en múltiples formatos.
 *
 * Este módulo genera paquetes ZIP con landing page HTML, plan de negocio
 * en Markdown, y blueprints JSON. También permite exportar HTML standalone.
 *
 * @see Requisitos 3.1, 3.2, 3.3, 3.4, 3.5
 */

import archiver from 'archiver';
import prisma from '@/lib/prisma';
import { safeExtract } from './blueprintDataExtractor';
import { generateAndStoreLandingPage } from './landingPageGenerator';

/**
 * Sanitiza un nombre de proyecto para usarlo como nombre de archivo.
 * Convierte a minúsculas, reemplaza espacios con guiones, y elimina caracteres especiales.
 *
 * @param name - Nombre del proyecto
 * @returns Nombre sanitizado seguro para archivos
 * @see Requisito 3.5
 */
export function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project';
}

/**
 * Genera un documento de plan de negocio en formato Markdown.
 *
 * Incluye secciones: Resumen Ejecutivo, Propuesta de Valor, Modelo de Negocio,
 * Análisis de Mercado, Estrategia de Monetización, y Plan de Implementación.
 * Usa safeExtract para acceso seguro a datos con placeholders cuando faltan.
 *
 * @param artifacts - Array de artefactos con agentType y content
 * @param projectName - Nombre del proyecto
 * @returns Documento Markdown como string
 * @see Requisito 3.3
 */
export function generateBusinessPlanMarkdown(
  artifacts: Array<{ agentType: string; content: Record<string, unknown> }>,
  projectName: string
): string {
  // Index artifacts by agent type for easy lookup
  const byAgent: Record<string, Record<string, unknown>> = {};
  for (const artifact of artifacts) {
    byAgent[artifact.agentType] = artifact.content;
  }

  const bs = byAgent['BUSINESS_STRATEGIST'] || {};
  const pa = byAgent['PRODUCT_ARCHITECT'] || {};
  const mg = byAgent['MONETIZATION_GTM'] || {};

  // --- Resumen Ejecutivo ---
  const executiveSummary = safeExtract<string>(bs, ['executiveSummary'], '');
  const executiveSummaryText = typeof executiveSummary === 'string' && executiveSummary
    ? executiveSummary
    : 'Información no disponible. Complete la generación de blueprints para obtener el resumen ejecutivo.';

  // --- Propuesta de Valor ---
  const valueProposition = safeExtract<string>(bs, ['valueProposition'], '');
  const valuePropositionText = typeof valueProposition === 'string' && valueProposition
    ? valueProposition
    : 'Información no disponible. Complete la generación de blueprints para obtener la propuesta de valor.';

  // --- Modelo de Negocio ---
  const businessModel = safeExtract<string>(bs, ['businessModel'], '');
  const businessModelFromMg = safeExtract<string>(mg, ['businessModel'], '');
  let businessModelText: string;
  if (typeof businessModel === 'string' && businessModel) {
    businessModelText = businessModel;
  } else if (typeof businessModelFromMg === 'string' && businessModelFromMg) {
    businessModelText = businessModelFromMg;
  } else {
    businessModelText = 'Información no disponible. Complete la generación de blueprints para obtener el modelo de negocio.';
  }

  // --- Análisis de Mercado ---
  const marketAnalysis = safeExtract<string>(bs, ['marketAnalysis'], '');
  const marketAnalysisText = typeof marketAnalysis === 'string' && marketAnalysis
    ? marketAnalysis
    : 'Información no disponible. Complete la generación de blueprints para obtener el análisis de mercado.';

  // --- Estrategia de Monetización ---
  const pricingStrategy = safeExtract<Record<string, unknown>>(mg, ['pricingStrategy'], {});
  const monetizationModel = safeExtract<string>(mg, ['monetizationModel'], '');
  let monetizationText: string;
  if (typeof monetizationModel === 'string' && monetizationModel) {
    monetizationText = monetizationModel;
  } else if (pricingStrategy && Object.keys(pricingStrategy).length > 0) {
    monetizationText = JSON.stringify(pricingStrategy, null, 2);
  } else {
    monetizationText = 'Información no disponible. Complete la generación de blueprints para obtener la estrategia de monetización.';
  }

  // --- Plan de Implementación ---
  const implementationPlan = safeExtract<string>(pa, ['implementationPlan'], '');
  const features = safeExtract<unknown[]>(pa, ['features'], []);
  let implementationText: string;
  if (typeof implementationPlan === 'string' && implementationPlan) {
    implementationText = implementationPlan;
  } else if (Array.isArray(features) && features.length > 0) {
    const featureList = features
      .map((f) => {
        if (typeof f === 'object' && f !== null) {
          const fo = f as Record<string, unknown>;
          const name = safeExtract<string>(fo, ['name'], '') || safeExtract<string>(fo, ['title'], '');
          const desc = safeExtract<string>(fo, ['description'], '');
          return name ? `- **${name}**: ${desc}` : null;
        }
        return typeof f === 'string' ? `- ${f}` : null;
      })
      .filter(Boolean)
      .join('\n');
    implementationText = featureList || 'Información no disponible.';
  } else {
    implementationText = 'Información no disponible. Complete la generación de blueprints para obtener el plan de implementación.';
  }

  const markdown = `# Plan de Negocio: ${projectName}

## Resumen Ejecutivo

${executiveSummaryText}

## Propuesta de Valor

${valuePropositionText}

## Modelo de Negocio

${businessModelText}

## Análisis de Mercado

${marketAnalysisText}

## Estrategia de Monetización

${monetizationText}

## Plan de Implementación

${implementationText}

---

*Documento generado automáticamente por Forgeon.*
`;

  return markdown;
}


/**
 * Genera un paquete ZIP completo con todos los documentos del negocio.
 *
 * El ZIP contiene:
 * - {sanitized-project-name}-landing-page.html
 * - {sanitized-project-name}-business-plan.md
 * - {sanitized-project-name}-blueprints.json
 *
 * @param sessionId - ID de la GenerationSession
 * @returns Buffer con el contenido del ZIP
 * @throws Error si la sesión no existe
 * @see Requisitos 3.1, 3.5
 */
export async function generateZipPackage(sessionId: string): Promise<Buffer> {
  // Fetch session with artifacts and questionnaire
  const session = await prisma.generationSession.findUnique({
    where: { id: sessionId },
    include: {
      AgentArtifact: true,
      QuestionnaireResponse: true,
    },
  });

  if (!session) {
    throw new Error(`GenerationSession not found: ${sessionId}`);
  }

  // Get project name from questionnaire or use default
  let projectName = 'Generated Project';
  if (session.QuestionnaireResponse) {
    const sectionD = session.QuestionnaireResponse.sectionD as Record<string, unknown> | null;
    const sectionA = session.QuestionnaireResponse.sectionA as Record<string, unknown> | null;
    const productName = safeExtract<string>(sectionD || {}, ['productName'], '');
    const businessIdea = safeExtract<string>(sectionA || {}, ['businessIdea'], '');
    
    if (productName) {
      projectName = productName;
    } else if (businessIdea) {
      projectName = businessIdea.split('\n')[0].substring(0, 100);
    }
  }

  const sanitizedName = sanitizeFileName(projectName);

  // Get or generate landing page HTML
  let landingHtml = session.landingPageHtml;
  if (!landingHtml) {
    landingHtml = await generateAndStoreLandingPage(sessionId);
  }

  // Transform artifacts for markdown generation
  const artifacts = session.AgentArtifact.map((artifact) => ({
    agentType: artifact.agentType,
    content: (artifact.content as Record<string, unknown>) || {},
  }));

  // Generate business plan markdown
  const businessPlanMd = generateBusinessPlanMarkdown(artifacts, projectName);

  // Prepare blueprints JSON
  const blueprintsJson = JSON.stringify(
    {
      sessionId: session.id,
      projectName,
      generatedAt: new Date().toISOString(),
      artifacts: session.AgentArtifact.map((a) => ({
        agentType: a.agentType,
        content: a.content,
        metadata: a.metadata,
        createdAt: a.createdAt,
      })),
    },
    null,
    2
  );

  // Create ZIP using archiver
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', (err) => reject(err));

    // Add files to archive
    archive.append(landingHtml, { name: `${sanitizedName}-landing-page.html` });
    archive.append(businessPlanMd, { name: `${sanitizedName}-business-plan.md` });
    archive.append(blueprintsJson, { name: `${sanitizedName}-blueprints.json` });

    archive.finalize();
  });
}


/**
 * Retorna el HTML standalone de la landing page para una sesión.
 *
 * Si la landing page ya fue generada, retorna el HTML almacenado.
 * Si no existe, la genera on-demand y la almacena.
 *
 * @param sessionId - ID de la GenerationSession
 * @returns HTML completo de la landing page
 * @throws Error si la sesión no existe
 * @see Requisito 3.2
 */
export async function getStandaloneHtml(sessionId: string): Promise<string> {
  const session = await prisma.generationSession.findUnique({
    where: { id: sessionId },
    select: { id: true, landingPageHtml: true },
  });

  if (!session) {
    throw new Error(`GenerationSession not found: ${sessionId}`);
  }

  if (session.landingPageHtml) {
    return session.landingPageHtml;
  }

  // Generate on-demand if not yet created
  return generateAndStoreLandingPage(sessionId);
}


// ─── Document Agent Types ───

const DOCUMENT_AGENT_TYPES: Record<string, string> = {
  DOCUMENT_BUSINESS_PLAN: 'Plan de Negocio',
  DOCUMENT_STRATEGY: 'Estrategia',
  DOCUMENT_GROWTH_PLAN: 'Plan de Crecimiento',
  DOCUMENT_TECHNICAL_ARCHITECTURE: 'Arquitectura Técnica',
  DOCUMENT_FINANCIAL_PROJECTIONS: 'Proyecciones Financieras',
};

/**
 * Generates a ZIP package containing each generated document as an individual .md file.
 *
 * Fetches all AgentArtifacts for the session that are document types (DOCUMENT_*),
 * extracts their markdown content, and packages them into a ZIP.
 *
 * @param sessionId - ID of the GenerationSession
 * @returns Buffer with the ZIP content
 * @throws Error if the session doesn't exist
 * @see Requirement 33.4
 */
export async function generateDocumentsZipPackage(sessionId: string): Promise<Buffer> {
  const session = await prisma.generationSession.findUnique({
    where: { id: sessionId },
    include: {
      AgentArtifact: true,
      QuestionnaireResponse: true,
    },
  });

  if (!session) {
    throw new Error(`GenerationSession not found: ${sessionId}`);
  }

  // Get project name
  let projectName = 'Generated Project';
  if (session.QuestionnaireResponse) {
    const sectionD = session.QuestionnaireResponse.sectionD as Record<string, unknown> | null;
    const sectionA = session.QuestionnaireResponse.sectionA as Record<string, unknown> | null;
    const productName = safeExtract<string>(sectionD || {}, ['productName'], '');
    const businessIdea = safeExtract<string>(sectionA || {}, ['businessIdea'], '');
    if (productName) projectName = productName;
    else if (businessIdea) projectName = businessIdea.split('\n')[0].substring(0, 100);
  }

  const sanitizedName = sanitizeFileName(projectName);

  // Filter document artifacts
  const documentArtifacts = session.AgentArtifact.filter(
    (a) => a.agentType in DOCUMENT_AGENT_TYPES,
  );

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', (err) => reject(err));

    for (const artifact of documentArtifacts) {
      const content = artifact.content as Record<string, unknown>;
      const title = DOCUMENT_AGENT_TYPES[artifact.agentType] || artifact.agentType;
      const markdown = typeof content.markdown === 'string'
        ? content.markdown
        : `# ${title}\n\nContenido no disponible.`;
      const fileName = sanitizeFileName(title);
      archive.append(markdown, { name: `${sanitizedName}-${fileName}.md` });
    }

    // If no document artifacts found, include the general business plan
    if (documentArtifacts.length === 0) {
      const allArtifacts = session.AgentArtifact.map((a) => ({
        agentType: a.agentType,
        content: (a.content as Record<string, unknown>) || {},
      }));
      const businessPlanMd = generateBusinessPlanMarkdown(allArtifacts, projectName);
      archive.append(businessPlanMd, { name: `${sanitizedName}-plan-de-negocio.md` });
    }

    archive.finalize();
  });
}
