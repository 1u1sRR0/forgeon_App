import {
  type BusinessType,
  type QuestionnaireAnswers,
  type SectionAAnswers,
} from '../types/index';
import { getMultiAgentProvider } from '../multiAgentProvider';

const VALID_BUSINESS_TYPES: BusinessType[] = [
  'SAAS',
  'WEB_APP',
  'LANDING_PAGE',
  'MARKETPLACE',
  'INTERNAL_TOOL',
  'AI_TOOL',
  'ECOMMERCE',
];

/**
 * Generates a contextual AI suggestion for an empty optional field
 * based on existing questionnaire answers.
 */
export async function suggestForField(
  sessionId: string,
  section: string,
  field: string,
  existingAnswers: QuestionnaireAnswers
): Promise<string> {
  const provider = getMultiAgentProvider();

  const contextParts: string[] = [];
  if (existingAnswers.sectionA?.businessIdea) {
    contextParts.push(`Business idea: ${existingAnswers.sectionA.businessIdea}`);
  }
  if (existingAnswers.sectionA?.problemSolved) {
    contextParts.push(`Problem solved: ${existingAnswers.sectionA.problemSolved}`);
  }
  if (existingAnswers.sectionA?.targetCustomer) {
    contextParts.push(`Target customer: ${existingAnswers.sectionA.targetCustomer}`);
  }
  if (existingAnswers.sectionB?.valueProposition) {
    contextParts.push(`Value proposition: ${existingAnswers.sectionB.valueProposition}`);
  }
  if (existingAnswers.sectionB?.coreFeatures?.length) {
    contextParts.push(`Core features: ${existingAnswers.sectionB.coreFeatures.join(', ')}`);
  }

  const contextStr = contextParts.length > 0
    ? contextParts.join('\n')
    : 'No additional context available yet.';

  const systemPrompt = `You are an expert business consultant helping a founder fill out a questionnaire to create a digital business.
Based on the context provided from their existing answers, generate a helpful, concise suggestion for the requested field.
Respond with ONLY the suggestion text — no explanations, no quotes, no formatting.`;

  const userPrompt = `Session: ${sessionId}
Section: ${section}
Field: ${field}

Existing answers context:
${contextStr}

Generate a suggestion for the "${field}" field in section "${section}".`;

  return provider.generateText(systemPrompt, userPrompt);
}


/**
 * Generates a list of suggested features based on business type
 * and Section A answers.
 */
export async function suggestFeatures(
  businessType: BusinessType,
  sectionAAnswers: SectionAAnswers
): Promise<string[]> {
  const provider = getMultiAgentProvider();

  const systemPrompt = `You are an expert product strategist. Based on the business type and business intent provided, suggest a list of core features for the product.
Return a JSON object with a single key "features" containing an array of feature name strings.
Each feature should be concise (3-8 words) and actionable.
Suggest between 5 and 10 features.`;

  const userPrompt = `Business type: ${businessType}
Business idea: ${sectionAAnswers.businessIdea}
Problem solved: ${sectionAAnswers.problemSolved}
Target customer: ${sectionAAnswers.targetCustomer}
${sectionAAnswers.marketContext ? `Market context: ${sectionAAnswers.marketContext}` : ''}

Suggest core features for this product.`;

  const result = await provider.generateStructured<{ features: string[] }>(
    systemPrompt,
    userPrompt
  );

  return Array.isArray(result.features) ? result.features : [];
}

/**
 * Determines the appropriate business type from guided mode
 * clarifying answers. Returns one of the 7 concrete BusinessType
 * values (never GUIDED). Falls back to 'WEB_APP' if AI returns
 * an invalid type.
 */
export async function determineBusinessType(
  clarifyingAnswers: Record<string, string>
): Promise<BusinessType> {
  const provider = getMultiAgentProvider();

  const systemPrompt = `You are an expert business analyst. Based on the user's answers to clarifying questions, determine the most appropriate business type.
You MUST return a JSON object with a single key "businessType" whose value is exactly one of: SAAS, WEB_APP, LANDING_PAGE, MARKETPLACE, INTERNAL_TOOL, AI_TOOL, ECOMMERCE.
Do NOT return GUIDED. Choose the best concrete type based on the answers.`;

  const answersStr = Object.entries(clarifyingAnswers)
    .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
    .join('\n\n');

  const userPrompt = `Based on these clarifying answers, determine the business type:

${answersStr}

Return the most appropriate business type.`;

  const result = await provider.generateStructured<{ businessType: string }>(
    systemPrompt,
    userPrompt
  );

  const aiType = result.businessType as BusinessType;

  if (VALID_BUSINESS_TYPES.includes(aiType)) {
    return aiType;
  }

  return 'WEB_APP';
}
