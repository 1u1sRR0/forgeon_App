import prisma from '@/lib/prisma';
import { ContentBlock, ProjectContext } from './courseTypes';
import { generateDeterministicId } from './utils/determinism';
import { genericTemplates } from './templates/genericTemplates';
import { buildQuizzes } from './quizBuilder';
import { execute, AIModelTask } from '@/modules/aiRuntime';

/**
 * Main course generation function
 * Deterministic: same inputs = same outputs
 */
export async function generateCourse(projectId: string): Promise<void> {
  // 1. Gather project context
  const context = await buildProjectContext(projectId);
  
  // 2. Generate course structure
  const courseId = generateDeterministicId(projectId, 'course');
  
  // 3. Create course in database
  await prisma.course.create({
    data: {
      id: courseId,
      projectId,
      title: `Domina tu ${context.businessType} MVP`,
      description: `Ruta de aprendizaje completa para construir y lanzar tu ${context.businessType} en ${context.industry}`,
      metadata: {
        businessType: context.businessType,
        industry: context.industry,
        templateType: context.templateType,
        techStack: context.techStack,
        generatedAt: new Date().toISOString(),
        version: 1,
      },
      updatedAt: new Date(),
    },
  });
  
  // 4. Generate 6 levels with lessons
  await generateLevels(courseId, context);
}

/**
 * Generate all 6 course levels
 */
async function generateLevels(courseId: string, context: ProjectContext): Promise<void> {
  const levelDefinitions = [
    {
      number: 1,
      title: 'Entendiendo el Negocio',
      description: 'Domina tu modelo de negocio, propuesta de valor y posicionamiento en el mercado',
      topics: ['business_model', 'value_proposition', 'target_market', 'competitive_analysis'],
    },
    {
      number: 2,
      title: 'Fundamentos Técnicos',
      description: 'Aprende tu stack tecnológico, arquitectura y flujo de desarrollo',
      topics: ['tech_stack', 'architecture', 'database', 'authentication', 'api_design'],
    },
    {
      number: 3,
      title: 'Despliegue y Operaciones',
      description: 'Despliega tu MVP y configura las operaciones esenciales',
      topics: ['local_setup', 'environment_config', 'deployment', 'monitoring', 'ci_cd'],
    },
    {
      number: 4,
      title: 'Legal y Cumplimiento',
      description: 'Comprende los requisitos legales y las bases del cumplimiento normativo',
      topics: ['business_registration', 'terms_of_service', 'privacy_policy', 'gdpr', 'payment_compliance'],
    },
    {
      number: 5,
      title: 'Crecimiento y Escalabilidad',
      description: 'Estrategias para adquirir usuarios y escalar tu negocio',
      topics: ['mvp_validation', 'user_acquisition', 'metrics', 'feedback_loops', 'scaling_strategy'],
    },
    {
      number: 6,
      title: 'Operaciones Avanzadas',
      description: 'Optimiza operaciones, analítica y procesos de equipo',
      topics: ['analytics', 'marketing', 'customer_support', 'iteration', 'team_building'],
    },
  ];
  
  for (const def of levelDefinitions) {
    const levelId = generateDeterministicId(courseId, `level-${def.number}`);
    
    await prisma.courseLevel.create({
      data: {
        id: levelId,
        courseId,
        levelNumber: def.number,
        title: def.title,
        description: def.description,
        objectives: def.topics.slice(0, 5).map(topic => 
          `Comprender y aplicar ${topic.replace(/_/g, ' ')} en tu proyecto ${context.businessType}`
        ),
        updatedAt: new Date(),
      },
    });
    
    // Create lessons with AI-generated content
    for (let i = 0; i < def.topics.length; i++) {
      const topic = def.topics[i];
      const lessonId = generateDeterministicId(levelId, `lesson-${i + 1}`);
      const topicTitle = topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const content = await generateAILessonContent(topic, topicTitle, def.title, context);
      const wordCount = content.map(b => (b.content || '') + (b.items?.join(' ') || '')).join(' ').split(/\s+/).length;
      const estimatedMinutes = Math.max(8, Math.ceil(wordCount / 200));
      
      await prisma.lesson.create({
        data: {
          id: lessonId,
          levelId,
          lessonNumber: i + 1,
          title: topicTitle,
          description: `Aprende sobre ${topic.replace(/_/g, ' ')} para tu proyecto ${context.businessType}`,
          content: content as any,
          estimatedMinutes,
          updatedAt: new Date(),
        },
      });
    }
    
    // Create quiz with real questions from quizBuilder
    const quizData = buildQuizzes(def.number, def.title, context);
    const quizId = generateDeterministicId(levelId, 'quiz');
    await prisma.quiz.create({
      data: {
        id: quizId,
        levelId,
        title: `${def.title} - Evaluación`,
        description: `Evalúa tu comprensión de los conceptos de ${def.title.toLowerCase()}`,
        questions: quizData.questions.map((q, qi) => ({
          id: generateDeterministicId(quizId, `q${qi + 1}`),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctOptionId,
          explanation: q.explanation,
          category: q.category,
        })) as any,
        passingScore: 70,
        updatedAt: new Date(),
      },
    });
  }
}

