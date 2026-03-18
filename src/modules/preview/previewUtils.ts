/**
 * Preview Utilities — extractBusinessStructure & downloadFullPackage
 *
 * Utility functions for the post-generation preview screen.
 * - extractBusinessStructure: Extracts key business data from AgentArtifact array
 * - downloadFullPackage: Downloads a ZIP with all generated documents as Markdown
 *
 * @see Requirements 33.3, 33.4
 */

// ─── Types ───

export interface BusinessStructure {
  name: string;
  valueProposition: string;
  targetMarket: string;
  monetizationModel: string;
  keyFeatures: string[];
}

export interface ArtifactData {
  agentType: string;
  content: Record<string, unknown>;
}

// ─── extractBusinessStructure ───

/**
 * Extracts business structure from an array of AgentArtifact data.
 *
 * Parses BUSINESS_STRATEGIST artifact for valueProposition, targetMarket, monetizationModel.
 * Parses PRODUCT_ARCHITECT artifact for features.
 * Returns a BusinessStructure object with non-empty fields.
 *
 * @param artifacts - Array of artifacts with agentType and content
 * @param projectName - Fallback project name
 * @returns BusinessStructure with extracted data
 * @see Requirement 33.3
 */
export function extractBusinessStructure(
  artifacts: ArtifactData[],
  projectName: string = 'Mi Negocio Digital',
): BusinessStructure {
  const result: BusinessStructure = {
    name: projectName,
    valueProposition: '',
    targetMarket: '',
    monetizationModel: '',
    keyFeatures: [],
  };

  const businessStrategist = artifacts.find(
    (a) => a.agentType === 'BUSINESS_STRATEGIST',
  );
  const productArchitect = artifacts.find(
    (a) => a.agentType === 'PRODUCT_ARCHITECT',
  );
  const monetizationGtm = artifacts.find(
    (a) => a.agentType === 'MONETIZATION_GTM',
  );

  // Extract from BUSINESS_STRATEGIST
  if (businessStrategist?.content) {
    const c = businessStrategist.content;

    if (typeof c.valueProposition === 'string' && c.valueProposition) {
      result.valueProposition = c.valueProposition;
    }

    if (typeof c.targetMarket === 'string' && c.targetMarket) {
      result.targetMarket = c.targetMarket;
    } else if (typeof c.marketAnalysis === 'string' && c.marketAnalysis) {
      // Fallback: use first 200 chars of market analysis
      result.targetMarket = c.marketAnalysis.substring(0, 200);
    }

    if (typeof c.businessModel === 'string' && c.businessModel) {
      result.monetizationModel = c.businessModel;
    }

    // Try to extract name from executiveSummary
    if (typeof c.executiveSummary === 'string' && c.executiveSummary) {
      const lines = c.executiveSummary.split('\n').filter(Boolean);
      if (lines.length > 0 && lines[0].length < 100) {
        result.name = lines[0];
      }
    }
  }

  // Fallback monetization from MONETIZATION_GTM
  if (!result.monetizationModel && monetizationGtm?.content) {
    const c = monetizationGtm.content;
    if (typeof c.monetizationModel === 'string' && c.monetizationModel) {
      result.monetizationModel = c.monetizationModel;
    } else if (typeof c.businessModel === 'string' && c.businessModel) {
      result.monetizationModel = c.businessModel;
    }
  }

  // Extract features from PRODUCT_ARCHITECT
  if (productArchitect?.content) {
    const c = productArchitect.content;
    if (Array.isArray(c.features)) {
      result.keyFeatures = c.features
        .slice(0, 6)
        .map((f: unknown) => {
          if (typeof f === 'object' && f !== null) {
            const feat = f as Record<string, unknown>;
            return String(feat.name || feat.title || '');
          }
          return typeof f === 'string' ? f : '';
        })
        .filter((s: string) => s.length > 0);
    }
  }

  return result;
}

// ─── downloadFullPackage ───

/**
 * Downloads a ZIP package containing all generated documents as Markdown files.
 *
 * Fetches all AgentArtifacts for the session via the existing download API,
 * triggers a browser download of the ZIP file.
 *
 * @param sessionId - The GenerationSession ID
 * @see Requirement 33.4
 */
export async function downloadFullPackage(sessionId: string): Promise<void> {
  const res = await fetch(
    `/api/generate/sessions/${sessionId}/download?format=documents`,
  );

  if (!res.ok) {
    throw new Error('Error al descargar el paquete de documentos');
  }

  const contentDisposition = res.headers.get('Content-Disposition');
  let filename = 'documentos-negocio.zip';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) filename = match[1];
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