/**
 * Generate lesson content using AI, with static fallback
 */
async function generateAILessonContent(
  topic: string,
  topicTitle: string,
  levelTitle: string,
  context: ProjectContext
): Promise<ContentBlock[]> {
  try {
    const systemPrompt = `Eres un experto en educación empresarial y tecnológica. Generas contenido educativo DENSO, PRÁCTICO y PERSONALIZADO en español.

REGLAS ESTRICTAS:
- Todo el contenido DEBE estar en español
- El contenido debe ser DENSO: mínimo 800 palabras por lección
- Usa datos concretos, ejemplos reales y consejos accionables
- Personaliza TODO al proyecto del usuario
- Usa formato markdown: ## para secciones, **negrita**, *cursiva*, listas, > citas
- NO uses contenido genérico ni relleno

FORMATO DE RESPUESTA - JSON array de ContentBlock:
[
  {"type":"text","content":"# Título\\n\\nContenido con **markdown**..."},
  {"type":"tip","title":"Consejo","content":"Texto del consejo..."},
  {"type":"warning","title":"Advertencia","content":"Texto..."},
  {"type":"checklist","title":"Título","items":["Item 1","Item 2"]},
  {"type":"code","language":"typescript","content":"// código"},
  {"type":"callout","title":"Nota","content":"Texto importante..."},
  {"type":"step","title":"Pasos","steps":["Paso 1","Paso 2"]}
]

Tipos disponibles: text, tip, warning, checklist, code, callout, step
El campo "content" en bloques "text" soporta markdown completo.`;

    const userPrompt = `Genera contenido educativo COMPLETO y DENSO para esta lección:

LECCIÓN: ${topicTitle}
NIVEL: ${levelTitle}
TEMA: ${topic}

CONTEXTO DEL PROYECTO:
- Nombre: ${context.name}
- Tipo de negocio: ${context.businessType}
- Industria: ${context.industry}
- Problema que resuelve: ${context.problemStatement}
- Solución propuesta: ${context.solution}
- Audiencia objetivo: ${context.targetAudience}
- Modelo de monetización: ${context.monetizationModel}
- Diferenciador: ${context.uniqueValue}
- Stack tecnológico: ${context.techStack.join(', ')}

REQUISITOS:
1. Mínimo 5 bloques de contenido
2. Incluye al menos: 1 bloque text largo con markdown, 1 tip, 1 checklist o step
3. Personaliza CADA sección al proyecto "${context.name}"
4. Incluye ejemplos concretos aplicados a un ${context.businessType} de ${context.industry}
5. Si el tema es técnico, incluye bloques de código relevantes
6. El contenido debe ser útil y accionable, no teórico

Responde SOLO con el JSON array, sin texto adicional.`;

    const response = await execute(
      AIModelTask.LEARN_COURSE_GENERATION,
      systemPrompt,
      userPrompt,
      { projectId: context.projectId }
    );

    // Parse the AI response
    const cleaned = response.content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length >= 3) {
      // Validate block types
      const validTypes = ['text', 'code', 'checklist', 'warning', 'tip', 'callout', 'step'];
      const validated = parsed.filter(
        (b: any) => b && typeof b === 'object' && validTypes.includes(b.type)
      );
      if (validated.length >= 3) return validated as ContentBlock[];
    }
  } catch (error) {
    console.error(`AI content generation failed for ${topic}, using fallback:`, error);
  }

  // Fallback to static content
  return buildStaticLessonContent(topic, topicTitle, context);
}

/**
 * Static fallback lesson content
 */
function buildStaticLessonContent(topic: string, topicTitle: string, context: ProjectContext): ContentBlock[] {
  const content: ContentBlock[] = [];
  const template = (genericTemplates as any)[topic];
  
  // Introduction
  content.push({
    type: 'text',
    content: `# ${topicTitle}\n\n${template?.introduction || `Aprende los fundamentos de ${topicTitle.toLowerCase()} y cómo aplicarlos a tu proyecto.`}\n\nEn esta lección aprenderás cómo aplicar estos conceptos específicamente a **${context.name}**.`,
  });
  
  // Context-specific content
  if (topic === 'business_model') {
    content.push({
      type: 'text',
      content: `## Tu Modelo de Negocio\n\n**${context.name}** opera con un modelo de tipo **${context.businessType}** en la industria de **${context.industry}**.\n\nTu modelo de monetización es: **${context.monetizationModel}**.\n\nUn modelo de negocio sólido responde a tres preguntas clave:\n1. ¿Qué valor creas para tus usuarios?\n2. ¿Cómo entregas ese valor?\n3. ¿Cómo capturas valor (generas ingresos)?`,
    });
    content.push({
      type: 'checklist',
      title: 'Checklist del Modelo de Negocio',
      items: [
        'Propuesta de valor claramente definida',
        'Segmento de clientes identificado',
        'Canales de distribución establecidos',
        'Fuentes de ingresos definidas',
        'Estructura de costos estimada',
      ],
    });
  } else if (topic === 'value_proposition') {
    content.push({
      type: 'text',
      content: `## Tu Propuesta de Valor\n\n**${context.name}** resuelve el siguiente problema:\n\n> ${context.problemStatement}\n\nTu solución:\n\n> ${context.solution}\n\nLo que te diferencia: **${context.uniqueValue}**`,
    });
    content.push({
      type: 'tip',
      title: 'Consejo',
      content: 'Tu propuesta de valor debe poder explicarse en una sola frase. Si necesitas más, probablemente necesitas simplificarla.',
    });
  } else if (topic === 'target_market') {
    content.push({
      type: 'text',
      content: `## Tu Mercado Objetivo\n\nTu audiencia principal: **${context.targetAudience}**\n\nPara validar tu mercado, necesitas:\n\n1. **Tamaño del mercado**: ¿Cuántas personas tienen este problema?\n2. **Disposición a pagar**: ¿Están dispuestos a pagar por una solución?\n3. **Accesibilidad**: ¿Puedes llegar a ellos de forma eficiente?\n4. **Urgencia**: ¿Qué tan urgente es resolver este problema para ellos?`,
    });
    content.push({
      type: 'warning',
      title: 'Error Común',
      content: 'No intentes servir a "todos". Un mercado objetivo demasiado amplio diluye tu mensaje y tus recursos. Empieza con un nicho específico.',
    });
  } else if (topic === 'competitive_analysis') {
    content.push({
      type: 'text',
      content: `## Análisis Competitivo\n\nPara **${context.name}**, necesitas entender:\n\n1. **Competidores directos**: Quiénes ofrecen soluciones similares\n2. **Competidores indirectos**: Alternativas que tus usuarios usan actualmente\n3. **Tu ventaja**: ${context.uniqueValue}\n\nCrea una matriz comparativa con estas dimensiones:\n- Precio\n- Funcionalidades clave\n- Experiencia de usuario\n- Soporte al cliente\n- Integraciones`,
    });
    content.push({
      type: 'step',
      title: 'Pasos para tu Análisis Competitivo',
      steps: [
        'Identifica 3-5 competidores principales',
        'Regístrate y prueba sus productos',
        'Documenta fortalezas y debilidades de cada uno',
        'Identifica gaps que puedes llenar',
        'Define tu posicionamiento único',
      ],
    });
  } else if (topic === 'tech_stack') {
    content.push({
      type: 'text',
      content: `## Tu Stack Tecnológico\n\n**${context.name}** utiliza las siguientes tecnologías:\n\n${context.techStack.map(tech => `- **${tech}**`).join('\n')}\n\nCada tecnología fue elegida por razones específicas de rendimiento, escalabilidad y productividad del desarrollador.`,
    });
    content.push({
      type: 'code',
      language: 'typescript',
      content: `// Estructura básica de tu proyecto\nconst projectConfig = {\n  name: "${context.name}",\n  type: "${context.projectType}",\n  stack: ${JSON.stringify(context.techStack, null, 4)}\n};`,
    });
  } else if (topic === 'architecture') {
    content.push({
      type: 'text',
      content: `## Arquitectura del Sistema\n\nPara un proyecto de tipo **${context.businessType}**, la arquitectura típica incluye:\n\n1. **Frontend**: Interfaz de usuario (Next.js con React)\n2. **Backend**: API y lógica de negocio (Next.js API Routes)\n3. **Base de datos**: Almacenamiento persistente (PostgreSQL con Prisma)\n4. **Autenticación**: Gestión de usuarios (NextAuth.js)\n5. **Despliegue**: Infraestructura en la nube`,
    });
    content.push({
      type: 'callout',
      title: 'Principio Clave',
      content: 'Mantén tu arquitectura simple al inicio. Es más fácil escalar una arquitectura simple que simplificar una compleja.',
    });
  } else if (topic === 'database') {
    content.push({
      type: 'text',
      content: `## Diseño de Base de Datos\n\nTu base de datos es el corazón de **${context.name}**. Un buen diseño de datos:\n\n1. **Normalización**: Evita duplicación de datos\n2. **Índices**: Optimiza las consultas frecuentes\n3. **Relaciones**: Define cómo se conectan tus entidades\n4. **Migraciones**: Gestiona cambios de esquema de forma segura`,
    });
    content.push({
      type: 'code',
      language: 'prisma',
      content: `// Ejemplo de modelo Prisma para tu proyecto\nmodel User {\n  id        String   @id @default(uuid())\n  email     String   @unique\n  name      String?\n  createdAt DateTime @default(now())\n  // Agrega relaciones según tu modelo de negocio\n}`,
    });
  } else if (topic === 'authentication') {
    content.push({
      type: 'text',
      content: `## Autenticación y Seguridad\n\nLa autenticación protege **${context.name}** y los datos de tus usuarios.\n\nEstrategias comunes:\n\n1. **Email/Contraseña**: El método más básico\n2. **OAuth**: Login con Google, GitHub, etc.\n3. **Magic Links**: Links de acceso por email\n4. **2FA**: Autenticación de dos factores`,
    });
    content.push({
      type: 'warning',
      title: 'Seguridad Crítica',
      content: 'Nunca almacenes contraseñas en texto plano. Usa siempre hashing (bcrypt) y HTTPS en producción.',
    });
  } else if (topic === 'api_design') {
    content.push({
      type: 'text',
      content: `## Diseño de API\n\nTu API es la interfaz entre el frontend y el backend de **${context.name}**.\n\nPrincipios de buen diseño:\n\n1. **RESTful**: Usa verbos HTTP correctamente (GET, POST, PUT, DELETE)\n2. **Consistencia**: Mantén convenciones uniformes\n3. **Validación**: Valida todos los inputs\n4. **Errores claros**: Devuelve mensajes de error útiles`,
    });
    content.push({
      type: 'code',
      language: 'typescript',
      content: `// Ejemplo de endpoint API\nexport async function GET(request: NextRequest) {\n  try {\n    const session = await getServerSession(authOptions);\n    if (!session?.user?.id) {\n      return NextResponse.json(\n        { error: 'No autorizado' },\n        { status: 401 }\n      );\n    }\n    // Tu lógica aquí\n    return NextResponse.json({ data: result });\n  } catch (error) {\n    return NextResponse.json(\n      { error: 'Error interno' },\n      { status: 500 }\n    );\n  }\n}`,
    });
  } else if (topic === 'deployment') {
    content.push({
      type: 'text',
      content: `## Despliegue\n\nDesplegar **${context.name}** significa hacerlo accesible para tus usuarios.\n\nOpciones populares:\n\n1. **Vercel**: Ideal para Next.js, despliegue automático\n2. **Railway/Render**: Para bases de datos y servicios\n3. **AWS/GCP**: Para mayor control y escalabilidad`,
    });
    content.push({
      type: 'step',
      title: 'Pasos para tu Primer Despliegue',
      steps: [
        'Configura variables de entorno en producción',
        'Conecta tu repositorio Git al servicio de hosting',
        'Ejecuta las migraciones de base de datos',
        'Verifica que todo funcione en el entorno de staging',
        'Despliega a producción',
      ],
    });
  } else if (topic === 'mvp_validation') {
    content.push({
      type: 'text',
      content: `## Validación del MVP\n\nAntes de invertir más tiempo en **${context.name}**, necesitas validar que:\n\n1. **El problema es real**: La gente realmente tiene este problema\n2. **Tu solución funciona**: Resuelve el problema de forma efectiva\n3. **Hay disposición a pagar**: Los usuarios pagarían por esto\n\nMétodos de validación:\n- Entrevistas con usuarios potenciales\n- Landing page con lista de espera\n- Prototipo funcional con usuarios beta\n- Métricas de engagement`,
    });
    content.push({
      type: 'tip',
      title: 'Regla del MVP',
      content: 'Si no te da un poco de vergüenza tu MVP, lo lanzaste demasiado tarde. El objetivo es aprender rápido, no ser perfecto.',
    });
  } else if (topic === 'user_acquisition') {
    content.push({
      type: 'text',
      content: `## Adquisición de Usuarios\n\nPara **${context.name}**, dirigido a **${context.targetAudience}**, considera estos canales:\n\n1. **Orgánico**: SEO, contenido, redes sociales\n2. **Pagado**: Google Ads, Facebook Ads, LinkedIn\n3. **Referidos**: Programa de referidos\n4. **Comunidad**: Foros, grupos, eventos\n5. **Partnerships**: Alianzas estratégicas`,
    });
    content.push({
      type: 'callout',
      title: 'Métrica Clave: CAC',
      content: 'El Costo de Adquisición de Cliente (CAC) debe ser significativamente menor que el Valor de Vida del Cliente (LTV). Apunta a un ratio LTV:CAC de al menos 3:1.',
    });
  } else if (topic === 'metrics') {
    content.push({
      type: 'text',
      content: `## Métricas Clave\n\nPara un proyecto **${context.businessType}** como **${context.name}**, las métricas esenciales son:\n\n1. **MRR** (Monthly Recurring Revenue): Ingresos mensuales recurrentes\n2. **Churn Rate**: Tasa de cancelación\n3. **CAC**: Costo de adquisición de cliente\n4. **LTV**: Valor de vida del cliente\n5. **NPS**: Net Promoter Score (satisfacción)`,
    });
    content.push({
      type: 'checklist',
      title: 'Dashboard de Métricas Mínimo',
      items: [
        'Usuarios activos diarios/mensuales (DAU/MAU)',
        'Tasa de conversión de registro a usuario activo',
        'Ingresos mensuales recurrentes (MRR)',
        'Tasa de churn mensual',
        'Tiempo promedio en la plataforma',
      ],
    });
  } else {
    // Generic content for other topics
    if (template) {
      content.push({
        type: 'text',
        content: `## ${topicTitle} para ${context.name}\n\n${template.sections?.[0]?.content || ''}\n\nAplica estos conceptos directamente a tu proyecto de tipo **${context.businessType}** en la industria de **${context.industry}**.`,
      });
      if (template.sections?.[0]?.title) {
        content.push({
          type: 'callout',
          title: template.sections[0].title,
          content: template.summary || `Recuerda aplicar estos principios a ${context.name}.`,
        });
      }
    } else {
      content.push({
        type: 'text',
        content: `## ${topicTitle}\n\nEste tema es fundamental para el éxito de **${context.name}**. Aplica estos conceptos a tu proyecto de tipo **${context.businessType}**.`,
      });
    }
  }
  
  // Closing tip
  content.push({
    type: 'tip',
    title: 'Siguiente Paso',
    content: `Aplica lo aprendido en esta lección directamente a ${context.name}. La práctica es la mejor forma de interiorizar estos conceptos.`,
  });
  
  return content;
}

/**
 * Build project context from database
 */
async function buildProjectContext(projectId: string): Promise<ProjectContext> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      WizardAnswer: true,
      ViabilityScore: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
      TemplateMapping: true,
      BuildArtifact: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  
  const wizardAnswersMap: Record<string, any> = {};
  project.WizardAnswer.forEach(answer => {
    wizardAnswersMap[answer.key] = answer.value;
  });
  
  return {
    projectId,
    name: project.name,
    businessType: wizardAnswersMap.businessType || 'saas',
    businessModel: wizardAnswersMap.businessModel || 'subscription',
    industry: wizardAnswersMap.industry || 'general',
    targetAudience: wizardAnswersMap.targetAudience || 'general',
    monetization: wizardAnswersMap.monetizationModel || 'subscription',
    monetizationModel: wizardAnswersMap.monetizationModel || 'subscription',
    projectType: (wizardAnswersMap.businessType || 'saas').toLowerCase() as any,
    uniqueValue: wizardAnswersMap.differentiation || wizardAnswersMap.uniqueValue || 'Innovative solution',
    problemStatement: wizardAnswersMap.problemStatement || 'Problem to solve',
    solution: wizardAnswersMap.solution || 'Solution approach',
    templateType: project.TemplateMapping?.recommendedTemplate || 'SAAS_BASIC',
    techStack: extractTechStack(project.BuildArtifact[0]),
    evaluationScore: project.ViabilityScore[0]?.totalScore,
    wizardAnswers: wizardAnswersMap,
    buildMetadata: project.BuildArtifact[0]?.parameters as any,
  };
}

function extractTechStack(buildArtifact: any): string[] {
  if (!buildArtifact) return ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'];
  
  const params = buildArtifact.parameters as any;
  return params?.techStack || ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'];
}
