// ============================================================================
// LEVEL 1 SPANISH TEMPLATES - Entendiendo el Negocio
// ============================================================================
//
// Spanish translations for all Level 1 lesson templates across all 4 business
// types: SaaS, E-commerce, Marketplace, Generic.
// Each template generates 5-10 ContentBlock items covering:
//   introducción, explicaciones, ejemplos, consejos, advertencias, escenarios, puntos clave
// Placeholders: {PROJECT_NAME}, {BUSINESS_TYPE}, {ENTITY}, {TARGET_AUDIENCE}
// ============================================================================

import { ContentBlock } from '../courseTypes';
import { Level1LessonTemplate } from './level1SaasTemplates';

// ============================================================================
// SAAS SPANISH TEMPLATES
// ============================================================================

// ---------------------------------------------------------------------------
// Lección 1: ¿Qué problema resuelve este SaaS?
// ---------------------------------------------------------------------------

const saasProblemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Todo producto SaaS exitoso comienza con un problema claramente definido. Antes de escribir una sola línea de código para {PROJECT_NAME}, necesitas articular el punto de dolor exacto que enfrenta tu {TARGET_AUDIENCE} cada día. Una declaración de problema bien definida actúa como una brújula que guía las decisiones de producto, los mensajes de marketing y las prioridades de ingeniería. En esta lección aprenderás cómo identificar, validar y comunicar el problema central que tu producto {BUSINESS_TYPE} aborda. Exploraremos marcos de trabajo utilizados por fundadores líderes de SaaS, examinaremos ejemplos del mundo real y te daremos un proceso repetible para refinar tu declaración de problema hasta que resuene con clientes potenciales. Al final de esta lección podrás describir el problema en una oración, explicar por qué las soluciones existentes se quedan cortas y conectar el problema directamente con resultados de negocio medibles para tu {TARGET_AUDIENCE}. Comprender el problema en profundidad es el paso más importante para construir un producto por el que la gente realmente quiera pagar.',
  },
  {
    type: 'text',
    title: 'Por Qué Importa la Definición del Problema',
    content:
      'Muchos fundadores de SaaS primerizos saltan directamente a construir funcionalidades sin comprender completamente el problema que están resolviendo. Esto lleva a productos que son técnicamente impresionantes pero comercialmente irrelevantes. Cuando defines el problema claramente para {PROJECT_NAME}, creas alineación en todo tu equipo: los diseñadores saben qué flujos de trabajo simplificar, los ingenieros saben qué casos extremos importan más y los especialistas en marketing saben qué puntos de dolor destacar. Una definición de problema sólida también te ayuda a priorizar tu hoja de ruta. En lugar de perseguir cada solicitud de funcionalidad, puedes hacer una pregunta simple: "¿Esto nos acerca a resolver el problema central para {TARGET_AUDIENCE}?" Si la respuesta es no, va al backlog. Investigaciones de CB Insights muestran que el 35% de las startups fracasan porque no hay necesidad de mercado. Esa estadística por sí sola debería convencerte de invertir tiempo serio en el descubrimiento del problema antes de invertir dinero serio en desarrollo. El problema es tu fundamento; todo lo demás se construye sobre él.',
  },
  {
    type: 'text',
    title: 'Marcos de Trabajo para el Descubrimiento del Problema',
    content:
      'Existen varios marcos de trabajo probados que puedes usar para descubrir y articular el problema que {PROJECT_NAME} resuelve. El marco Jobs-to-be-Done pregunta: "¿Qué trabajo está contratando {TARGET_AUDIENCE} a tu producto para hacer?" Esto cambia el enfoque de las funcionalidades a los resultados. La técnica de los Cinco Porqués te ayuda a profundizar más allá de los síntomas superficiales para encontrar las causas raíz. Comienza con la queja obvia y pregunta "por qué" cinco veces hasta llegar al problema subyacente. Las entrevistas de Customer Development, popularizadas por Steve Blank, implican hablar con al menos 20 usuarios potenciales antes de construir nada. Durante estas conversaciones, escucha las frustraciones recurrentes, las soluciones improvisadas y el lenguaje que la gente usa para describir su dolor. Finalmente, el canvas de Problem-Solution Fit te permite mapear el problema, las alternativas existentes y tu enfoque único lado a lado. Cualquiera que sea el marco que elijas, el objetivo es el mismo: llegar a una declaración de problema que sea específica, medible y vinculada a un costo real — ya sea tiempo, dinero u oportunidad perdida para tu {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Descubrimiento del Problema en SaaS',
    content:
      'Imagina que estás construyendo {PROJECT_NAME}, un producto {BUSINESS_TYPE} para {TARGET_AUDIENCE}. Durante las entrevistas con clientes descubres que tus usuarios pasan un promedio de 5 horas por semana en un proceso manual que podría automatizarse. Eso son 260 horas al año por usuario — un punto de dolor claro y cuantificable. También descubres que las herramientas existentes solo resuelven parte del problema, obligando a los usuarios a alternar entre tres aplicaciones diferentes. Esta información se convierte en la base de tu propuesta de valor: "{PROJECT_NAME} elimina el cuello de botella semanal de 5 horas combinando los tres flujos de trabajo en un solo {ENTITY}." Observa cómo la declaración del problema incluye una métrica específica, una audiencia clara y una pista sobre la solución.',
  },
  {
    type: 'callout',
    title: 'Escenario: Cuando el Problema No Es Suficientemente Claro',
    content:
      'Considera un fundador que describe el problema como "las empresas necesitan mejor software." Esto es demasiado vago para guiar cualquier decisión. Compáralo con: "{TARGET_AUDIENCE} pierde el 20% de sus ingresos potenciales porque no puede rastrear el engagement de clientes a través de canales en tiempo real." La segunda versión es específica, medible y sugiere inmediatamente lo que {PROJECT_NAME} debería hacer. Si tu declaración de problema suena como el primer ejemplo, sigue iterando. Habla con más usuarios, recopila datos y estrecha tu enfoque hasta que el problema sea lo suficientemente agudo para destacar en un mercado {BUSINESS_TYPE} saturado.',
  },
  {
    type: 'tip',
    title: 'Valida Antes de Construir',
    content:
      'Antes de comprometerte con una declaración de problema para {PROJECT_NAME}, valídala con al menos 10 usuarios potenciales de tu {TARGET_AUDIENCE}. Haz preguntas abiertas como "¿Cuál es la parte más difícil de tu día?" y escucha los patrones. Si menos de 7 de cada 10 personas mencionan el mismo punto de dolor, tu problema puede no ser lo suficientemente extendido para sostener un negocio {BUSINESS_TYPE}.',
  },
  {
    type: 'warning',
    title: 'Evita el Sesgo de Solución',
    content:
      'Un error común es enamorarse de tu solución antes de entender el problema. Si te encuentras describiendo {PROJECT_NAME} en términos de funcionalidades en lugar de resultados, da un paso atrás y revisa tu declaración de problema. Las funcionalidades cambian; el problema central que enfrenta tu {TARGET_AUDIENCE} debería permanecer estable durante años.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, un problema bien definido es la base de todo producto {BUSINESS_TYPE} exitoso. Segundo, usa marcos como Jobs-to-be-Done y Customer Development para descubrir los verdaderos puntos de dolor de {TARGET_AUDIENCE}. Tercero, tu declaración de problema debe ser específica, medible y vinculada a un costo real. Cuarto, valida el problema con usuarios reales antes de invertir en el desarrollo de {PROJECT_NAME}. Quinto, revisa y refina tu declaración de problema a medida que aprendes más del mercado. Estos principios mantendrán a {PROJECT_NAME} enfocado en entregar valor genuino.',
  },
];


// ---------------------------------------------------------------------------
// Lección 2: ¿Quiénes son tus clientes objetivo?
// ---------------------------------------------------------------------------

const saasTargetCustomersBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Saber exactamente quiénes son tus clientes es la diferencia entre un producto {BUSINESS_TYPE} que crece y uno que se estanca. Para {PROJECT_NAME}, definir tus clientes objetivo significa ir más allá de la demografía para comprender comportamientos, motivaciones y disparadores de compra. En esta lección aprenderás cómo segmentar tu mercado, construir perfiles detallados de clientes y identificar a los adoptadores tempranos más propensos a pagar por tu {ENTITY}. Cubriremos métodos cuantitativos como el análisis TAM-SAM-SOM junto con técnicas cualitativas como el mapeo de empatía. También aprenderás cómo priorizar segmentos para que tus recursos limitados generen el máximo impacto. Al final de esta lección tendrás una imagen clara de quién es realmente {TARGET_AUDIENCE}, qué impulsa sus decisiones de compra y cómo llegar a ellos de manera eficiente. Esta claridad informará todo, desde tu estrategia de precios hasta tu flujo de onboarding.',
  },
  {
    type: 'text',
    title: 'Segmentación de Mercado para SaaS',
    content:
      'La segmentación de mercado divide a tus usuarios potenciales en grupos que comparten características comunes. Para un producto {BUSINESS_TYPE} como {PROJECT_NAME}, las dimensiones de segmentación más útiles son el tamaño de la empresa, el vertical de industria, el rol laboral y el stack tecnológico actual. Comienza de forma amplia y luego ve estrechando. Tu Mercado Total Direccionable (TAM) podría incluir a toda empresa que teóricamente podría usar tu producto. Tu Mercado Direccionable Alcanzable (SAM) reduce eso a las empresas que puedes alcanzar de manera realista con tu estrategia actual de go-to-market. Tu Mercado Obtenible Alcanzable (SOM) es la porción que puedes capturar en los próximos 12 a 18 meses. Para {PROJECT_NAME}, enfoca tus esfuerzos iniciales en el SOM — el segmento donde tu product-market fit es más fuerte y donde {TARGET_AUDIENCE} ya está buscando activamente soluciones. Intentar servir a todos a la vez es la forma más rápida de no servir bien a nadie.',
  },
  {
    type: 'text',
    title: 'Construyendo Perfiles de Cliente',
    content:
      'Un perfil de cliente es una representación semi-ficticia de tu usuario ideal basada en datos reales y suposiciones fundamentadas. Para {PROJECT_NAME}, crea dos o tres perfiles que representen segmentos distintos de {TARGET_AUDIENCE}. Cada perfil debe incluir un nombre, título laboral, tamaño de empresa, objetivos, frustraciones, canales de comunicación preferidos y autoridad de decisión. Ve más allá de los atributos superficiales: ¿qué le preocupa a esta persona el domingo por la noche antes de que comience la semana laboral? ¿Qué métricas está rastreando su jefe? ¿Qué la convertiría en una campeona de tu producto dentro de su organización? Las respuestas a estas preguntas darán forma a tu mensajería, prioridades de funcionalidades e incluso tu diseño de interfaz. Recuerda que los perfiles son documentos vivos — actualízalos a medida que recopilas más datos de usuarios reales de {PROJECT_NAME}. Un perfil que era preciso en el lanzamiento puede desviarse a medida que tu producto y mercado evolucionan.',
  },
  {
    type: 'callout',
    title: 'Ejemplo: Perfil de Cliente SaaS',
    content:
      'Conoce a "Olivia de Operaciones," una gerente de operaciones de nivel medio en una empresa de 50 personas. Pasa 3 horas diarias en reportes manuales y es evaluada por métricas de eficiencia del equipo. Tiene autoridad de presupuesto hasta $500 al mes y prefiere herramientas que se integren con su stack existente. Olivia representa un segmento clave de {TARGET_AUDIENCE} para {PROJECT_NAME}. Es lo suficientemente tech-savvy para adoptar nuevas herramientas pero no lo suficientemente técnica para construir su propia solución. Su punto de dolor se alinea perfectamente con lo que {PROJECT_NAME} ofrece, convirtiéndola en una adoptadora temprana ideal para tu producto {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: Elegir el Segmento Equivocado',
    content:
      'Un fundador de SaaS construyó una herramienta de gestión de proyectos dirigida a empresas con más de 10,000 empleados. El ciclo de ventas era de 9 meses, el producto requería personalización extensiva y el fundador se quedó sin capital antes de cerrar un solo acuerdo. Si hubiera comenzado con equipos pequeños de 5 a 20 personas — un segmento con ciclos de venta más cortos y necesidades más simples — podría haber iterado más rápido y generado ingresos antes. Para {PROJECT_NAME}, comienza con el segmento de {TARGET_AUDIENCE} que pueda decir "sí" más rápido y expande desde ahí.',
  },
  {
    type: 'tip',
    title: 'Comienza con los Adoptadores Tempranos',
    content:
      'Los adoptadores tempranos son usuarios que buscan activamente nuevas soluciones y toleran imperfecciones. Para {PROJECT_NAME}, busca miembros de {TARGET_AUDIENCE} que ya estén usando soluciones improvisadas como hojas de cálculo, procesos manuales o herramientas improvisadas. Estas personas sienten el dolor más intensamente y están dispuestas a probar un nuevo {ENTITY} incluso antes de que esté completamente pulido.',
  },
  {
    type: 'warning',
    title: 'No Intentes Llegar a Todos',
    content:
      'Decir que "{PROJECT_NAME} es para todos" es lo mismo que decir que no es para nadie. Un producto {BUSINESS_TYPE} que intenta servir a todos los segmentos simultáneamente termina con un conjunto de funcionalidades inflado, mensajería confusa y alta rotación de clientes. Elige uno o dos segmentos de {TARGET_AUDIENCE} y sírvelos excepcionalmente bien antes de expandir.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, segmenta tu mercado usando dimensiones relevantes para {BUSINESS_TYPE}: tamaño de empresa, industria, rol y stack tecnológico. Segundo, construye perfiles detallados basados en conversaciones reales con {TARGET_AUDIENCE}. Tercero, enfoca tu go-to-market inicial en el Mercado Obtenible Alcanzable donde {PROJECT_NAME} tiene el fit más fuerte. Cuarto, apunta a los adoptadores tempranos que ya están usando soluciones improvisadas. Quinto, resiste la tentación de servir a todos a la vez — la profundidad supera a la amplitud en las etapas tempranas de un negocio SaaS.',
  },
];

// ---------------------------------------------------------------------------
// Lección 3: ¿Qué hace única a tu solución?
// ---------------------------------------------------------------------------

const saasUniqueSolutionBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'En un mercado {BUSINESS_TYPE} saturado, tener un buen producto no es suficiente — necesitas un producto que destaque. Tu propuesta de valor única (UVP) es la razón por la que {TARGET_AUDIENCE} elegirá {PROJECT_NAME} sobre cada alternativa, incluyendo no hacer nada. En esta lección aprenderás cómo identificar tus ventajas competitivas, articularlas claramente e integrarlas en cada aspecto de tu producto y marketing. Examinaremos estrategias de diferenciación utilizadas por empresas SaaS exitosas, exploraremos marcos de posicionamiento y te ayudaremos a crear una UVP que resuene con tus clientes ideales. Al final de esta lección podrás explicar en una oración por qué {PROJECT_NAME} es la mejor opción para {TARGET_AUDIENCE}, y tendrás un marco para mantener esa diferenciación a medida que los competidores evolucionan. Tu UVP no es un eslogan — es una decisión estratégica que da forma a todo tu negocio.',
  },
  {
    type: 'text',
    title: 'Entendiendo la Diferenciación Competitiva',
    content:
      'La diferenciación en {BUSINESS_TYPE} puede provenir de muchas fuentes: tecnología, experiencia de usuario, precios, integraciones, soporte al cliente o experiencia en el dominio. Para {PROJECT_NAME}, comienza mapeando el panorama competitivo. Lista cada alternativa que {TARGET_AUDIENCE} usa actualmente — incluyendo hojas de cálculo, procesos manuales y productos SaaS competidores. Para cada alternativa, anota sus fortalezas y debilidades. Luego identifica las brechas: ¿dónde fallan las soluciones existentes? Estas brechas son tus oportunidades. La diferenciación no significa ser diferente en todo; significa ser significativamente mejor en las formas que más importan a tus clientes. Un producto SaaS que es 10% mejor en todo luchará contra uno que es 10 veces mejor en una dimensión crítica. Encuentra tu dimensión 10x y construye {PROJECT_NAME} alrededor de ella. Este enfoque concentrado también hace que tu mensaje de marketing sea más claro y tus conversaciones de venta más convincentes.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Encontrando Tu Ventaja 10x',
    content:
      'Considera cómo Slack se diferenció en el saturado mercado de mensajería. El email era el incumbente y existían docenas de herramientas de chat. Slack no intentó ser mejor en todo. En cambio, se enfocó en integraciones y búsqueda — dos puntos de dolor que las herramientas existentes manejaban mal. Para {PROJECT_NAME}, pregúntate: ¿cuál es la única cosa que {TARGET_AUDIENCE} más valora y que ningún competidor hace bien? Ahí es donde deberías concentrar tus recursos de ingeniería y diseño. Tu {ENTITY} debería ser la opción obvia para esa necesidad específica.',
  },
  {
    type: 'callout',
    title: 'Escenario: Posicionamiento Contra Competidores Establecidos',
    content:
      'Cuando {PROJECT_NAME} entra en un mercado con jugadores establecidos, evita competir en sus términos. Si el líder del mercado gana en funcionalidades, compite en simplicidad. Si gana en precio, compite en especialización. Posiciona {PROJECT_NAME} como la mejor solución para un subconjunto específico de {TARGET_AUDIENCE} en lugar de una herramienta de propósito general. Esta estrategia de "cuña" te permite construir una base de usuarios leales en un nicho antes de expandir. Recuerda, incluso Salesforce comenzó apuntando a equipos de ventas pequeños antes de convertirse en una plataforma empresarial.',
  },
  {
    type: 'text',
    title: 'Creando Tu Propuesta de Valor Única',
    content:
      'Una UVP sólida sigue una fórmula simple: "Para [cliente objetivo] que [tiene este problema], {PROJECT_NAME} es un [categoría] que [beneficio clave]. A diferencia de [competidores], {PROJECT_NAME} [diferenciador único]." Esta plantilla te obliga a ser específico sobre cada elemento. Complétala con datos reales de tu investigación de clientes. Pruébala con miembros de {TARGET_AUDIENCE} e itera hasta que funcione. Una buena UVP debe pasar la prueba del "¿y qué?" — si un cliente potencial la lee y se encoge de hombros, no es lo suficientemente específica. También debe pasar la prueba del "demuéstralo" — cada afirmación debe estar respaldada por evidencia, ya sea una métrica, un testimonio o una demostración del producto. Tu UVP aparecerá en tu página de inicio, en tus presentaciones de ventas y en cada conversación que tu equipo tenga con prospectos. Asegúrate de que sea aguda, honesta y memorable.',
  },
  {
    type: 'tip',
    title: 'Prueba Tu UVP con Usuarios Reales',
    content:
      'Muestra tu UVP a cinco miembros de {TARGET_AUDIENCE} y pídeles que la repitan con sus propias palabras. Si no pueden, es demasiado compleja. Si agregan detalles que no incluiste, esos detalles podrían pertenecer a tu UVP. Esta prueba simple no cuesta nada y puede ahorrar a {PROJECT_NAME} meses de mensajería desalineada.',
  },
  {
    type: 'warning',
    title: 'No Te Diferencies Solo por Precio',
    content:
      'Competir en precio en {BUSINESS_TYPE} es una carrera hacia el fondo. Siempre habrá una alternativa más barata o una opción gratuita de código abierto. En cambio, diferencia {PROJECT_NAME} por el valor entregado a {TARGET_AUDIENCE}. Si tu producto ahorra a los usuarios 10 horas por semana, el precio se convierte en una fracción del valor creado.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, la diferenciación se trata de ser significativamente mejor en las formas que más importan a {TARGET_AUDIENCE}. Segundo, mapea el panorama competitivo e identifica brechas que {PROJECT_NAME} pueda llenar. Tercero, encuentra tu ventaja 10x — la dimensión donde eres dramáticamente mejor que las alternativas. Cuarto, crea una UVP usando la fórmula y pruébala con usuarios reales. Quinto, evita competir solo en precio; compite en el valor único que tu {ENTITY} entrega. Estos principios ayudarán a {PROJECT_NAME} a destacar en un mercado {BUSINESS_TYPE} saturado.',
  },
];


// ---------------------------------------------------------------------------
// Lección 4: ¿Cómo ganarás dinero?
// ---------------------------------------------------------------------------

const saasMonetizationBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Los ingresos son el alma de cualquier negocio {BUSINESS_TYPE}. Para {PROJECT_NAME}, elegir la estrategia de monetización correcta es tan importante como construir el producto correcto. En esta lección explorarás los modelos de ingresos SaaS más comunes, aprenderás a calcular la economía unitaria y desarrollarás una estrategia de precios que se alinee con el valor que entregas a {TARGET_AUDIENCE}. Cubriremos niveles de suscripción, precios basados en uso, modelos freemium y enfoques híbridos. También aprenderás sobre las métricas financieras clave que todo fundador de SaaS debe rastrear, incluyendo los Ingresos Recurrentes Mensuales (MRR), el Costo de Adquisición de Cliente (CAC) y el Valor de Vida del Cliente (LTV). Al final de esta lección tendrás un plan de monetización claro para {PROJECT_NAME} que equilibre el crecimiento con la rentabilidad. Acertar con los precios desde el inicio puede acelerar tu camino hacia el product-market fit, mientras que equivocarte puede estancar incluso los mejores productos.',
  },
  {
    type: 'text',
    title: 'Modelos de Ingresos SaaS Explicados',
    content:
      'Los modelos de ingresos SaaS más comunes son basados en suscripción, basados en uso y freemium. Los precios por suscripción cobran una tarifa fija mensual o anual por acceso a tu {ENTITY}. Este modelo proporciona ingresos predecibles y es fácil de presupuestar para los clientes. Los precios basados en uso cobran según el consumo — llamadas API, almacenamiento, usuarios activos o transacciones. Este modelo alinea el costo con el valor pero puede hacer los ingresos menos predecibles. El modelo freemium ofrece un nivel gratuito con funcionalidad limitada y cobra por funciones premium. Este modelo reduce la barrera de entrada y puede impulsar el crecimiento viral, pero las tasas de conversión de gratuito a pago típicamente oscilan entre el 2% y el 5%. Para {PROJECT_NAME}, considera qué modelo se ajusta mejor a cómo {TARGET_AUDIENCE} obtiene valor de tu producto. Si el valor escala con el uso, los precios basados en uso tienen sentido. Si el valor es consistente independientemente del volumen, los precios por suscripción son más simples. Muchas empresas SaaS exitosas usan modelos híbridos que combinan elementos de los tres.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Niveles de Precios para SaaS',
    content:
      'Imagina que {PROJECT_NAME} ofrece tres niveles: Starter a $29 al mes para individuos, Professional a $79 al mes para equipos pequeños y Business a $199 al mes para empresas en crecimiento. Cada nivel desbloquea más funcionalidades y límites de uso más altos. El nivel Starter sirve como punto de entrada de bajo riesgo para {TARGET_AUDIENCE}, mientras que el nivel Business captura más valor de los usuarios avanzados. Esta estructura permite que {PROJECT_NAME} aumente los ingresos por cuenta con el tiempo a medida que los clientes se actualizan — un patrón conocido como ingresos de expansión, que es la forma más eficiente de crecimiento en {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: La Trampa del Freemium',
    content:
      'Un fundador de SaaS lanzó con un nivel gratuito generoso que incluía el 90% de la funcionalidad del producto. Los usuarios amaban la versión gratuita pero no tenían razón para actualizarse. La empresa adquirió 50,000 usuarios gratuitos pero solo 200 clientes de pago — una tasa de conversión del 0.4% que no podía sostener el negocio. Para {PROJECT_NAME}, diseña tu nivel gratuito cuidadosamente: debe demostrar valor a {TARGET_AUDIENCE} mientras crea un incentivo claro para actualizarse. El nivel gratuito es una herramienta de marketing, no el producto en sí.',
  },
  {
    type: 'text',
    title: 'Economía Unitaria: CAC, LTV y Período de Recuperación',
    content:
      'La economía unitaria determina si tu negocio {BUSINESS_TYPE} es financieramente viable. El Costo de Adquisición de Cliente (CAC) es el costo total de adquirir un cliente de pago, incluyendo gastos de marketing, ventas y onboarding. El Valor de Vida del Cliente (LTV) es el ingreso total que esperas de un cliente durante toda su relación con {PROJECT_NAME}. La relación LTV-a-CAC debe ser de al menos 3:1 para un negocio SaaS saludable — lo que significa que cada cliente genera tres veces más ingresos de lo que cuesta adquirirlo. El período de recuperación es cuánto tiempo toma recuperar el CAC de un solo cliente. Para la mayoría de las empresas SaaS, un período de recuperación menor a 12 meses se considera bueno. Rastrea estas métricas desde el día uno para {PROJECT_NAME}. Incluso estimaciones aproximadas te ayudarán a tomar mejores decisiones sobre dónde invertir tu presupuesto de marketing y qué tan agresivamente perseguir el crecimiento entre {TARGET_AUDIENCE}.',
  },
  {
    type: 'tip',
    title: 'Fija Precios Basados en Valor, No en Costo',
    content:
      'No establezcas precios para {PROJECT_NAME} basándote en lo que te cuesta entregar el {ENTITY}. En cambio, fija precios basados en el valor que {TARGET_AUDIENCE} recibe. Si tu producto ahorra a un cliente $1,000 al mes, cobrar $100 al mes es una ganga — y tienes margen para aumentar precios a medida que agregas más valor.',
  },
  {
    type: 'warning',
    title: 'No Cobres de Menos',
    content:
      'Muchos fundadores de SaaS fijan precios demasiado bajos por miedo a que {TARGET_AUDIENCE} no pague. Los precios bajos señalan bajo valor y atraen clientes sensibles al precio que abandonan rápidamente. Es más fácil bajar precios que subirlos. Comienza más alto de lo que crees correcto para {PROJECT_NAME} y ajusta basándote en datos de conversión.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, elige un modelo de ingresos que se alinee con cómo {TARGET_AUDIENCE} obtiene valor de {PROJECT_NAME}. Segundo, diseña niveles de precios que creen un camino claro de actualización. Tercero, si usas freemium, asegúrate de que el nivel gratuito demuestre valor sin regalar el producto central. Cuarto, rastrea la economía unitaria — LTV, CAC y período de recuperación — desde el día uno. Quinto, fija precios basados en el valor entregado, no en el costo incurrido. Estos principios de monetización ayudarán a {PROJECT_NAME} a construir un negocio {BUSINESS_TYPE} sostenible.',
  },
];

// ---------------------------------------------------------------------------
// Lección 5: ¿Cuáles son tus métricas clave?
// ---------------------------------------------------------------------------

const saasKeyMetricsBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Lo que se mide se gestiona. Para {PROJECT_NAME}, rastrear las métricas correctas es esencial para entender si tu negocio {BUSINESS_TYPE} está sano y creciendo. En esta lección aprenderás sobre los indicadores clave de rendimiento (KPIs) que todo fundador de SaaS debe monitorear, cómo configurar un panel de métricas y cómo usar datos para tomar mejores decisiones. Cubriremos métricas de ingresos como MRR y ARR, métricas de crecimiento como tasas de activación y retención, y métricas de eficiencia como el magic number y el burn multiple. También aprenderás cómo evitar métricas de vanidad — números que se ven impresionantes pero no se correlacionan con el éxito del negocio. Al final de esta lección tendrás un marco de métricas claro para {PROJECT_NAME} que te dirá exactamente cómo está funcionando tu producto con {TARGET_AUDIENCE} y dónde enfocar tus esfuerzos de mejora. La toma de decisiones basada en datos es lo que separa a las empresas SaaS que escalan de las que se estancan.',
  },
  {
    type: 'text',
    title: 'Métricas de Ingresos: MRR, ARR y Retención Neta de Ingresos',
    content:
      'Los Ingresos Recurrentes Mensuales (MRR) son la métrica más importante para cualquier negocio {BUSINESS_TYPE}. Representan los ingresos predecibles que {PROJECT_NAME} genera cada mes de suscripciones activas. Los Ingresos Recurrentes Anuales (ARR) son simplemente MRR multiplicado por 12 y son útiles para planificación a largo plazo. Pero el MRR bruto solo cuenta parte de la historia. La Retención Neta de Ingresos (NRR) mide cuántos ingresos retienes de clientes existentes después de contabilizar la rotación, las degradaciones y la expansión. Un NRR por encima del 100% significa que tu base de clientes existente está creciendo incluso sin nuevas adquisiciones — un indicador poderoso de product-market fit. Para {PROJECT_NAME}, rastrea el MRR desglosado en nuevos ingresos, ingresos de expansión, contracción y rotación. Esta descomposición revela si el crecimiento proviene de adquirir nuevos miembros de {TARGET_AUDIENCE} o de entregar más valor a los clientes existentes. Las empresas SaaS más saludables crecen de ambas fuentes simultáneamente.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: El Poder de la Retención Neta de Ingresos',
    content:
      'Considera dos empresas SaaS, ambas con $100K de MRR. La Empresa A tiene 120% de NRR — sus clientes existentes gastan 20% más cada año a través de actualizaciones y uso expandido. La Empresa B tiene 85% de NRR — pierde 15% de ingresos de clientes existentes cada mes. Después de 12 meses con adquisición de nuevos clientes idéntica, la Empresa A tiene $240K de MRR mientras que la Empresa B tiene solo $170K de MRR. Para {PROJECT_NAME}, enfócate en construir funcionalidades que aumenten el uso y el valor para {TARGET_AUDIENCE}, impulsando ingresos de expansión junto con la adquisición de nuevos clientes.',
  },
  {
    type: 'callout',
    title: 'Escenario: Métricas de Vanidad vs. Métricas Accionables',
    content:
      'Un fundador de SaaS reportó orgullosamente 100,000 usuarios registrados para su producto. Pero solo 5,000 estaban activos en los últimos 30 días, y solo 500 eran clientes de pago. El número de "usuarios registrados" era una métrica de vanidad que enmascaraba serios problemas de activación y conversión. Para {PROJECT_NAME}, enfócate en métricas que impulsen la acción: tasa de activación (qué porcentaje de registros de {TARGET_AUDIENCE} completan el onboarding), usuarios activos semanales (cuántas personas usan tu {ENTITY} regularmente) y tasa de conversión (qué porcentaje de usuarios gratuitos se convierten en clientes de pago).',
  },
  {
    type: 'text',
    title: 'Métricas de Crecimiento y Engagement',
    content:
      'Más allá de los ingresos, {PROJECT_NAME} necesita rastrear métricas que indiquen la salud del producto y el engagement de los usuarios. La tasa de activación mide el porcentaje de nuevos registros que alcanzan el momento "ajá" — el punto donde experimentan el valor central de tu {ENTITY}. Para la mayoría de los productos SaaS, esto sucede dentro de la primera sesión. Si tu tasa de activación está por debajo del 40%, tu onboarding necesita trabajo. Los Usuarios Activos Diarios (DAU) y los Usuarios Activos Semanales (WAU) miden la intensidad del engagement. La relación DAU/WAU, a veces llamada "stickiness," indica con qué frecuencia regresan los usuarios. Una relación por encima de 0.6 sugiere un fuerte engagement diario. La tasa de rotación mide el porcentaje de clientes que cancelan su suscripción cada mes. Para SaaS en etapa temprana dirigido a {TARGET_AUDIENCE}, una rotación mensual por debajo del 5% es aceptable, pero deberías apuntar a menos del 3% a medida que maduras. Cada una de estas métricas cuenta una parte diferente de la historia, y juntas te dan una imagen completa de cómo está funcionando {PROJECT_NAME}.',
  },
  {
    type: 'tip',
    title: 'Configura Tu Panel de Métricas Temprano',
    content:
      'No esperes hasta que {PROJECT_NAME} tenga miles de usuarios para comenzar a rastrear métricas. Configura un panel simple desde el día uno usando herramientas como PostHog, Mixpanel o incluso una hoja de cálculo. Rastrea MRR, tasa de activación y rotación semanalmente. Los datos tempranos — incluso de un número pequeño de miembros de {TARGET_AUDIENCE} — revelan patrones que informan decisiones críticas de producto.',
  },
  {
    type: 'warning',
    title: 'Cuidado con las Métricas de Vanidad',
    content:
      'Los registros totales, las vistas de página y los seguidores en redes sociales pueden hacer que {PROJECT_NAME} parezca exitoso sin indicar la salud real del negocio. Siempre acompaña las métricas de la parte superior del embudo con métricas posteriores como activación, retención e ingresos. Si los registros están creciendo pero la activación está estancada, tienes un problema de producto, no de marketing.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, MRR y NRR son las métricas de ingresos más importantes para {PROJECT_NAME} como negocio {BUSINESS_TYPE}. Segundo, rastrea la tasa de activación, el engagement y la rotación para entender la salud del producto. Tercero, descompón el MRR en ingresos nuevos, de expansión, de contracción y de rotación para una visión más profunda. Cuarto, evita las métricas de vanidad que se ven bien pero no impulsan decisiones. Quinto, configura un panel de métricas desde el día uno y revísalo semanalmente con tu equipo. Las decisiones basadas en datos ayudarán a {PROJECT_NAME} a crecer eficientemente y servir mejor a {TARGET_AUDIENCE} con el tiempo.',
  },
];


// ============================================================================
// E-COMMERCE SPANISH TEMPLATES
// ============================================================================

// ---------------------------------------------------------------------------
// Lección 1: ¿Qué problema resuelve este e-commerce?
// ---------------------------------------------------------------------------

const ecommerceProblemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Todo negocio de comercio electrónico exitoso comienza con un problema claramente definido. Antes de buscar un solo producto para {PROJECT_NAME}, necesitas articular el punto de dolor exacto que enfrenta tu {TARGET_AUDIENCE} al comprar {ENTITY} hoy. Una declaración de problema bien definida actúa como una brújula que guía la selección de productos, las decisiones de precios y la estrategia de marketing. En esta lección aprenderás cómo identificar, validar y comunicar el problema central que tu tienda {BUSINESS_TYPE} aborda. Exploraremos marcos de trabajo utilizados por fundadores líderes de e-commerce, examinaremos ejemplos del mundo real de marcas que revolucionaron sus categorías y te daremos un proceso repetible para refinar tu declaración de problema hasta que resuene con clientes potenciales. Al final de esta lección podrás describir el problema en una oración, explicar por qué las opciones de compra existentes se quedan cortas y conectar el problema directamente con resultados medibles como tasa de conversión, valor promedio de pedido y valor de vida del cliente para tu {TARGET_AUDIENCE}. Comprender el problema en profundidad es el paso más importante para construir una tienda online donde la gente realmente quiera comprar.',
  },
  {
    type: 'text',
    title: 'Por Qué Importa la Definición del Problema en E-commerce',
    content:
      'Muchos fundadores de e-commerce primerizos saltan directamente a listar productos sin comprender completamente el problema que están resolviendo. Esto lleva a tiendas que tienen inventario que nadie quiere y marketing que no convierte visitantes en compradores. Cuando defines el problema claramente para {PROJECT_NAME}, creas alineación en toda tu operación: los compradores saben qué productos buscar, los diseñadores saben qué experiencia de compra crear y los especialistas en marketing saben qué puntos de dolor destacar en anuncios y campañas de email. Una definición de problema sólida también te ayuda a priorizar tu catálogo y evitar la trampa de convertirte en una tienda genérica de todo. En lugar de agregar cada producto que encuentres, puedes hacer una pregunta simple: "¿Este producto ayuda a resolver el problema central para {TARGET_AUDIENCE}?" Si la respuesta es no, no pertenece a tu tienda. Las investigaciones muestran que las tiendas de e-commerce de nicho con un enfoque claro en el problema logran tasas de conversión 2-3 veces más altas que las tiendas generales que intentan competir con Amazon en amplitud. La tasa de abandono de carrito promedia el 70% en e-commerce — una declaración de problema clara te ayuda a construir la confianza y urgencia necesarias para que los clientes completen su compra.',
  },
  {
    type: 'text',
    title: 'Marcos para el Descubrimiento del Problema en E-commerce',
    content:
      'Existen varios marcos probados que puedes usar para descubrir y articular el problema que {PROJECT_NAME} resuelve. El marco de Mapeo del Viaje del Cliente pregunta: "¿Dónde experimenta {TARGET_AUDIENCE} fricción al intentar comprar {ENTITY}?" Esto cambia el enfoque de los productos a la experiencia de compra. La técnica de los Cinco Porqués te ayuda a profundizar más allá de las quejas superficiales para encontrar las causas raíz. Comienza con la frustración obvia — quizás "no puedo encontrar el producto correcto" — y pregunta "por qué" cinco veces hasta llegar al problema subyacente, que podría ser una mala curación de productos o falta de guía experta. Las entrevistas con clientes, adaptadas de la metodología de Steve Blank, implican hablar con al menos 20 compradores potenciales antes de almacenar cualquier inventario. Durante estas conversaciones, escucha atentamente las frustraciones recurrentes con las tiendas existentes, las soluciones creativas que la gente usa y el lenguaje específico que emplean para describir sus puntos de dolor al comprar. Finalmente, el análisis de brechas competitivas te permite mapear lo que las tiendas de e-commerce existentes ofrecen versus lo que los clientes realmente necesitan y quieren. Cualquiera que sea el marco que elijas, el objetivo es el mismo: llegar a una declaración de problema que sea específica, medible y vinculada a un costo real para tu {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Descubrimiento del Problema en E-commerce',
    content:
      'Imagina que estás construyendo {PROJECT_NAME}, una tienda {BUSINESS_TYPE} para {TARGET_AUDIENCE}. Durante las entrevistas con clientes descubres que tus compradores potenciales pasan un promedio de 45 minutos comparando productos en múltiples sitios web antes de hacer una compra, y el 30% de ellos abandona el proceso por completo porque no pueden determinar qué {ENTITY} es adecuado para sus necesidades. Ese es un punto de dolor claro y cuantificable. También descubres que las tiendas existentes ofrecen miles de opciones pero ninguna guía, obligando a los clientes a depender de reseñas poco confiables. Esta información se convierte en la base de tu propuesta de valor: "{PROJECT_NAME} elimina el dolor de cabeza de la comparación de 45 minutos al curar los mejores {ENTITY} y proporcionar guías de compra expertas para {TARGET_AUDIENCE}."',
  },
  {
    type: 'callout',
    title: 'Escenario: Cuando el Problema No Es Suficientemente Claro',
    content:
      'Considera un fundador que describe el problema como "la gente necesita comprar cosas online." Esto es demasiado vago para guiar cualquier decisión. Compáralo con: "{TARGET_AUDIENCE} desperdicia un promedio de $200 al año en {ENTITY} que no cumple sus expectativas porque las descripciones de productos son engañosas y los procesos de devolución son dolorosos." La segunda versión es específica, medible y sugiere inmediatamente lo que {PROJECT_NAME} debería hacer — proporcionar información precisa del producto, reseñas honestas y devoluciones sin complicaciones. Si tu declaración de problema suena como el primer ejemplo, sigue iterando. Habla con más clientes potenciales, recopila datos sobre abandono de carrito y tasas de devolución, y estrecha tu enfoque hasta que el problema sea lo suficientemente agudo para diferenciar tu tienda en un mercado {BUSINESS_TYPE} saturado.',
  },
  {
    type: 'tip',
    title: 'Valida con Pre-órdenes o Landing Pages',
    content:
      'Antes de comprometerte con inventario para {PROJECT_NAME}, valida tu declaración de problema con al menos 10 clientes potenciales de tu {TARGET_AUDIENCE}. Crea una landing page simple describiendo el problema y tu solución propuesta, luego mide el interés a través de registros de email o pre-órdenes. Si menos del 5% de los visitantes toman acción, tu problema puede no ser lo suficientemente convincente para sostener un negocio {BUSINESS_TYPE}.',
  },
  {
    type: 'warning',
    title: 'Evita el Pensamiento Centrado en el Producto',
    content:
      'Un error común en e-commerce es enamorarse de un producto antes de entender el problema que resuelve. Si te encuentras describiendo {PROJECT_NAME} en términos de características y especificaciones del producto en lugar de resultados para el cliente, da un paso atrás y revisa tu declaración de problema. Los productos cambian con las tendencias y temporadas; el problema central que enfrenta tu {TARGET_AUDIENCE} al comprar {ENTITY} debería permanecer estable.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, un problema bien definido es la base de toda tienda {BUSINESS_TYPE} exitosa y guía todas las decisiones posteriores. Segundo, usa marcos como el Mapeo del Viaje del Cliente y el análisis de brechas competitivas para descubrir los verdaderos puntos de dolor de compra de {TARGET_AUDIENCE}. Tercero, tu declaración de problema debe ser específica, medible y vinculada a un costo real como dinero desperdiciado, tiempo o frustración. Cuarto, valida el problema con clientes potenciales reales antes de invertir en inventario para {PROJECT_NAME}. Quinto, revisa y refina tu declaración de problema a medida que aprendes más de los datos de pedidos, tasas de devolución y retroalimentación de clientes. Estos principios mantendrán a {PROJECT_NAME} enfocado en entregar valor genuino a los compradores.',
  },
];

// ---------------------------------------------------------------------------
// Lección 2: ¿Quiénes son tus clientes objetivo?
// ---------------------------------------------------------------------------

const ecommerceTargetCustomersBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Saber exactamente quiénes son tus clientes es la diferencia entre una tienda {BUSINESS_TYPE} que prospera y una que pierde dinero en inventario sin vender. Para {PROJECT_NAME}, definir tus clientes objetivo significa ir más allá de la demografía básica para comprender comportamientos de compra, motivaciones de compra y los disparadores que convierten navegadores en compradores. En esta lección aprenderás cómo segmentar tu mercado, construir perfiles detallados de compradores e identificar a los adoptadores tempranos más propensos a realizar su primer pedido de tu {ENTITY}. Cubriremos métodos cuantitativos como el dimensionamiento de mercado y el análisis de valor promedio de pedido junto con técnicas cualitativas como el mapeo de empatía y la escucha social. También aprenderás cómo priorizar segmentos para que tu presupuesto de marketing limitado genere el máximo retorno sobre la inversión publicitaria. Al final de esta lección tendrás una imagen clara de quién es realmente {TARGET_AUDIENCE}, qué impulsa sus decisiones de compra y cómo llegar a ellos a través de los canales correctos.',
  },
  {
    type: 'text',
    title: 'Segmentación de Mercado para E-commerce',
    content:
      'La segmentación de mercado divide a tus compradores potenciales en grupos que comparten características comunes relevantes para su comportamiento y preferencias de compra. Para una tienda {BUSINESS_TYPE} como {PROJECT_NAME}, las dimensiones de segmentación más útiles son la frecuencia de compra, el valor promedio de pedido, la preferencia de canal de compra, la ubicación geográfica y la afinidad por categoría de producto. Comienza de forma amplia y luego estrecha sistemáticamente usando datos disponibles. Tu Mercado Total Direccionable (TAM) podría incluir a todos los que compran {ENTITY} online globalmente. Tu Mercado Direccionable Alcanzable (SAM) reduce eso a compradores que puedes alcanzar de manera realista con tus canales de marketing actuales, capacidades de fulfillment y zonas de envío. Tu Mercado Obtenible Alcanzable (SOM) es la porción que puedes capturar de manera realista en los próximos 12 a 18 meses. Para {PROJECT_NAME}, enfoca tus esfuerzos iniciales en el SOM — el segmento donde tu selección de productos es más fuerte y donde {TARGET_AUDIENCE} ya está buscando activamente mejores opciones. Intentar servir a todo tipo de comprador online a la vez es la forma más rápida de diluir tu marca y agotar tu presupuesto de marketing en tráfico de baja conversión.',
  },
  {
    type: 'text',
    title: 'Construyendo Perfiles de Comprador para E-commerce',
    content:
      'Un perfil de comprador es una representación semi-ficticia de tu cliente ideal basada en datos reales y suposiciones fundamentadas sobre su comportamiento de compra y motivaciones de compra. Para {PROJECT_NAME}, crea dos o tres perfiles que representen segmentos distintos de {TARGET_AUDIENCE}. Cada perfil debe incluir un nombre, rango de edad, nivel de ingresos, hábitos de compra, dispositivos preferidos, plataformas sociales favoritas y disparadores de decisión de compra. Ve más allá de los atributos superficiales: ¿qué busca esta persona antes de comprar {ENTITY}? ¿Compara precios en múltiples tiendas o compra impulsivamente cuando ve algo que le gusta? ¿Se deja influenciar por reseñas, recomendaciones de influencers o lealtad a la marca? ¿Qué la haría elegir {PROJECT_NAME} sobre Amazon o un competidor directo? ¿Cómo se siente respecto a pagar por envío express versus esperar el envío estándar gratuito? Las respuestas a estas preguntas darán forma a tus descripciones de producto, estilo de fotografía, segmentación de anuncios, secuencias de email marketing e incluso tus políticas de envío y devolución. Recuerda que los perfiles son documentos vivos — actualízalos trimestralmente a medida que recopilas más datos de pedidos reales e interacciones de soporte al cliente.',
  },
  {
    type: 'callout',
    title: 'Ejemplo: Perfil de Comprador de E-commerce',
    content:
      'Conoce a "Sara la Inteligente," una profesional de 32 años que compra principalmente desde el móvil durante su trayecto al trabajo. Gasta un promedio de $150 por pedido y valora el envío rápido sobre el precio más bajo. Lee de 3 a 5 reseñas antes de comprar y confía más en las fotos generadas por usuarios que en las fotos de estudio. Sara descubre nuevos productos a través de Instagram y TikTok pero completa las compras en el sitio web de la marca. Representa un segmento clave de {TARGET_AUDIENCE} para {PROJECT_NAME}. Está dispuesta a pagar un premium por selecciones curadas y una experiencia de checkout móvil fluida. Su punto de dolor se alinea perfectamente con lo que {PROJECT_NAME} ofrece, convirtiéndola en una adoptadora temprana ideal para tu tienda {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: Elegir el Segmento de Cliente Equivocado',
    content:
      'Un fundador de e-commerce lanzó una tienda premium de utensilios de cocina dirigida a chefs profesionales. Los productos eran de alta calidad pero el valor promedio de pedido necesitaba ser de $300 para cubrir los costos de fulfillment. Los chefs profesionales, sin embargo, compran a través de distribuidores mayoristas a precios 40% más bajos. El fundador se quedó sin capital antes de alcanzar la rentabilidad. Si hubiera apuntado a entusiastas de la cocina casera — un segmento dispuesto a pagar precios minoristas y con mayor frecuencia de compra — podría haber construido ingresos sostenibles antes. Para {PROJECT_NAME}, comienza con el segmento de {TARGET_AUDIENCE} que tiene la mayor disposición a pagar precios minoristas y el camino más corto hacia la primera compra.',
  },
  {
    type: 'tip',
    title: 'Usa Datos de Compra para Refinar Perfiles',
    content:
      'Una vez que {PROJECT_NAME} comience a recibir pedidos, usa datos de compra reales para refinar tus perfiles. Rastrea qué productos compra {TARGET_AUDIENCE} juntos, a qué hora del día compran, qué canales de marketing generan el mayor valor promedio de pedido y cómo se ve su tasa de recompra. Herramientas como Google Analytics, las analíticas de Shopify o los reportes integrados de tu plataforma pueden revelar patrones que las entrevistas solas no pueden.',
  },
  {
    type: 'warning',
    title: 'No Intentes Llegar a Todos',
    content:
      'Decir que "{PROJECT_NAME} es para todos los que compran online" es lo mismo que decir que no es para nadie. Una tienda {BUSINESS_TYPE} que intenta servir a todos los segmentos de clientes simultáneamente termina con un catálogo inflado, marketing genérico y altas tasas de devolución. Elige uno o dos segmentos de {TARGET_AUDIENCE} y sírvelos excepcionalmente bien antes de expandir tu gama de productos y audiencia.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, segmenta tu mercado usando dimensiones relevantes para {BUSINESS_TYPE}: frecuencia de compra, valor promedio de pedido, canal de compra y afinidad de producto. Segundo, construye perfiles detallados de compradores basados en conversaciones reales y datos de comportamiento de {TARGET_AUDIENCE}. Tercero, enfoca tu inversión de marketing inicial en el Mercado Obtenible Alcanzable donde {PROJECT_NAME} tiene el product-market fit más fuerte y el mayor potencial de conversión. Cuarto, apunta a los adoptadores tempranos que ya están frustrados con las opciones de compra existentes para {ENTITY}. Quinto, resiste la tentación de servir a todos a la vez — un catálogo enfocado con experiencia profunda supera a un catálogo amplio con conocimiento superficial en las etapas tempranas de un negocio de e-commerce.',
  },
];


// ---------------------------------------------------------------------------
// Lección 3: ¿Qué hace única a tu solución?
// ---------------------------------------------------------------------------

const ecommerceUniqueSolutionBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'En un mercado {BUSINESS_TYPE} saturado donde los clientes pueden encontrar casi cualquier cosa en Amazon, tener buenos productos no es suficiente — necesitas una tienda que destaque. Tu propuesta de valor única (UVP) es la razón por la que {TARGET_AUDIENCE} elegirá {PROJECT_NAME} sobre cada alternativa, incluyendo gigantes de marketplace y competidores directos al consumidor. En esta lección aprenderás cómo identificar tus ventajas competitivas, articularlas claramente e integrarlas en cada aspecto de tu tienda — desde las páginas de producto hasta el empaque. Examinaremos estrategias de diferenciación utilizadas por marcas de e-commerce exitosas, exploraremos marcos de posicionamiento y te ayudaremos a crear una UVP que resuene con tus compradores ideales. Al final de esta lección podrás explicar en una oración por qué {PROJECT_NAME} es el mejor lugar para comprar {ENTITY}, y tendrás un marco para mantener esa diferenciación a medida que los competidores copien tus ideas. Tu UVP no es un eslogan — es una decisión estratégica que da forma a todo tu negocio, desde el sourcing hasta el fulfillment y el servicio al cliente.',
  },
  {
    type: 'text',
    title: 'Entendiendo la Diferenciación Competitiva en E-commerce',
    content:
      'La diferenciación en {BUSINESS_TYPE} puede provenir de muchas fuentes: curación de productos, storytelling de marca, experiencia del cliente, velocidad de envío, políticas de devolución, productos exclusivos o experiencia profunda en un nicho. Para {PROJECT_NAME}, comienza mapeando el panorama competitivo. Lista cada alternativa que tu {TARGET_AUDIENCE} usa actualmente para comprar {ENTITY} — incluyendo Amazon, minoristas especializados, marcas directas al consumidor, boutiques locales e incluso tiendas físicas. Para cada alternativa, anota sus fortalezas y debilidades desde la perspectiva del cliente. Luego identifica las brechas: ¿dónde fallan las opciones existentes? Quizás Amazon tiene todo pero sin curación ni guía experta. Quizás las tiendas especializadas tienen experiencia pero malas experiencias online y envío lento. Quizás las marcas directas al consumidor tienen gran branding pero selección limitada. Estas brechas son tus oportunidades para crear una posición diferenciada. La diferenciación no significa ser diferente en todo; significa ser significativamente mejor en las formas que más importan a tus clientes. Una tienda de e-commerce que es 10% mejor en todo luchará contra una que es 10 veces mejor en una dimensión crítica. Encuentra tu dimensión 10x y construye {PROJECT_NAME} alrededor de ella.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Encontrando Tu Ventaja 10x',
    content:
      'Considera cómo Warby Parker se diferenció en el saturado mercado de gafas. Comprar gafas online era arriesgado porque los clientes no podían probárselas. Warby Parker introdujo un programa gratuito de prueba en casa que eliminó el riesgo por completo. No intentaron superar a LensCrafters en selección ni a Zenni en precio. En cambio, se enfocaron en un punto de fricción crítico y lo resolvieron brillantemente. Para {PROJECT_NAME}, pregúntate: ¿cuál es la única cosa que {TARGET_AUDIENCE} más valora al comprar {ENTITY} que ningún competidor hace bien? Ahí es donde deberías concentrar tu inversión en experiencia de producto, empaque y servicio al cliente.',
  },
  {
    type: 'callout',
    title: 'Escenario: Posicionamiento Contra Amazon y Gigantes del Marketplace',
    content:
      'Cuando {PROJECT_NAME} entra en un mercado donde Amazon domina, evita competir en sus términos. Nunca superarás a Amazon en selección, precio o velocidad de envío. En cambio, compite en lo que Amazon no puede ofrecer: curación experta, historia de marca, comunidad, recomendaciones personalizadas o una experiencia de unboxing premium. Posiciona {PROJECT_NAME} como el mejor destino para un subconjunto específico de {TARGET_AUDIENCE} que valora la calidad y la experiencia sobre la conveniencia y el precio más bajo. Esta estrategia de "cuña" te permite construir una base de clientes leales en un nicho antes de expandir. Recuerda, incluso Dollar Shave Club comenzó apuntando a hombres frustrados con las cuchillas de afeitar caras antes de convertirse en una marca de mil millones de dólares.',
  },
  {
    type: 'text',
    title: 'Creando Tu Propuesta de Valor Única',
    content:
      'Una UVP sólida sigue una fórmula simple: "Para [cliente objetivo] que [tiene esta frustración de compra], {PROJECT_NAME} es una tienda [categoría] que [beneficio clave]. A diferencia de [competidores], {PROJECT_NAME} [diferenciador único]." Esta plantilla te obliga a ser específico sobre cada elemento. Complétala con datos reales de tu investigación de clientes y análisis competitivo. Pruébala con miembros de {TARGET_AUDIENCE} e itera hasta que funcione. Una buena UVP debe pasar la prueba del "¿y qué?" — si un cliente potencial la lee y se encoge de hombros, no es lo suficientemente específica. También debe pasar la prueba del "demuéstralo" — cada afirmación debe estar respaldada por evidencia, ya sea una garantía de producto, testimonios de clientes o una historia de sourcing única. Tu UVP aparecerá en la sección hero de tu página de inicio, en tu copy publicitario, en los insertos de empaque, en tu serie de emails de bienvenida y en cada punto de contacto con el cliente. Asegúrate de que sea aguda, honesta y memorable. En e-commerce, la confianza lo es todo — una UVP que promete de más y entrega de menos destruirá tu marca más rápido que cualquier competidor.',
  },
  {
    type: 'tip',
    title: 'Prueba Tu UVP con Copy Publicitario',
    content:
      'Ejecuta dos pequeñas campañas publicitarias en Facebook o Google para {PROJECT_NAME}: una destacando tu UVP y otra con un mensaje genérico de producto. Compara las tasas de clics y el costo por adquisición. Si la versión con UVP supera a la otra, has encontrado un mensaje que resuena con {TARGET_AUDIENCE}. Si no, itera en tu posicionamiento antes de escalar tu inversión en marketing.',
  },
  {
    type: 'warning',
    title: 'No Te Diferencies Solo por Precio',
    content:
      'Competir en precio en {BUSINESS_TYPE} es una carrera hacia el fondo. Amazon, Walmart y Temu siempre te superarán en precio. En cambio, diferencia {PROJECT_NAME} por el valor entregado a {TARGET_AUDIENCE}. Si tu selección curada ahorra a los clientes horas de investigación y tu garantía de calidad elimina el riesgo de comprar el {ENTITY} equivocado, el precio se convierte en una fracción del valor creado. Los clientes que compran solo por precio son los primeros en irse cuando aparece una opción más barata.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, la diferenciación se trata de ser significativamente mejor en las formas que más importan a {TARGET_AUDIENCE} cuando compran {ENTITY}. Segundo, mapea el panorama competitivo incluyendo Amazon e identifica brechas que {PROJECT_NAME} pueda llenar. Tercero, encuentra tu ventaja 10x — la dimensión donde eres dramáticamente mejor que las alternativas, ya sea curación, experiencia o expertise. Cuarto, crea una UVP usando la fórmula y pruébala con campañas publicitarias reales. Quinto, evita competir solo en precio; compite en el valor único y la confianza que tu tienda {BUSINESS_TYPE} entrega. Estos principios ayudarán a {PROJECT_NAME} a destacar en un mercado dominado por gigantes.',
  },
];

// ---------------------------------------------------------------------------
// Lección 4: ¿Cómo ganarás dinero?
// ---------------------------------------------------------------------------

const ecommerceMonetizationBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Los ingresos son el alma de cualquier negocio {BUSINESS_TYPE}, pero en e-commerce, los ingresos sin márgenes saludables son un camino rápido al fracaso. Para {PROJECT_NAME}, elegir la estrategia de monetización correcta significa entender no solo cómo generar ventas, sino cómo generar ventas rentables después de contabilizar costos de producto, envío, devoluciones y adquisición de clientes. En esta lección explorarás los modelos de ingresos de e-commerce más comunes, aprenderás a calcular la economía unitaria por pedido y desarrollarás una estrategia de precios que se alinee con el valor que entregas a {TARGET_AUDIENCE}. Cubriremos ventas directas de productos, cajas de suscripción, estrategias de bundling y fuentes de ingresos auxiliares. También aprenderás sobre las métricas financieras clave que todo fundador de e-commerce debe rastrear, incluyendo el Valor Promedio de Pedido (AOV), el Costo de Adquisición de Cliente (CAC), el Valor de Vida del Cliente (CLV) y el margen bruto por pedido. Al final de esta lección tendrás un plan de monetización claro para {PROJECT_NAME} que equilibre el crecimiento con la rentabilidad.',
  },
  {
    type: 'text',
    title: 'Modelos de Ingresos de E-commerce Explicados',
    content:
      'Los modelos de ingresos de e-commerce más comunes son ventas directas de productos, comercio por suscripción y comisiones de marketplace. Las ventas directas de productos son el modelo más simple y común: compras o fabricas {ENTITY} a costo mayorista y vendes con margen minorista a los consumidores. Los márgenes brutos típicos van del 30% al 70% dependiendo de la categoría, con márgenes más altos en productos especializados y de marca y márgenes más bajos en productos commoditizados. El comercio por suscripción cobra a los clientes una tarifa recurrente por entregas regulares — piensa en Dollar Shave Club para cuchillas o Stitch Fix para ropa. Este modelo proporciona ingresos predecibles y un valor de vida del cliente significativamente mayor pero requiere una planificación cuidadosa del inventario, bajas tasas de cancelación y una categoría de producto donde la reposición regular o el descubrimiento tenga sentido. Las estrategias de bundling aumentan el valor promedio de pedido empaquetando productos complementarios juntos con un ligero descuento. Para {PROJECT_NAME}, considera qué modelo se ajusta mejor a cómo {TARGET_AUDIENCE} compra {ENTITY}. Si los clientes necesitan reposición regular, las suscripciones tienen sentido. Si las compras son únicas o infrecuentes, enfócate en maximizar el AOV a través de bundles, upsells y cross-sells en el checkout.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Estrategia de Precios para E-commerce',
    content:
      'Imagina que {PROJECT_NAME} vende {ENTITY} curados con tres niveles de precios: un bundle Starter a $39 para compradores primerizos, un bundle Popular a $79 que incluye los artículos más vendidos, y un bundle Premium a $149 con productos exclusivos y envío express gratuito. El bundle Starter sirve como punto de entrada de bajo riesgo para {TARGET_AUDIENCE}, mientras que el bundle Premium captura más valor de los entusiastas. También ofreces una suscripción mensual a $59 que entrega selecciones curadas con un 15% de descuento versus el precio único. Esta estructura permite que {PROJECT_NAME} aumente los ingresos por cliente con el tiempo a través de compras repetidas y actualizaciones de suscripción — un patrón conocido como aumento del valor de vida del cliente, que es la forma más eficiente de crecimiento en {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: La Trampa del Envío Gratuito',
    content:
      'Un fundador de e-commerce ofreció envío gratuito en todos los pedidos para competir con Amazon Prime. El valor promedio de pedido era de $35, pero el envío costaba $8 por pedido, consumiendo márgenes ya delgados. La tienda procesaba 5,000 pedidos al mes pero perdía $2 por pedido después de todos los costos. Eso son $10,000 al mes en pérdidas disfrazadas de crecimiento de ingresos. Para {PROJECT_NAME}, establece un umbral de envío gratuito que incentive pedidos más grandes — por ejemplo, envío gratuito en pedidos superiores a $75. Esto incentiva a {TARGET_AUDIENCE} a agregar más {ENTITY} a su carrito, aumentando el AOV mientras proteges tus márgenes. El umbral de envío gratuito es una de las palancas de conversión y rentabilidad más poderosas en e-commerce.',
  },
  {
    type: 'text',
    title: 'Economía Unitaria: CAC, CLV y Margen Bruto',
    content:
      'La economía unitaria determina si tu negocio {BUSINESS_TYPE} es financieramente viable por pedido y por cliente. El Costo de Adquisición de Cliente (CAC) es el costo total de adquirir un cliente de pago, incluyendo inversión publicitaria, tarifas de influencers, descuentos promocionales y cualquier muestra gratuita u oferta de prueba que proporciones. El Valor de Vida del Cliente (CLV) es el ingreso total que esperas de un cliente durante toda su relación con {PROJECT_NAME}, contabilizando compras repetidas, frecuencia promedio de pedido y vida útil típica del cliente. La relación CLV-a-CAC debe ser de al menos 3:1 para un negocio de e-commerce saludable. El margen bruto por pedido es el ingreso menos el costo de los bienes vendidos, costos de envío, materiales de empaque y tarifas de procesamiento de pago. Para la mayoría de los negocios de e-commerce, un margen bruto por encima del 40% es necesario para cubrir gastos operativos como almacenamiento, servicio al cliente, herramientas de software y overhead de marketing mientras se genera ganancia. Rastrea estas métricas desde tu primer pedido en {PROJECT_NAME}.',
  },
  {
    type: 'tip',
    title: 'Fija Precios Basados en Valor Percibido, No en Costo-Plus',
    content:
      'No establezcas precios para {PROJECT_NAME} simplemente agregando un margen fijo a tu costo mayorista. En cambio, fija precios basados en el valor percibido que {TARGET_AUDIENCE} recibe. Si tu selección curada ahorra a los clientes horas de investigación y tu garantía de calidad elimina el riesgo de comprar el {ENTITY} equivocado, puedes cobrar un premium. Prueba diferentes puntos de precio con pequeñas campañas publicitarias y mide la tasa de conversión y el AOV para encontrar el punto óptimo.',
  },
  {
    type: 'warning',
    title: 'No Ignores los Costos Ocultos',
    content:
      'Muchos fundadores de e-commerce calculan márgenes basándose solo en el costo del producto y el precio de venta, olvidando el envío, empaque, tarifas de procesamiento de pago (típicamente 2.9% más $0.30 por transacción), devoluciones (promediando 20-30% en algunas categorías) y costos de servicio al cliente. Para {PROJECT_NAME}, construye un modelo de costos completo que incluya cada gasto entre el sourcing de {ENTITY} y su entrega a {TARGET_AUDIENCE}. Un producto que parece rentable en papel puede perder dinero cuando se incluyen todos los costos.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, elige un modelo de ingresos que se alinee con cómo {TARGET_AUDIENCE} compra {ENTITY} — ventas directas, suscripciones o bundles. Segundo, diseña niveles de precios y bundles que creen un camino claro hacia un mayor valor promedio de pedido en cada transacción. Tercero, usa umbrales de envío gratuito estratégicamente para aumentar el AOV mientras proteges tus márgenes de ganancia. Cuarto, rastrea la economía unitaria — CLV, CAC y margen bruto por pedido — desde tu primera venta en {PROJECT_NAME}. Quinto, fija precios basados en el valor percibido entregado al cliente, no en margen costo-plus. Estos principios de monetización ayudarán a {PROJECT_NAME} a construir un negocio {BUSINESS_TYPE} sostenible y rentable a largo plazo.',
  },
];

// ---------------------------------------------------------------------------
// Lección 5: ¿Cuáles son tus métricas clave?
// ---------------------------------------------------------------------------

const ecommerceKeyMetricsBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Lo que se mide se gestiona, y en e-commerce la diferencia entre una tienda próspera y una que fracasa a menudo se reduce a qué métricas observa el fundador. Para {PROJECT_NAME}, rastrear las métricas correctas es esencial para entender si tu negocio {BUSINESS_TYPE} está sano, creciendo y siendo rentable. En esta lección aprenderás sobre los indicadores clave de rendimiento (KPIs) que todo fundador de e-commerce debe monitorear, cómo configurar un panel de métricas y cómo usar datos para tomar mejores decisiones sobre inventario, marketing y experiencia del cliente. Cubriremos métricas de ingresos como el Valor Promedio de Pedido e ingresos por visitante, métricas de conversión como la tasa de abandono de carrito y la tasa de completación de checkout, y métricas de cliente como la tasa de recompra y el valor de vida del cliente. También aprenderás cómo evitar métricas de vanidad — números que se ven impresionantes pero no se correlacionan con la rentabilidad. Al final de esta lección tendrás un marco de métricas claro para {PROJECT_NAME} que te dirá exactamente cómo está funcionando tu tienda con {TARGET_AUDIENCE} y dónde enfocar tus esfuerzos de mejora.',
  },
  {
    type: 'text',
    title: 'Métricas de Ingresos y Conversión',
    content:
      'El Valor Promedio de Pedido (AOV) es una de las métricas más importantes para cualquier negocio {BUSINESS_TYPE}. Representa la cantidad promedio que un cliente gasta por transacción en {PROJECT_NAME}. Aumentar el AOV incluso un 10% puede mejorar dramáticamente la rentabilidad sin adquirir un solo cliente nuevo, convirtiéndolo en una de las optimizaciones de mayor apalancamiento disponibles. Rastrea el AOV junto con la tasa de conversión — el porcentaje de visitantes del sitio web que completan una compra. Las tasas de conversión promedio de la industria para e-commerce van del 1% al 4%, pero las tiendas de alto rendimiento con fuerte product-market fit y flujos de checkout optimizados logran el 5% o más. Los ingresos por visitante (RPV) combinan ambas métricas en un solo número poderoso: RPV es igual a AOV multiplicado por la tasa de conversión. Esta es la métrica más útil para comparar la efectividad de diferentes fuentes de tráfico y campañas de marketing. La tasa de abandono de carrito mide el porcentaje de compradores que agregan {ENTITY} a su carrito pero se van sin completar el checkout. El promedio global es aproximadamente 70%. Para {PROJECT_NAME}, reducir el abandono de carrito incluso 5 puntos porcentuales puede aumentar los ingresos un 15-20% sin inversión publicitaria adicional.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: El Poder de la Optimización del AOV',
    content:
      'Considera dos tiendas de e-commerce, ambas con 10,000 visitantes mensuales y una tasa de conversión del 3% — 300 pedidos al mes. La Tienda A tiene un AOV de $50, generando $15,000 en ingresos mensuales. La Tienda B tiene un AOV de $75 gracias al bundling estratégico y un umbral de envío gratuito en $70. La Tienda B genera $22,500 al mes — 50% más ingresos del mismo tráfico. Para {PROJECT_NAME}, enfócate en aumentar el AOV a través de bundles de productos, recomendaciones de "frecuentemente comprados juntos" y umbrales de envío gratuito. Estas tácticas no cuestan casi nada de implementar pero pueden transformar la economía de tu {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: Métricas de Vanidad vs. Métricas Accionables',
    content:
      'Un fundador de e-commerce reportó orgullosamente 500,000 visitantes mensuales al sitio web y 50,000 seguidores en Instagram. Pero la tasa de conversión era del 0.5%, el valor promedio de pedido era de $25 y la tasa de devolución era del 35%. Los números impresionantes de tráfico enmascaraban serios problemas de product-market fit y experiencia del cliente. Para {PROJECT_NAME}, enfócate en métricas que impulsen la rentabilidad: tasa de conversión (qué porcentaje de visitantes de {TARGET_AUDIENCE} realmente compran), AOV (cuánto gastan por pedido), tasa de devolución (cuántos pedidos regresan) y tasa de recompra (cuántos clientes compran de nuevo dentro de 90 días). Estas cuatro métricas te dicen más sobre la salud del negocio que cualquier cantidad de tráfico o seguidores en redes sociales.',
  },
  {
    type: 'text',
    title: 'Métricas de Cliente y Fulfillment',
    content:
      'Más allá de los ingresos y la conversión, {PROJECT_NAME} necesita rastrear métricas que indiquen la satisfacción del cliente y la eficiencia operativa. La tasa de recompra mide el porcentaje de clientes que realizan un segundo pedido — para la mayoría de los negocios de e-commerce, lograr que un cliente compre dos veces es el punto de inflexión para la rentabilidad ya que el segundo pedido tiene cero costo de adquisición y demuestra que el cliente confía en tu marca. El Valor de Vida del Cliente (CLV) proyecta los ingresos totales de un cliente durante toda su relación con tu tienda, factorizando el valor promedio de pedido, la frecuencia de compra y la vida útil esperada del cliente. Un negocio de e-commerce saludable tiene una relación CLV-a-CAC de al menos 3:1. En el lado operativo, rastrea el tiempo de fulfillment de pedidos — qué tan rápido se recogen, empaquetan y envían los pedidos después de la compra. Los clientes esperan cada vez más tiempos de procesamiento de 1-2 días, y los retrasos impactan directamente las reseñas, las compras repetidas y las referencias de boca en boca. La tasa de devolución mide el porcentaje de pedidos que se devuelven, y las altas tasas de devolución en ciertas categorías de productos pueden destruir los márgenes incluso cuando las ventas de primera línea se ven fuertes.',
  },
  {
    type: 'tip',
    title: 'Configura Tu Panel de E-commerce Temprano',
    content:
      'No esperes hasta que {PROJECT_NAME} tenga miles de pedidos para comenzar a rastrear métricas. Configura un panel desde el día uno usando las analíticas de tu plataforma de e-commerce, Google Analytics y una hoja de cálculo simple. Rastrea AOV, tasa de conversión, abandono de carrito y tasa de recompra semanalmente. Los datos tempranos — incluso de un número pequeño de pedidos de {TARGET_AUDIENCE} — revelan patrones que informan decisiones críticas sobre inventario, precios e inversión en marketing.',
  },
  {
    type: 'warning',
    title: 'Cuidado con los Ingresos Sin Ganancia',
    content:
      'Los ingresos totales y el conteo de pedidos pueden hacer que {PROJECT_NAME} parezca exitoso sin indicar la salud real del negocio. Siempre acompaña los ingresos de primera línea con margen bruto, tasa de devolución y CAC. Si los ingresos están creciendo pero el margen bruto se está reduciendo por descuentos y envío gratuito, estás comprando crecimiento a expensas de la sostenibilidad. Una tienda que hace $50,000 al mes con 50% de margen bruto es más saludable que una que hace $100,000 con 15% de margen bruto.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, AOV y tasa de conversión son las métricas de ingresos más importantes para {PROJECT_NAME} como negocio {BUSINESS_TYPE} — pequeñas mejoras en cualquiera tienen un impacto desproporcionado en los ingresos. Segundo, rastrea la tasa de abandono de carrito y trabaja incansablemente para reducirla por debajo del 60%. Tercero, monitorea la tasa de recompra y el CLV para entender el valor del cliente a largo plazo más allá del primer pedido. Cuarto, evita las métricas de vanidad como tráfico y seguidores que se ven bien pero no impulsan la rentabilidad. Quinto, configura un panel de métricas desde el día uno y revísalo semanalmente. Las decisiones basadas en datos sobre inventario, precios y marketing ayudarán a {PROJECT_NAME} a crecer eficientemente y servir mejor a {TARGET_AUDIENCE} con el tiempo.',
  },
];


// ============================================================================
// MARKETPLACE SPANISH TEMPLATES
// ============================================================================

// ---------------------------------------------------------------------------
// Lección 1: ¿Qué problema resuelve este marketplace?
// ---------------------------------------------------------------------------

const marketplaceProblemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Todo marketplace exitoso comienza con un problema claramente definido que afecta a ambos lados del mercado. Antes de construir una sola funcionalidad para {PROJECT_NAME}, necesitas articular el punto de dolor exacto que enfrenta tu {TARGET_AUDIENCE} al intentar encontrar, comparar y realizar transacciones de {ENTITY} hoy. Una declaración de problema bien definida actúa como una brújula que guía las decisiones de plataforma, las políticas de confianza y seguridad, y las estrategias de crecimiento tanto para compradores como para vendedores. En esta lección aprenderás cómo identificar, validar y comunicar el problema central que tu plataforma {BUSINESS_TYPE} aborda. Exploraremos marcos de trabajo utilizados por fundadores líderes de marketplaces, examinaremos ejemplos del mundo real de plataformas como Airbnb, Uber y Etsy, y te daremos un proceso repetible para refinar tu declaración de problema hasta que resuene con ambos lados de tu mercado bilateral. Al final de esta lección podrás describir el problema en una oración, explicar por qué las soluciones existentes fallan en conectar oferta y demanda eficientemente, y conectar el problema directamente con resultados medibles como liquidez, volumen de transacciones y Valor Bruto de Mercancía para tu {TARGET_AUDIENCE}.',
  },
  {
    type: 'text',
    title: 'Por Qué Importa la Definición del Problema en Marketplaces',
    content:
      'Muchos fundadores de marketplaces primerizos saltan directamente a construir funcionalidades de plataforma sin comprender completamente la fricción que están eliminando del proceso de transacción. Esto lleva a plataformas que son técnicamente funcionales pero no logran alcanzar la liquidez necesaria para sostener un mercado bilateral. Cuando defines el problema claramente para {PROJECT_NAME}, creas alineación en todo tu equipo: los diseñadores de producto saben qué flujos simplificar para compradores y vendedores, los ingenieros saben qué funcionalidades de confianza y seguridad importan más, y los equipos de crecimiento saben qué lado del mercado priorizar primero. Una definición de problema sólida también te ayuda a resolver el clásico dilema del huevo y la gallina — ¿deberías atraer oferta o demanda primero? La respuesta depende de qué lado siente el dolor más intensamente y cuál tiene menos alternativas existentes. Investigaciones de expertos en marketplaces muestran que más del 60% de las startups de marketplace fracasan porque no pueden alcanzar liquidez suficiente en su mercado objetivo. Esa estadística por sí sola debería convencerte de invertir tiempo serio en el descubrimiento del problema antes de invertir dinero serio en el desarrollo de la plataforma. El problema es tu fundamento; tus algoritmos de matching, sistemas de pago, mecanismos de reseñas y procesos de resolución de disputas se construyen sobre él.',
  },
  {
    type: 'text',
    title: 'Marcos para el Descubrimiento del Problema en Marketplaces',
    content:
      'Existen varios marcos probados que puedes usar para descubrir y articular el problema que {PROJECT_NAME} resuelve. El marco de Análisis de Dolor Bilateral pregunta: "¿Qué fricción experimenta {TARGET_AUDIENCE} en el lado de compra, y qué fricción experimentan los proveedores en el lado de venta?" Esto asegura que entiendas ambas perspectivas. El enfoque de Teoría de Costos de Transacción examina los costos de encontrar, evaluar y completar una transacción sin tu plataforma — incluyendo costos de búsqueda, costos de verificación, costos de negociación y costos de cumplimiento. Si {PROJECT_NAME} puede reducir dramáticamente estos costos, tienes una propuesta de valor convincente. Las entrevistas de Customer Development deben incluir al menos 15 compradores potenciales y 15 vendedores potenciales. Durante estas conversaciones, escucha las frustraciones recurrentes con los canales existentes, las soluciones creativas que la gente usa para encontrarse y el lenguaje específico que usan para describir su dolor. El Canvas de Marketplace, adaptado del Business Model Canvas, te permite mapear las características de la oferta, las características de la demanda, la transacción que se facilita y tu enfoque único para el matching y la confianza. El objetivo es llegar a una declaración de problema que sea específica, medible y vinculada a un costo real para tu {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Descubrimiento del Problema en Marketplace',
    content:
      'Imagina que estás construyendo {PROJECT_NAME}, una plataforma {BUSINESS_TYPE} para {TARGET_AUDIENCE}. Durante las entrevistas con compradores potenciales descubres que pasan un promedio de 3 horas buscando en canales fragmentados para encontrar el {ENTITY} correcto, y el 40% abandona sin completar una transacción porque no pueden verificar la calidad o confiar en el vendedor. En el lado de la oferta, los vendedores te dicen que pasan el 30% de su tiempo en tareas administrativas en lugar de entregar su servicio principal. Esta información se convierte en la base de tu propuesta de valor: "{PROJECT_NAME} elimina la búsqueda de 3 horas y la brecha de confianza al curar proveedores verificados de {ENTITY} y habilitar transacciones seguras para {TARGET_AUDIENCE}." Observa cómo la declaración del problema incluye métricas específicas, aborda ambos lados del mercado y sugiere la solución de plataforma.',
  },
  {
    type: 'callout',
    title: 'Escenario: Cuando el Problema No Es Suficientemente Claro',
    content:
      'Considera un fundador que describe el problema como "la gente necesita un lugar para comprar y vender cosas." Esto es demasiado vago para guiar cualquier decisión y describe cada marketplace jamás construido. Compáralo con: "{TARGET_AUDIENCE} pierde un promedio del 15% del valor potencial de transacción por intermediarios ineficientes porque no existe una plataforma transparente y verificada para {ENTITY} en su mercado local." La segunda versión es específica, medible y sugiere inmediatamente lo que {PROJECT_NAME} debería hacer — proporcionar transparencia, construir mecanismos de confianza y reducir costos de intermediarios. Si tu declaración de problema suena como el primer ejemplo, sigue iterando. Habla con más usuarios en ambos lados del mercado, recopila datos sobre la fricción de transacciones y estrecha tu enfoque hasta que el problema justifique construir una plataforma {BUSINESS_TYPE} dedicada.',
  },
  {
    type: 'tip',
    title: 'Valida Ambos Lados del Mercado',
    content:
      'Antes de comprometerte con una declaración de problema para {PROJECT_NAME}, valídala con al menos 10 compradores potenciales y 10 vendedores potenciales de tu {TARGET_AUDIENCE}. Un marketplace solo funciona si ambos lados sienten el dolor. Si los compradores están desesperados pero los vendedores son indiferentes, o viceversa, tu plataforma luchará por alcanzar la liquidez necesaria para sostener un negocio {BUSINESS_TYPE}. Los problemas de marketplace más fuertes son aquellos donde ambos lados buscan activamente una mejor forma de transaccionar.',
  },
  {
    type: 'warning',
    title: 'Evita Construir una Solución Buscando un Problema',
    content:
      'Un error común es enamorarse de la tecnología de marketplace — algoritmos de matching, sistemas de pago, motores de reseñas — antes de entender la fricción de transacción que estás eliminando. Si te encuentras describiendo {PROJECT_NAME} en términos de funcionalidades de plataforma en lugar de los resultados de transacción que habilita para {TARGET_AUDIENCE}, da un paso atrás y revisa tu declaración de problema. La tecnología es un habilitador; el problema central de conectar oferta y demanda para {ENTITY} debería permanecer estable durante años.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, un problema bien definido es la base de toda plataforma {BUSINESS_TYPE} exitosa y debe abordar la fricción en ambos lados del mercado. Segundo, usa marcos como el Análisis de Dolor Bilateral y la Teoría de Costos de Transacción para descubrir los verdaderos puntos de dolor de {TARGET_AUDIENCE}. Tercero, tu declaración de problema debe ser específica, medible y vinculada a un costo real como tiempo de búsqueda, tarifas de intermediarios o brechas de confianza. Cuarto, valida el problema con usuarios reales en ambos lados antes de invertir en el desarrollo de la plataforma para {PROJECT_NAME}. Quinto, revisa y refina tu declaración de problema a medida que aprendes más de los datos de transacciones y la retroalimentación de usuarios. Estos principios mantendrán a {PROJECT_NAME} enfocado en entregar valor genuino a su comunidad de marketplace.',
  },
];

// ---------------------------------------------------------------------------
// Lección 2: ¿Quiénes son tus clientes objetivo?
// ---------------------------------------------------------------------------

const marketplaceTargetCustomersBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'En un marketplace, conocer a tus clientes significa entender dos grupos distintos: los compradores que crean demanda y los vendedores que proporcionan oferta. Para {PROJECT_NAME}, definir tus clientes objetivo en ambos lados es la diferencia entre una plataforma {BUSINESS_TYPE} que alcanza liquidez y una que permanece como un escaparate vacío. En esta lección aprenderás cómo segmentar ambos lados de tu mercado, construir perfiles detallados para compradores y vendedores, e identificar a los adoptadores tempranos más propensos a transaccionar en tu plataforma de {ENTITY}. Cubriremos métodos cuantitativos como el dimensionamiento de mercado y el análisis de efectos de red junto con técnicas cualitativas como el mapeo de empatía para cada lado del mercado. También aprenderás cómo priorizar qué lado atraer primero para resolver el problema del huevo y la gallina que mata a la mayoría de las startups de marketplace. Al final de esta lección tendrás una imagen clara de quién es {TARGET_AUDIENCE} realmente en ambos lados, qué impulsa sus decisiones de participación y cómo llegar a ellos eficientemente.',
  },
  {
    type: 'text',
    title: 'Segmentación de Mercado Bilateral',
    content:
      'La segmentación de mercado en un marketplace es fundamentalmente diferente de los negocios de un solo lado porque debes segmentar tanto la oferta como la demanda de forma independiente y luego entender cómo interactúan los segmentos. Para una plataforma {BUSINESS_TYPE} como {PROJECT_NAME}, segmenta tu lado de demanda por frecuencia de compra, valor de transacción, urgencia de necesidad y disposición a pagar un premium por calidad o conveniencia. Segmenta tu lado de oferta por capacidad de volumen, nivel de calidad, estrategia de precios y confiabilidad. Tu Mercado Total Direccionable (TAM) incluye a cada comprador y vendedor potencial de {ENTITY} en tu geografía o vertical objetivo. Tu Mercado Direccionable Alcanzable (SAM) reduce eso a participantes que puedes atraer de manera realista con tus capacidades actuales de plataforma y estrategia de go-to-market. Tu Mercado Obtenible Alcanzable (SOM) es la porción que puedes capturar en los próximos 12 a 18 meses. Para {PROJECT_NAME}, enfoca tus esfuerzos iniciales en el SOM — la intersección donde la demanda del comprador es más fuerte y la oferta del vendedor es más confiable. Este enfoque concentrado crea un bolsillo denso de liquidez que genera experiencias de transacción positivas, que a su vez atraen más participantes a través del boca a boca y los efectos de red.',
  },
  {
    type: 'text',
    title: 'Construyendo Perfiles para Ambos Lados',
    content:
      'Un marketplace requiere perfiles separados para cada lado del mercado, y cada perfil debe reflejar las motivaciones y restricciones únicas de ese lado. Para {PROJECT_NAME}, crea dos o tres perfiles de comprador y dos o tres perfiles de vendedor que representen segmentos distintos de {TARGET_AUDIENCE}. Los perfiles de comprador deben incluir frecuencia de transacción, gasto promedio, expectativas de calidad, requisitos de confianza y métodos de descubrimiento preferidos. Los perfiles de vendedor deben incluir volumen de inventario, flexibilidad de precios, estándares de calidad de servicio, nivel de comodidad tecnológica y ambiciones de crecimiento. Ve más allá de los atributos superficiales: ¿qué hace que un comprador elija tu plataforma sobre buscar independientemente? ¿Qué hace que un vendedor esté dispuesto a pagar tu comisión en lugar de encontrar clientes directamente? Para los compradores, entiende su proceso de toma de decisiones. Para los vendedores, entiende su economía — cuál es su estructura de costos, cuánto tiempo pasan en adquisición de clientes hoy y qué comisión aceptarían a cambio de demanda confiable. Las respuestas a estas preguntas darán forma a tus algoritmos de matching, sistemas de reseñas, políticas de precios y procesos de resolución de disputas.',
  },
  {
    type: 'callout',
    title: 'Ejemplo: Perfiles de Comprador y Vendedor de Marketplace',
    content:
      'Conoce a "Benito el Ocupado," un profesional que valora la conveniencia sobre el precio. Busca {ENTITY} en el móvil, lee las 3 mejores reseñas y reserva en 5 minutos. Está dispuesto a pagar un 20% de premium por calidad verificada y confirmación instantánea. En el lado de la oferta, conoce a "Paula la Profesional," una vendedora a tiempo completo que lista 15-20 {ENTITY} al mes y depende de las plataformas de marketplace para el 70% de sus ingresos. Valora el flujo constante de demanda, la resolución justa de disputas y las herramientas que reducen su overhead administrativo. Juntos, Benito y Paula representan el par de transacción ideal para {PROJECT_NAME} — demanda de alta intención encontrando oferta confiable y de calidad.',
  },
  {
    type: 'callout',
    title: 'Escenario: Resolviendo el Problema del Huevo y la Gallina',
    content:
      'Un fundador de marketplace lanzó una plataforma para diseñadores freelance pero enfocó todo el marketing en atraer compradores primero. Sin diseñadores en la plataforma, los compradores encontraron resultados de búsqueda vacíos y nunca regresaron. El fundador luego pivotó a atraer diseñadores, pero sin demanda de compradores, los diseñadores no vieron razón para crear perfiles. La plataforma murió en el desierto de liquidez entre oferta y demanda. Para {PROJECT_NAME}, resuelve el problema del huevo y la gallina comenzando con el lado más difícil de atraer — típicamente la oferta. Ofrece a los vendedores tempranos listados gratuitos, comisiones reducidas o ganancias mínimas garantizadas. Una vez que tengas oferta de calidad, los compradores vendrán. Airbnb famosamente comenzó fotografiando personalmente los primeros listados para asegurar que la oferta de calidad atrajera demanda.',
  },
  {
    type: 'tip',
    title: 'Comienza con un Mercado Restringido',
    content:
      'En lugar de lanzar {PROJECT_NAME} a nivel nacional o global, comienza en una sola ciudad, vecindario o nicho vertical donde puedas alcanzar alta liquidez rápidamente. Uber comenzó en San Francisco, Airbnb comenzó con colchones inflables durante conferencias y Etsy comenzó con artesanías hechas a mano. Un mercado restringido te permite incorporar personalmente a {TARGET_AUDIENCE} en ambos lados, asegurar transacciones de calidad y construir la confianza que alimenta el crecimiento orgánico a través de efectos de red.',
  },
  {
    type: 'warning',
    title: 'No Ignores el Lado de la Oferta',
    content:
      'Muchos fundadores de marketplace se obsesionan con la adquisición de compradores porque se siente más como marketing tradicional. Pero en una plataforma {BUSINESS_TYPE}, la calidad de la oferta determina todo. Si {PROJECT_NAME} atrae miles de compradores pero los listados de {ENTITY} son de baja calidad, poco confiables o escasos, los compradores tendrán malas experiencias y nunca regresarán. Invierte al menos tanto esfuerzo en la incorporación de vendedores, estándares de calidad y herramientas del lado de la oferta como en la generación de demanda para {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, segmenta ambos lados de tu mercado de forma independiente — compradores por comportamiento de compra y vendedores por características de oferta y confiabilidad. Segundo, construye perfiles separados para compradores y vendedores basados en conversaciones reales con {TARGET_AUDIENCE}. Tercero, enfoca tu lanzamiento inicial en un mercado restringido donde {PROJECT_NAME} pueda alcanzar alta liquidez rápidamente e iterar en la experiencia de transacción. Cuarto, resuelve el problema del huevo y la gallina subsidiando el lado más difícil de atraer primero, típicamente la oferta. Quinto, invierte igualmente en calidad de oferta y generación de demanda — un marketplace es tan bueno como su peor transacción. Estos principios ayudarán a {PROJECT_NAME} a construir los efectos de red que hacen defensibles a las plataformas {BUSINESS_TYPE} con el tiempo.',
  },
];


// ---------------------------------------------------------------------------
// Lección 3: ¿Qué hace única a tu solución?
// ---------------------------------------------------------------------------

const marketplaceUniqueSolutionBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'En un panorama {BUSINESS_TYPE} saturado donde plataformas como Airbnb, Uber y Etsy dominan sus categorías, tener un marketplace funcional no es suficiente — necesitas una plataforma que destaque. Tu propuesta de valor única (UVP) es la razón por la que {TARGET_AUDIENCE} elegirá {PROJECT_NAME} sobre cada alternativa, incluyendo plataformas existentes, transacciones directas e intermediarios tradicionales. En esta lección aprenderás cómo identificar tus ventajas competitivas, articularlas claramente e integrarlas en cada aspecto de la experiencia de tu plataforma. Examinaremos estrategias de diferenciación utilizadas por empresas de marketplace exitosas, exploraremos marcos de posicionamiento específicos para mercados bilaterales y te ayudaremos a crear una UVP que resuene tanto con compradores como con vendedores. Al final de esta lección podrás explicar en una oración por qué {PROJECT_NAME} es la mejor plataforma para transacciones de {ENTITY}, y tendrás un marco para mantener esa diferenciación a medida que surjan competidores. Tu UVP no es un eslogan — es una decisión estratégica que da forma a tu lógica de matching, mecanismos de confianza y toda la experiencia de transacción para ambos lados del mercado.',
  },
  {
    type: 'text',
    title: 'Entendiendo la Diferenciación Competitiva en Marketplaces',
    content:
      'La diferenciación en una plataforma {BUSINESS_TYPE} puede provenir de muchas fuentes: algoritmos de matching superiores, mecanismos de confianza y seguridad más fuertes, mejor curación de oferta, menor fricción de transacción, enfoque vertical especializado o efectos de red únicos. Para {PROJECT_NAME}, comienza mapeando el panorama competitivo. Lista cada alternativa que tu {TARGET_AUDIENCE} usa actualmente para encontrar y transaccionar {ENTITY} — incluyendo marketplaces establecidos, anuncios clasificados, grupos de redes sociales, referencias de boca en boca e intermediarios tradicionales como agentes o brokers. Para cada alternativa, anota sus fortalezas y debilidades desde la perspectiva tanto del comprador como del vendedor. Luego identifica las brechas: ¿dónde fallan las plataformas existentes en crear confianza, reducir fricción o entregar valor? Quizás las plataformas existentes tienen amplia selección pero pobre control de calidad. Quizás cobran altas comisiones pero proporcionan herramientas mínimas para vendedores. Estas brechas son tus oportunidades. La diferenciación en marketplaces no significa ser diferente en todo; significa ser significativamente mejor en las formas que más importan a ambos lados de tu mercado. Encuentra tu dimensión 10x y construye {PROJECT_NAME} alrededor de ella.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Encontrando Tu Ventaja 10x',
    content:
      'Considera cómo Airbnb se diferenció en el saturado mercado de alquiler a corto plazo. Craigslist tenía listados pero no confianza. Los hoteles tenían confianza pero no variedad ni experiencia local. Airbnb se enfocó en la confianza — fotografía profesional, perfiles verificados, pagos seguros y un sistema de reseñas que responsabilizaba tanto a anfitriones como a huéspedes. Esta capa de confianza transformó a desconocidos en socios de transacción dispuestos. Para {PROJECT_NAME}, pregúntate: ¿cuál es la única cosa que impide a {TARGET_AUDIENCE} transaccionar {ENTITY} hoy? Si es confianza, construye el mejor sistema de verificación. Si es descubrimiento, construye el mejor algoritmo de matching. Si es complejidad de transacción, construye el flujo de checkout más simple.',
  },
  {
    type: 'callout',
    title: 'Escenario: Posicionamiento Contra Gigantes del Marketplace',
    content:
      'Cuando {PROJECT_NAME} entra en un mercado con plataformas establecidas, evita competir en sus términos. Nunca superarás a un marketplace horizontal en amplitud de selección ni a un competidor bien financiado en inversión de marketing. En cambio, compite en profundidad vertical, mecanismos de confianza especializados o experiencia superior para un nicho específico. Posiciona {PROJECT_NAME} como la mejor plataforma para un subconjunto específico de {TARGET_AUDIENCE} en lugar de un marketplace de propósito general. Etsy tuvo éxito contra eBay enfocándose exclusivamente en artículos hechos a mano y vintage. Fiverr tuvo éxito contra Upwork simplificando la transacción freelance en gigs de precio fijo. Esta estrategia de "cuña" te permite construir liquidez densa en un nicho antes de expandir.',
  },
  {
    type: 'text',
    title: 'Creando Tu Propuesta de Valor de Marketplace',
    content:
      'Una UVP sólida de marketplace debe abordar ambos lados del mercado porque cada lado necesita una razón distinta y convincente para participar en tu plataforma. Usa esta fórmula: "Para [compradores] que [tienen esta fricción de transacción], y [vendedores] que [tienen este problema de distribución], {PROJECT_NAME} es una plataforma {BUSINESS_TYPE} que [beneficio clave]. A diferencia de [competidores], {PROJECT_NAME} [diferenciador único]." Esta plantilla te obliga a ser específico sobre el valor que creas para cada lado. Complétala con datos reales de tu investigación de clientes en ambos lados. Pruébala por separado con compradores y vendedores de {TARGET_AUDIENCE} e itera hasta que ambos lados vean valor claro. Una buena UVP de marketplace debe pasar la prueba de "¿por qué no hacerlo directamente?" — si compradores y vendedores pueden transaccionar fácilmente sin tu plataforma, tu propuesta de valor no es lo suficientemente fuerte. También debe pasar la prueba de "¿por qué no usar al incumbente?" — cada afirmación debe destacar una ventaja específica sobre las alternativas existentes para transacciones de {ENTITY}. Tu UVP aparecerá en tus landing pages para compradores y vendedores, en tus flujos de onboarding y en cada comunicación con {TARGET_AUDIENCE}.',
  },
  {
    type: 'tip',
    title: 'Prueba Tu UVP con Ambos Lados por Separado',
    content:
      'Muestra tu UVP a cinco compradores potenciales y cinco vendedores potenciales de {TARGET_AUDIENCE} y pide a cada grupo que explique por qué usaría {PROJECT_NAME}. Si los compradores no pueden articular el beneficio de encontrar {ENTITY} en tu plataforma, o si los vendedores no pueden explicar por qué listarían ahí en lugar de encontrar clientes directamente, tu propuesta de valor necesita trabajo. Las UVPs de marketplace más fuertes hacen que ambos lados sientan que están obteniendo un mejor trato que cualquier alternativa.',
  },
  {
    type: 'warning',
    title: 'No Te Diferencies Solo por Comisiones Bajas',
    content:
      'Competir en comisión en una plataforma {BUSINESS_TYPE} es una carrera hacia el fondo. Un competidor siempre puede cobrar menos, y una plataforma sin comisión financiada por capital de riesgo puede superarte por completo. En cambio, diferencia {PROJECT_NAME} por el valor de cada transacción — mejores matches, mayor confianza, completación más rápida, menos disputas. Si tu plataforma ayuda a los vendedores a ganar 30% más por transacción a través de mejor matching con {TARGET_AUDIENCE}, una comisión razonable se convierte en un precio pequeño a pagar por resultados dramáticamente mejores.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, la diferenciación de marketplace debe abordar ambos lados del mercado — compradores y vendedores necesitan razones distintas para elegir {PROJECT_NAME}. Segundo, mapea el panorama competitivo incluyendo plataformas establecidas, transacciones directas e intermediarios tradicionales. Tercero, encuentra tu ventaja 10x — la dimensión donde reduces dramáticamente la fricción de transacción para {TARGET_AUDIENCE}, ya sea confianza, descubrimiento o simplicidad. Cuarto, crea una UVP usando la fórmula bilateral y pruébala por separado con compradores y vendedores. Quinto, evita competir solo en comisiones; compite en el valor único de transacción que tu plataforma {BUSINESS_TYPE} entrega para {ENTITY}. Estos principios ayudarán a {PROJECT_NAME} a construir efectos de red defensibles en un panorama de marketplace competitivo.',
  },
];

// ---------------------------------------------------------------------------
// Lección 4: ¿Cómo ganarás dinero?
// ---------------------------------------------------------------------------

const marketplaceMonetizationBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Los ingresos en un marketplace son fundamentalmente diferentes de otros modelos de negocio porque no eres dueño del inventario — facilitas transacciones entre compradores y vendedores independientes. Para {PROJECT_NAME}, elegir la estrategia de monetización correcta significa entender cómo capturar una parte justa del valor que creas sin desalentar la participación en ningún lado del mercado. En esta lección explorarás los modelos de ingresos de marketplace más comunes, aprenderás a calcular la economía unitaria por transacción y desarrollarás una estrategia de precios que se alinee con el valor que entregas a {TARGET_AUDIENCE}. Cubriremos comisiones, tarifas de listado, niveles de suscripción para vendedores, colocación destacada y fuentes de ingresos auxiliares. También aprenderás sobre las métricas financieras clave que todo fundador de marketplace debe rastrear, incluyendo el Valor Bruto de Mercancía (GMV), los ingresos netos, la comisión y el equilibrio crítico entre monetización y liquidez. Al final de esta lección tendrás un plan de monetización claro para {PROJECT_NAME} que equilibre el crecimiento con ingresos sostenibles.',
  },
  {
    type: 'text',
    title: 'Modelos de Ingresos de Marketplace Explicados',
    content:
      'Los modelos de ingresos de marketplace más comunes son basados en comisión, tarifas de listado, niveles de suscripción y colocación destacada. Los precios basados en comisión cobran un porcentaje de cada transacción — típicamente entre el 5% y el 30% dependiendo de la categoría y el valor que agregas. Este modelo alinea tus ingresos directamente con el volumen de transacciones y es el enfoque más común para plataformas que facilitan transacciones de {ENTITY}. Las tarifas de listado cobran a los vendedores una cantidad fija por publicar cada listado, independientemente de si se vende. Este modelo funciona bien cuando los listados tienen valor incluso sin una transacción, como ofertas de empleo o listados inmobiliarios. Los niveles de suscripción ofrecen a los vendedores herramientas premium, analíticas y visibilidad a cambio de una tarifa mensual. Este modelo proporciona ingresos predecibles y funciona bien cuando los vendedores son profesionales que dependen de la plataforma para su sustento. La colocación destacada cobra a los vendedores por impulsar sus listados de {ENTITY} en los resultados de búsqueda o páginas de categoría, similar a la publicidad. Para {PROJECT_NAME}, considera qué modelo se ajusta mejor a cómo {TARGET_AUDIENCE} obtiene valor de tu plataforma. Muchos marketplaces exitosos como Etsy y Airbnb usan modelos híbridos que combinan una comisión base con funcionalidades premium opcionales y listados promocionados.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Estrategia de Comisión para Marketplaces',
    content:
      'Imagina que {PROJECT_NAME} facilita transacciones de {ENTITY} con un valor promedio de transacción de $150. Estableces una comisión del 15%, ganando $22.50 por transacción. Con 1,000 transacciones al mes, eso genera $22,500 en ingresos netos sobre $150,000 de GMV. También ofreces una suscripción "Vendedor Pro" a $49 al mes que da a los vendedores colocación prioritaria, analíticas avanzadas y una comisión reducida del 10%. Si 100 vendedores se suscriben, eso agrega $4,900 en ingresos mensuales predecibles. Este modelo híbrido permite que {PROJECT_NAME} gane de cada transacción mientras da a los vendedores profesionales un incentivo para invertir en la plataforma — un patrón que aumenta la retención de vendedores y la calidad de la oferta para {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: La Trampa de la Comisión Alta',
    content:
      'Un fundador de marketplace estableció una comisión del 30% desde el día uno para maximizar los ingresos por transacción. Los vendedores rápidamente calcularon que estaban perdiendo casi un tercio de sus ganancias y comenzaron a dirigir a los clientes recurrentes a transaccionar fuera de la plataforma a través de mensajes directos y sitios web personales. En seis meses, la plataforma tenía alto GMV en papel pero volumen de transacciones real en declive a medida que los vendedores desintermediaban el marketplace. Para {PROJECT_NAME}, comienza con una comisión competitiva que los vendedores perciban como justa — típicamente 10-20% para la mayoría de las categorías. Puedes aumentarla después a medida que agregas más valor a través de herramientas, generación de demanda y mecanismos de confianza. Recuerda que una comisión del 10% en un marketplace próspero genera mucho más ingresos que una comisión del 30% en una plataforma que los vendedores están tratando activamente de evadir.',
  },
  {
    type: 'text',
    title: 'Economía Unitaria: GMV, Ingresos Netos y CAC',
    content:
      'La economía unitaria en un marketplace gira alrededor del Valor Bruto de Mercancía (GMV), los ingresos netos y el costo de adquirir participantes en ambos lados del mercado. El GMV es el valor total de todas las transacciones facilitadas a través de {PROJECT_NAME} — representa el tamaño de tu marketplace pero no es tu ingreso. Los ingresos netos son la porción del GMV que conservas después de pagar a los vendedores, procesar pagos y manejar reembolsos. Tu comisión determina la relación entre GMV e ingresos netos. El Costo de Adquisición de Cliente (CAC) en un marketplace debe calcularse por separado para compradores y vendedores porque los canales y costos difieren significativamente. El CAC de compradores incluye inversión en marketing, bonos de referencia y descuentos promocionales. El CAC de vendedores incluye costos de onboarding, exenciones de tarifas iniciales y gastos del equipo de ventas. El Valor de Vida (LTV) de cada participante depende de su frecuencia de transacción y valor promedio de transacción durante toda su relación con la plataforma. Para un marketplace saludable, la relación LTV-a-CAC debe ser de al menos 3:1 en cada lado. Presta especial atención a la proporción de compradores a vendedores — la mayoría de los marketplaces necesitan 5-10 compradores activos por vendedor para mantener una liquidez saludable.',
  },
  {
    type: 'tip',
    title: 'Subsidia el Lado Difícil Primero',
    content:
      'En los primeros días de {PROJECT_NAME}, considera ofrecer comisiones reducidas o cero para atraer el lado de la oferta. Una vez que tengas listados de {ENTITY} de calidad de vendedores confiables, los compradores vendrán orgánicamente. Uber subsidió a los conductores con ganancias por hora garantizadas, y Airbnb ofreció fotografía profesional gratuita a los anfitriones. El costo de subsidiar la oferta temprana es una inversión en liquidez que se paga sola una vez que los efectos de red se activan para {TARGET_AUDIENCE}.',
  },
  {
    type: 'warning',
    title: 'No Monetices Antes de Alcanzar Liquidez',
    content:
      'El mayor error de monetización en marketplaces es cobrar demasiado demasiado pronto. Si {PROJECT_NAME} aún no ha alcanzado un volumen de transacciones consistente donde los compradores encuentren confiablemente lo que necesitan y los vendedores reciban pedidos confiablemente, agregar tarifas alejará a los participantes que desesperadamente necesitas. Enfócate en la liquidez primero, la monetización después. Muchos marketplaces exitosos operaron con pérdidas durante años mientras construían los efectos de red que eventualmente los hicieron altamente rentables. La paciencia con la monetización no es opcional — es una estrategia de supervivencia para plataformas de {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, elige un modelo de ingresos que se alinee con cómo {TARGET_AUDIENCE} transacciona en {PROJECT_NAME} — comisión para transacciones de alto valor, suscripciones para vendedores profesionales o un enfoque híbrido. Segundo, establece una comisión que los vendedores perciban como justa para prevenir la desintermediación — típicamente 10-20% para la mayoría de las categorías de {ENTITY}. Tercero, rastrea GMV, ingresos netos y CAC separado para compradores y vendedores desde el día uno. Cuarto, subsidia el lado más difícil de atraer primero para construir liquidez inicial. Quinto, no monetices agresivamente antes de alcanzar volumen de transacciones consistente — la liquidez viene antes que los ingresos en el playbook {BUSINESS_TYPE}. Estos principios de monetización ayudarán a {PROJECT_NAME} a construir un negocio de plataforma sostenible.',
  },
];

// ---------------------------------------------------------------------------
// Lección 5: ¿Cuáles son tus métricas clave?
// ---------------------------------------------------------------------------

const marketplaceKeyMetricsBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Lo que se mide se gestiona, y en un marketplace las métricas que rastreas son fundamentalmente diferentes de los negocios de un solo lado. Para {PROJECT_NAME}, rastrear las métricas correctas es esencial para entender si tu plataforma {BUSINESS_TYPE} está alcanzando la liquidez y los efectos de red necesarios para el éxito a largo plazo. En esta lección aprenderás sobre los indicadores clave de rendimiento que todo fundador de marketplace debe monitorear, cómo configurar un panel de métricas que cubra ambos lados del mercado y cómo usar datos para tomar mejores decisiones sobre crecimiento, monetización y salud de la plataforma. Cubriremos métricas de transacción como GMV y comisión, métricas de liquidez como la tasa de búsqueda-a-completación y el tiempo-a-transacción, y métricas de salud de red como la proporción comprador-vendedor y la tasa de transacción repetida. También aprenderás cómo evitar métricas de vanidad — números que se ven impresionantes pero no indican si tu marketplace realmente está funcionando para {TARGET_AUDIENCE}. Al final de esta lección tendrás un marco de métricas claro para {PROJECT_NAME} que te dirá exactamente cómo está funcionando tu plataforma y dónde enfocar tus esfuerzos de mejora.',
  },
  {
    type: 'text',
    title: 'Métricas de Transacción: GMV, Ingresos Netos y Comisión',
    content:
      'El Valor Bruto de Mercancía (GMV) es la métrica principal para cualquier plataforma {BUSINESS_TYPE}. Representa el valor total de todas las transacciones facilitadas a través de {PROJECT_NAME} e indica el tamaño general y la trayectoria de crecimiento de tu marketplace. Sin embargo, el GMV solo puede ser engañoso — un marketplace con $1 millón de GMV y una comisión del 5% genera solo $50,000 en ingresos netos, mientras que uno con $500,000 de GMV y una comisión del 15% genera $75,000. Los ingresos netos — el dinero real que {PROJECT_NAME} conserva después de pagar a vendedores y costos de procesamiento — es lo que financia tus operaciones y crecimiento. Rastrea el GMV desglosado por categoría, geografía y segmento de cliente para entender de dónde viene el crecimiento y qué verticales son más rentables para tu plataforma. Monitorea tu comisión efectiva, que es ingresos netos divididos por GMV, para asegurar que tu estrategia de monetización está funcionando según lo planeado. Para {PROJECT_NAME}, también rastrea el valor promedio de transacción y la frecuencia de transacción por comprador y por vendedor por separado. Estas métricas revelan si tu marketplace está atrayendo participantes de alto valor de {TARGET_AUDIENCE} o llenándose de transacciones de bajo valor que consumen recursos de soporte sin generar ingresos significativos.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: El Poder de las Métricas de Liquidez',
    content:
      'Considera dos plataformas de marketplace, ambas con $500K de GMV mensual. La Plataforma A tiene una tasa de búsqueda-a-completación del 90% — 9 de cada 10 búsquedas de compradores resultan en una transacción. La Plataforma B tiene una tasa de búsqueda-a-completación del 30% — solo 3 de cada 10 búsquedas convierten. La Plataforma A tiene fuerte liquidez y participantes contentos en ambos lados. La Plataforma B tiene compradores frustrados que no pueden encontrar lo que necesitan y vendedores que no reciben suficientes pedidos. En 12 meses, la Plataforma A crece a $2M de GMV a través de referencias orgánicas mientras la Plataforma B se estanca a medida que los participantes se van por mejores alternativas. Para {PROJECT_NAME}, enfócate obsesivamente en las métricas de liquidez — predicen el crecimiento futuro mucho mejor que los números brutos de GMV.',
  },
  {
    type: 'callout',
    title: 'Escenario: Métricas de Vanidad vs. Métricas Accionables en Marketplaces',
    content:
      'Un fundador de marketplace reportó orgullosamente 50,000 usuarios registrados y 10,000 listados para su plataforma de {ENTITY}. Pero solo 2,000 usuarios habían completado una transacción en los últimos 30 días, y el tiempo promedio de búsqueda a transacción era de 5 días — demasiado largo para la categoría. Los números de "usuarios registrados" y "listados totales" eran métricas de vanidad que enmascaraban serios problemas de liquidez y matching. Para {PROJECT_NAME}, enfócate en métricas que impulsen la acción: tasa de búsqueda-a-completación (qué porcentaje de búsquedas de compradores de {TARGET_AUDIENCE} resultan en una transacción completada), tiempo-a-transacción (qué tan rápido los compradores encuentran y completan una compra) y tasa de transacción repetida (qué porcentaje de compradores y vendedores transaccionan más de una vez).',
  },
  {
    type: 'text',
    title: 'Métricas de Liquidez y Salud de Red',
    content:
      'Más allá del volumen de transacciones, {PROJECT_NAME} necesita rastrear métricas que indiquen la salud del marketplace y la fortaleza de los efectos de red. La proporción comprador-vendedor mide el equilibrio entre oferta y demanda — la mayoría de los marketplaces necesitan 5-10 compradores activos por vendedor activo para mantener una liquidez saludable. Si esta proporción cae demasiado, los vendedores no reciben suficientes pedidos y se van. Si sube demasiado, los compradores no pueden encontrar {ENTITY} disponible y se van. La tasa de búsqueda-a-completación mide el porcentaje de búsquedas de compradores que resultan en una transacción completada. Para la mayoría de los marketplaces, una tasa por encima del 70% indica fuerte liquidez. Por debajo del 50% señala un problema de matching o de oferta que necesita atención inmediata. La tasa de transacción repetida mide qué porcentaje de participantes transaccionan más de una vez dentro de 90 días. Una tasa por encima del 40% en el lado del comprador y del 60% en el lado del vendedor indica fuerte product-market fit. La métrica de concentración de proveedores rastrea qué porcentaje del GMV proviene de tu 10% superior de vendedores. Si la concentración es demasiado alta, tu marketplace es vulnerable a perder vendedores clave. Para {PROJECT_NAME}, rastrea estas métricas semanalmente y establece alertas para cuando cualquier métrica caiga por debajo de tu umbral.',
  },
  {
    type: 'tip',
    title: 'Construye un Panel Bilateral Desde el Día Uno',
    content:
      'No esperes hasta que {PROJECT_NAME} tenga miles de transacciones para comenzar a rastrear métricas. Configura un panel que muestre métricas del lado del comprador y del vendedor por separado usando herramientas como Mixpanel, Amplitude o incluso una hoja de cálculo bien estructurada. Rastrea GMV, tasa de búsqueda-a-completación, tiempo-a-transacción y tasas de repetición semanalmente. Los datos tempranos — incluso de un número pequeño de participantes de {TARGET_AUDIENCE} — revelan patrones de liquidez que informan decisiones críticas de plataforma sobre dónde invertir en adquisición de oferta versus generación de demanda.',
  },
  {
    type: 'warning',
    title: 'Cuidado con la Inflación del GMV',
    content:
      'El GMV total puede inflarse por transacciones únicas de alto valor, descuentos promocionales que impulsan artificialmente el volumen o incluso actividad fraudulenta. Siempre acompaña el GMV con ingresos netos, conteo de transacciones y tasa de fraude para obtener una imagen precisa de la salud de la plataforma {PROJECT_NAME}. Si el GMV está creciendo pero los ingresos netos por transacción están disminuyendo, puedes tener un problema de comisión o fraude. Si el GMV está creciendo pero las tasas de transacción repetida están estancadas, puedes tener un problema de retención que eventualmente estancará el crecimiento entre {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, GMV e ingresos netos son las métricas de transacción más importantes para {PROJECT_NAME} como plataforma {BUSINESS_TYPE}, pero deben acompañarse con métricas de liquidez. Segundo, rastrea la tasa de búsqueda-a-completación, el tiempo-a-transacción y la tasa de transacción repetida para entender si tu marketplace realmente está funcionando para {TARGET_AUDIENCE}. Tercero, monitorea la proporción comprador-vendedor para mantener un equilibrio saludable de oferta-demanda para {ENTITY}. Cuarto, evita métricas de vanidad como usuarios registrados totales o listados totales que enmascaran problemas de liquidez subyacentes. Quinto, construye un panel de métricas bilateral desde el día uno y revísalo semanalmente. Las decisiones basadas en datos sobre dónde invertir en oferta versus demanda ayudarán a {PROJECT_NAME} a alcanzar los efectos de red que hacen defensibles a los negocios de marketplace con el tiempo.',
  },
];


// ============================================================================
// GENERIC SPANISH TEMPLATES
// ============================================================================

// ---------------------------------------------------------------------------
// Lección 1: ¿Qué problema resuelve tu negocio?
// ---------------------------------------------------------------------------

const genericProblemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Todo negocio digital exitoso comienza con un problema claramente definido. Antes de invertir tiempo y recursos en {PROJECT_NAME}, necesitas articular el punto de dolor exacto que enfrenta tu {TARGET_AUDIENCE} en su vida diaria o trabajo. Una declaración de problema bien definida actúa como una brújula que guía las decisiones de producto, los mensajes de marketing y las prioridades de desarrollo. En esta lección aprenderás cómo identificar, validar y comunicar el problema central que tu emprendimiento {BUSINESS_TYPE} aborda. Exploraremos marcos de trabajo utilizados por fundadores exitosos en diversas industrias, examinaremos ejemplos del mundo real de negocios que comenzaron con un enfoque agudo en el problema y te daremos un proceso repetible para refinar tu declaración de problema hasta que resuene con clientes potenciales. Al final de esta lección podrás describir el problema en una oración, explicar por qué las alternativas existentes se quedan cortas y conectar el problema directamente con resultados medibles para tu {TARGET_AUDIENCE}. Comprender el problema en profundidad es el paso más importante para construir algo que la gente realmente quiera usar y por lo que esté dispuesta a pagar.',
  },
  {
    type: 'text',
    title: 'Por Qué Importa la Definición del Problema',
    content:
      'Muchos fundadores primerizos saltan directamente a construir funcionalidades sin comprender completamente el problema que están resolviendo. Esto lleva a productos que son técnicamente impresionantes pero comercialmente irrelevantes. Cuando defines el problema claramente para {PROJECT_NAME}, creas alineación en todo tu equipo: los diseñadores saben qué experiencias simplificar, los desarrolladores saben qué casos extremos importan más y los especialistas en marketing saben qué puntos de dolor destacar. Una definición de problema sólida también te ayuda a priorizar tu hoja de ruta. En lugar de perseguir cada solicitud de funcionalidad, puedes hacer una pregunta simple: "¿Esto nos acerca a resolver el problema central para {TARGET_AUDIENCE}?" Si la respuesta es no, va al backlog. Las investigaciones muestran consistentemente que la razón número uno por la que las startups fracasan es construir algo que nadie necesita. Esa estadística por sí sola debería convencerte de invertir tiempo serio en el descubrimiento del problema antes de invertir dinero serio en desarrollo. El problema es tu fundamento; las funcionalidades de tu producto, la estrategia de crecimiento, el modelo de ingresos y la experiencia del cliente se construyen sobre él. Sin un problema claro, arriesgas construir una solución en busca de un propósito.',
  },
  {
    type: 'text',
    title: 'Marcos de Trabajo para el Descubrimiento del Problema',
    content:
      'Existen varios marcos de trabajo probados que puedes usar para descubrir y articular el problema que {PROJECT_NAME} resuelve. El marco Jobs-to-be-Done pregunta: "¿Qué trabajo está contratando {TARGET_AUDIENCE} a tu producto para hacer?" Esto cambia el enfoque de las funcionalidades a los resultados. La técnica de los Cinco Porqués te ayuda a profundizar más allá de los síntomas superficiales para encontrar las causas raíz. Comienza con la queja obvia y pregunta "por qué" cinco veces hasta llegar al problema subyacente. Las entrevistas de Customer Development, popularizadas por Steve Blank, implican hablar con al menos 20 usuarios potenciales antes de construir nada. Durante estas conversaciones, escucha las frustraciones recurrentes, las soluciones improvisadas y el lenguaje que la gente usa para describir su dolor. Finalmente, el canvas de Problem-Solution Fit te permite mapear el problema, las alternativas existentes y tu enfoque único lado a lado. Cualquiera que sea el marco que elijas, el objetivo es el mismo: llegar a una declaración de problema que sea específica, medible y vinculada a un costo real — ya sea tiempo, dinero u oportunidad perdida para tu {TARGET_AUDIENCE}. Un problema vago lleva a un producto vago; un problema agudo lleva a un {ENTITY} enfocado y convincente que la gente está ansiosa por adoptar.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Descubrimiento del Problema en Acción',
    content:
      'Imagina que estás construyendo {PROJECT_NAME}, un emprendimiento {BUSINESS_TYPE} para {TARGET_AUDIENCE}. Durante las entrevistas con clientes descubres que tus usuarios pasan un promedio de 4 horas por semana en un proceso manual que podría optimizarse. Eso son más de 200 horas al año por usuario — un punto de dolor claro y cuantificable. También descubres que las alternativas existentes solo resuelven parte del problema, obligando a los usuarios a manejar múltiples herramientas o soluciones improvisadas. Esta información se convierte en la base de tu propuesta de valor: "{PROJECT_NAME} elimina el cuello de botella semanal de 4 horas proporcionando un {ENTITY} único e integrado que maneja todo el flujo de trabajo." Observa cómo la declaración del problema incluye una métrica específica, una audiencia clara y una pista sobre la solución.',
  },
  {
    type: 'callout',
    title: 'Escenario: Cuando el Problema No Es Suficientemente Claro',
    content:
      'Considera un fundador que describe el problema como "la gente necesita mejores herramientas." Esto es demasiado vago para guiar cualquier decisión. Compáralo con: "{TARGET_AUDIENCE} pierde el 15% de su tiempo productivo porque no puede gestionar eficientemente su flujo de trabajo central sin alternar entre herramientas desconectadas." La segunda versión es específica, medible y sugiere inmediatamente lo que {PROJECT_NAME} debería hacer. Si tu declaración de problema suena como el primer ejemplo, sigue iterando. Habla con más usuarios, recopila datos y estrecha tu enfoque hasta que el problema sea lo suficientemente agudo para destacar en un mercado {BUSINESS_TYPE} competitivo.',
  },
  {
    type: 'tip',
    title: 'Valida Antes de Construir',
    content:
      'Antes de comprometerte con una declaración de problema para {PROJECT_NAME}, valídala con al menos 10 usuarios potenciales de tu {TARGET_AUDIENCE}. Haz preguntas abiertas como "¿Cuál es la parte más difícil de tu día?" y escucha los patrones. Si menos de 7 de cada 10 personas mencionan el mismo punto de dolor, tu problema puede no ser lo suficientemente extendido para sostener un negocio {BUSINESS_TYPE} viable.',
  },
  {
    type: 'warning',
    title: 'Evita el Sesgo de Solución',
    content:
      'Un error común es enamorarse de tu solución antes de entender el problema. Si te encuentras describiendo {PROJECT_NAME} en términos de funcionalidades en lugar de resultados, da un paso atrás y revisa tu declaración de problema. Las funcionalidades cambian; el problema central que enfrenta tu {TARGET_AUDIENCE} debería permanecer estable durante años. Construye para el problema, no para la tecnología.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, un problema bien definido es la base de todo emprendimiento {BUSINESS_TYPE} exitoso. Segundo, usa marcos como Jobs-to-be-Done y Customer Development para descubrir los verdaderos puntos de dolor de {TARGET_AUDIENCE}. Tercero, tu declaración de problema debe ser específica, medible y vinculada a un costo real. Cuarto, valida el problema con usuarios reales antes de invertir en el desarrollo de {PROJECT_NAME}. Quinto, revisa y refina tu declaración de problema a medida que aprendes más del mercado. Estos principios mantendrán a {PROJECT_NAME} enfocado en entregar valor genuino.',
  },
];

// ---------------------------------------------------------------------------
// Lección 2: ¿Quiénes son tus clientes objetivo?
// ---------------------------------------------------------------------------

const genericTargetCustomersBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Saber exactamente quiénes son tus clientes es la diferencia entre un emprendimiento {BUSINESS_TYPE} que crece y uno que se estanca. Para {PROJECT_NAME}, definir tus clientes objetivo significa ir más allá de la demografía para comprender comportamientos, motivaciones y disparadores de compra. En esta lección aprenderás cómo segmentar tu mercado, construir perfiles detallados de clientes e identificar a los adoptadores tempranos más propensos a usar y pagar por tu {ENTITY}. Cubriremos métodos cuantitativos como el análisis TAM-SAM-SOM junto con técnicas cualitativas como el mapeo de empatía. También aprenderás cómo priorizar segmentos para que tus recursos limitados generen el máximo impacto. Al final de esta lección tendrás una imagen clara de quién es realmente {TARGET_AUDIENCE}, qué impulsa sus decisiones y cómo llegar a ellos eficientemente. Esta claridad informará todo, desde tu estrategia de precios hasta tu flujo de onboarding y canales de marketing.',
  },
  {
    type: 'text',
    title: 'Segmentación de Mercado para Negocios Digitales',
    content:
      'La segmentación de mercado divide a tus usuarios potenciales en grupos que comparten características comunes. Para un emprendimiento {BUSINESS_TYPE} como {PROJECT_NAME}, las dimensiones de segmentación más útiles incluyen demografía de usuarios, patrones de comportamiento, intensidad de necesidad y disposición a pagar. Comienza de forma amplia y luego ve estrechando. Tu Mercado Total Direccionable (TAM) podría incluir a todos los que teóricamente podrían usar tu producto. Tu Mercado Direccionable Alcanzable (SAM) reduce eso a usuarios que puedes alcanzar de manera realista con tu estrategia actual de go-to-market. Tu Mercado Obtenible Alcanzable (SOM) es la porción que puedes capturar en los próximos 12 a 18 meses. Para {PROJECT_NAME}, enfoca tus esfuerzos iniciales en el SOM — el segmento donde tu product-market fit es más fuerte y donde {TARGET_AUDIENCE} ya está buscando activamente soluciones. Intentar servir a todos a la vez es la forma más rápida de no servir bien a nadie. Un enfoque concentrado te permite construir experiencia profunda en un segmento antes de expandir a segmentos adyacentes.',
  },
  {
    type: 'text',
    title: 'Construyendo Perfiles de Cliente',
    content:
      'Un perfil de cliente es una representación semi-ficticia de tu usuario ideal basada en datos reales y suposiciones fundamentadas. Para {PROJECT_NAME}, crea dos o tres perfiles que representen segmentos distintos de {TARGET_AUDIENCE}. Cada perfil debe incluir un nombre, rol o situación, objetivos, frustraciones, canales preferidos y factores de toma de decisiones. Ve más allá de los atributos superficiales: ¿qué le preocupa a esta persona? ¿Qué métricas o resultados le importan más? ¿Qué la convertiría en una campeona de tu producto dentro de su organización o comunidad? Las respuestas a estas preguntas darán forma a tu mensajería, prioridades de funcionalidades e incluso tu diseño de interfaz de usuario. Recuerda que los perfiles son documentos vivos — actualízalos a medida que recopilas más datos de usuarios reales de {PROJECT_NAME}. Un perfil que era preciso en el lanzamiento puede desviarse a medida que tu producto y mercado evolucionan. Los mejores perfiles están fundamentados en conversaciones reales, no en suposiciones hechas en una sala de reuniones.',
  },
  {
    type: 'callout',
    title: 'Ejemplo: Construyendo un Perfil de Cliente',
    content:
      'Conoce a "Emma la Eficiente," una profesional de nivel medio que gestiona un equipo pequeño. Pasa 3 horas diarias en tareas repetitivas y es evaluada por métricas de productividad del equipo. Tiene autoridad de presupuesto para herramientas de menos de $500 al mes y prefiere soluciones que se integren con su flujo de trabajo existente. Emma representa un segmento clave de {TARGET_AUDIENCE} para {PROJECT_NAME}. Es lo suficientemente tech-savvy para adoptar nuevas herramientas pero no lo suficientemente técnica para construir su propia solución. Su punto de dolor se alinea perfectamente con lo que {PROJECT_NAME} ofrece, convirtiéndola en una adoptadora temprana ideal para tu emprendimiento {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: Elegir el Segmento Equivocado',
    content:
      'Un fundador construyó una herramienta de productividad dirigida a grandes empresas con más de 10,000 empleados. El ciclo de ventas era de 9 meses, el producto requería personalización extensiva y el fundador se quedó sin capital antes de cerrar un solo acuerdo. Si hubiera comenzado con equipos pequeños de 5 a 20 personas — un segmento con ciclos de decisión más cortos y necesidades más simples — podría haber iterado más rápido y generado ingresos antes. Para {PROJECT_NAME}, comienza con el segmento de {TARGET_AUDIENCE} que pueda decir "sí" más rápido y expande desde ahí. La velocidad de adopción importa más que el tamaño del mercado inicial.',
  },
  {
    type: 'tip',
    title: 'Comienza con los Adoptadores Tempranos',
    content:
      'Los adoptadores tempranos son usuarios que buscan activamente nuevas soluciones y toleran imperfecciones. Para {PROJECT_NAME}, busca miembros de {TARGET_AUDIENCE} que ya estén usando soluciones improvisadas como hojas de cálculo, procesos manuales o herramientas improvisadas. Estas personas sienten el dolor más intensamente y están dispuestas a probar un nuevo {ENTITY} incluso antes de que esté completamente pulido. También te darán la retroalimentación más valiosa.',
  },
  {
    type: 'warning',
    title: 'No Intentes Llegar a Todos',
    content:
      'Decir que "{PROJECT_NAME} es para todos" es lo mismo que decir que no es para nadie. Un emprendimiento {BUSINESS_TYPE} que intenta servir a todos los segmentos simultáneamente termina con un conjunto de funcionalidades inflado, mensajería confusa y alta rotación. Elige uno o dos segmentos de {TARGET_AUDIENCE} y sírvelos excepcionalmente bien antes de expandir. La profundidad supera a la amplitud en las etapas tempranas.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, segmenta tu mercado usando dimensiones relevantes para tu emprendimiento {BUSINESS_TYPE}: demografía, comportamiento, necesidades y disposición a pagar. Segundo, construye perfiles detallados basados en conversaciones reales con {TARGET_AUDIENCE}. Tercero, enfoca tu go-to-market inicial en el Mercado Obtenible Alcanzable donde {PROJECT_NAME} tiene el fit más fuerte. Cuarto, apunta a los adoptadores tempranos que ya están usando soluciones improvisadas. Quinto, resiste la tentación de servir a todos a la vez — la profundidad supera a la amplitud en las etapas tempranas de cualquier negocio digital.',
  },
];


// ---------------------------------------------------------------------------
// Lección 3: ¿Qué hace única a tu solución?
// ---------------------------------------------------------------------------

const genericUniqueSolutionBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'En un panorama digital saturado, tener un buen producto no es suficiente — necesitas un producto que destaque. Tu propuesta de valor única (UVP) es la razón por la que {TARGET_AUDIENCE} elegirá {PROJECT_NAME} sobre cada alternativa, incluyendo no hacer nada en absoluto. En esta lección aprenderás cómo identificar tus ventajas competitivas, articularlas claramente e integrarlas en cada aspecto de tu producto y marketing. Examinaremos estrategias de diferenciación utilizadas por negocios digitales exitosos, exploraremos marcos de posicionamiento y te ayudaremos a crear una UVP que resuene con tus clientes ideales. Al final de esta lección podrás explicar en una oración por qué {PROJECT_NAME} es la mejor opción para {TARGET_AUDIENCE}, y tendrás un marco para mantener esa diferenciación a medida que los competidores evolucionan. Tu UVP no es un eslogan — es una decisión estratégica que da forma a todo tu emprendimiento {BUSINESS_TYPE}.',
  },
  {
    type: 'text',
    title: 'Entendiendo la Diferenciación Competitiva',
    content:
      'La diferenciación en el espacio {BUSINESS_TYPE} puede provenir de muchas fuentes: tecnología, experiencia de usuario, precios, integraciones, soporte al cliente o experiencia en el dominio. Para {PROJECT_NAME}, comienza mapeando el panorama competitivo. Lista cada alternativa que {TARGET_AUDIENCE} usa actualmente — incluyendo procesos manuales, hojas de cálculo, herramientas gratuitas y productos competidores. Para cada alternativa, anota sus fortalezas y debilidades. Luego identifica las brechas: ¿dónde fallan las soluciones existentes? Estas brechas son tus oportunidades. La diferenciación no significa ser diferente en todo; significa ser significativamente mejor en las formas que más importan a tus clientes. Un producto que es 10 por ciento mejor en todo luchará contra uno que es 10 veces mejor en una dimensión crítica. Encuentra tu dimensión 10x y construye {PROJECT_NAME} alrededor de ella. Este enfoque concentrado también hace que tu mensaje de marketing sea más claro y tus conversaciones de crecimiento más convincentes.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Encontrando Tu Ventaja 10x',
    content:
      'Considera cómo los negocios digitales exitosos se diferencian en mercados saturados. No intentan ser mejores en todo. En cambio, se enfocan en una o dos dimensiones que las soluciones existentes manejan mal — quizás velocidad, simplicidad o un flujo de trabajo específico que los competidores pasan por alto. Para {PROJECT_NAME}, pregúntate: ¿cuál es la única cosa que {TARGET_AUDIENCE} más valora y que ningún competidor hace bien? Ahí es donde deberías concentrar tus recursos de desarrollo y diseño. Tu {ENTITY} debería ser la opción obvia para esa necesidad específica, incluso si los competidores ofrecen más funcionalidades en general.',
  },
  {
    type: 'callout',
    title: 'Escenario: Posicionamiento Contra Competidores Establecidos',
    content:
      'Cuando {PROJECT_NAME} entra en un mercado con jugadores establecidos, evita competir en sus términos. Si el líder del mercado gana en funcionalidades, compite en simplicidad. Si gana en precio, compite en especialización. Posiciona {PROJECT_NAME} como la mejor solución para un subconjunto específico de {TARGET_AUDIENCE} en lugar de una herramienta de propósito general. Esta estrategia de cuña te permite construir una base de usuarios leales en un nicho antes de expandir. Muchos de los negocios digitales más exitosos comenzaron dominando un segmento estrecho antes de ampliar su atractivo a mercados adyacentes.',
  },
  {
    type: 'text',
    title: 'Creando Tu Propuesta de Valor Única',
    content:
      'Una UVP sólida sigue una fórmula simple: "Para [cliente objetivo] que [tiene este problema], {PROJECT_NAME} es un [categoría] que [beneficio clave]. A diferencia de [competidores], {PROJECT_NAME} [diferenciador único]." Esta plantilla te obliga a ser específico sobre cada elemento. Complétala con datos reales de tu investigación de clientes. Pruébala con miembros de {TARGET_AUDIENCE} e itera hasta que funcione. Una buena UVP debe pasar la prueba del "¿y qué?" — si un cliente potencial la lee y se encoge de hombros, no es lo suficientemente específica. También debe pasar la prueba del "demuéstralo" — cada afirmación debe estar respaldada por evidencia, ya sea una métrica, un testimonio o una demostración del producto. Tu UVP aparecerá en tu landing page, en tus presentaciones y en cada conversación que tu equipo tenga con prospectos. Asegúrate de que sea aguda, honesta y memorable para cualquiera que evalúe tu {ENTITY}.',
  },
  {
    type: 'tip',
    title: 'Prueba Tu UVP con Usuarios Reales',
    content:
      'Muestra tu UVP a cinco miembros de {TARGET_AUDIENCE} y pídeles que la repitan con sus propias palabras. Si no pueden, es demasiado compleja. Si agregan detalles que no incluiste, esos detalles podrían pertenecer a tu UVP. Esta prueba simple no cuesta nada y puede ahorrar a {PROJECT_NAME} meses de mensajería desalineada.',
  },
  {
    type: 'warning',
    title: 'No Te Diferencies Solo por Precio',
    content:
      'Competir en precio es una carrera hacia el fondo. Siempre habrá una alternativa más barata o una opción gratuita. En cambio, diferencia {PROJECT_NAME} por el valor entregado a {TARGET_AUDIENCE}. Si tu {ENTITY} ahorra a los usuarios tiempo o dinero significativo, el precio se convierte en una fracción del valor creado. Los negocios sostenibles compiten en valor, no en costo.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, la diferenciación se trata de ser significativamente mejor en las formas que más importan a {TARGET_AUDIENCE}. Segundo, mapea el panorama competitivo e identifica brechas que {PROJECT_NAME} pueda llenar. Tercero, encuentra tu ventaja 10x — la dimensión donde eres dramáticamente mejor que las alternativas. Cuarto, crea una UVP usando la fórmula y pruébala con usuarios reales. Quinto, evita competir solo en precio; compite en el valor único que tu {ENTITY} entrega. Estos principios ayudarán a {PROJECT_NAME} a destacar en un panorama {BUSINESS_TYPE} competitivo.',
  },
];

// ---------------------------------------------------------------------------
// Lección 4: ¿Cómo ganarás dinero?
// ---------------------------------------------------------------------------

const genericMonetizationBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Los ingresos son el alma de cualquier emprendimiento {BUSINESS_TYPE}. Para {PROJECT_NAME}, elegir la estrategia de monetización correcta es tan importante como construir el producto correcto. En esta lección explorarás los modelos de ingresos más comunes para negocios digitales, aprenderás a calcular la economía unitaria y desarrollarás una estrategia de precios que se alinee con el valor que entregas a {TARGET_AUDIENCE}. Cubriremos suscripciones, compras únicas, precios basados en uso, modelos freemium y enfoques híbridos. También aprenderás sobre las métricas financieras clave que todo fundador debe rastrear, incluyendo la tasa de crecimiento de ingresos, el Costo de Adquisición de Cliente (CAC) y el Valor de Vida del Cliente (LTV). Al final de esta lección tendrás un plan de monetización claro para {PROJECT_NAME} que equilibre el crecimiento con la rentabilidad. Acertar con los precios desde el inicio puede acelerar tu camino hacia el product-market fit, mientras que equivocarte puede estancar incluso los mejores productos.',
  },
  {
    type: 'text',
    title: 'Modelos de Ingresos para Negocios Digitales',
    content:
      'Los modelos de ingresos más comunes para negocios digitales son basados en suscripción, basados en transacción, basados en uso y freemium. Los precios por suscripción cobran una tarifa recurrente por acceso a tu {ENTITY}. Este modelo proporciona ingresos predecibles y es fácil de presupuestar para los clientes. Los precios basados en transacción cobran una tarifa o comisión cada vez que un usuario completa una acción o compra. Los precios basados en uso cobran según el consumo — llamadas API, almacenamiento, usuarios activos o volumen procesado. Este modelo alinea el costo con el valor pero puede hacer los ingresos menos predecibles. El modelo freemium ofrece un nivel gratuito con funcionalidad limitada y cobra por funciones premium. Este modelo reduce la barrera de entrada y puede impulsar el crecimiento orgánico, pero las tasas de conversión de gratuito a pago típicamente oscilan entre el 2 y el 5 por ciento. Para {PROJECT_NAME}, considera qué modelo se ajusta mejor a cómo {TARGET_AUDIENCE} obtiene valor de tu producto. Si el valor es continuo, los precios recurrentes tienen sentido. Si el valor está vinculado a acciones específicas, los precios basados en transacción pueden ser mejores. Muchos negocios digitales exitosos usan modelos híbridos que combinan elementos de múltiples enfoques para capturar valor en diferentes etapas del viaje del cliente.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: Eligiendo un Modelo de Precios',
    content:
      'Imagina que {PROJECT_NAME} ofrece tres niveles: un plan Básico a $19 al mes para individuos, un plan Profesional a $49 al mes para equipos pequeños y un plan Business a $129 al mes para organizaciones en crecimiento. Cada nivel desbloquea más funcionalidades y límites de uso más altos. El nivel Básico sirve como punto de entrada de bajo riesgo para {TARGET_AUDIENCE}, mientras que el nivel Business captura más valor de los usuarios avanzados. Esta estructura permite que {PROJECT_NAME} aumente los ingresos por cuenta con el tiempo a medida que los clientes se actualizan — un patrón conocido como ingresos de expansión, que es una de las formas más eficientes de crecimiento para cualquier emprendimiento {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Escenario: La Trampa del Freemium',
    content:
      'Un fundador lanzó con un nivel gratuito generoso que incluía el 90 por ciento de la funcionalidad del producto. Los usuarios amaban la versión gratuita pero no tenían razón para actualizarse. La empresa adquirió 50,000 usuarios gratuitos pero solo 200 clientes de pago — una tasa de conversión del 0.4 por ciento que no podía sostener el negocio. Para {PROJECT_NAME}, diseña tu nivel gratuito cuidadosamente: debe demostrar valor a {TARGET_AUDIENCE} mientras crea un incentivo claro para actualizarse. El nivel gratuito es una herramienta de marketing, no el producto en sí. Da a los usuarios lo suficiente para experimentar el valor central de tu {ENTITY}, pero reserva las funcionalidades que impulsan resultados serios para los planes de pago.',
  },
  {
    type: 'text',
    title: 'Economía Unitaria: CAC, LTV y Período de Recuperación',
    content:
      'La economía unitaria determina si tu emprendimiento {BUSINESS_TYPE} es financieramente viable. El Costo de Adquisición de Cliente (CAC) es el costo total de adquirir un cliente de pago, incluyendo gastos de marketing, ventas y onboarding. El Valor de Vida del Cliente (LTV) es el ingreso total que esperas de un cliente durante toda su relación con {PROJECT_NAME}. La relación LTV-a-CAC debe ser de al menos 3 a 1 para un negocio saludable — lo que significa que cada cliente genera tres veces más ingresos de lo que cuesta adquirirlo. El período de recuperación es cuánto tiempo toma recuperar el CAC de un solo cliente. Para la mayoría de los negocios digitales, un período de recuperación menor a 12 meses se considera bueno. Rastrea estas métricas desde el día uno para {PROJECT_NAME}. Incluso estimaciones aproximadas te ayudarán a tomar mejores decisiones sobre dónde invertir tu presupuesto de marketing y qué tan agresivamente perseguir el crecimiento entre {TARGET_AUDIENCE}. Entender tu economía unitaria temprano previene la trampa común de crecer rápido mientras pierdes dinero en cada cliente.',
  },
  {
    type: 'tip',
    title: 'Fija Precios Basados en Valor, No en Costo',
    content:
      'No establezcas precios para {PROJECT_NAME} basándote en lo que te cuesta entregar el {ENTITY}. En cambio, fija precios basados en el valor que {TARGET_AUDIENCE} recibe. Si tu producto ahorra a un cliente tiempo o dinero significativo cada mes, cobrar una fracción de ese valor es una ganga — y tienes margen para aumentar precios a medida que agregas más valor con el tiempo.',
  },
  {
    type: 'warning',
    title: 'No Cobres de Menos',
    content:
      'Muchos fundadores fijan precios demasiado bajos por miedo a que {TARGET_AUDIENCE} no pague. Los precios bajos señalan bajo valor y atraen clientes sensibles al precio que abandonan rápidamente. Es más fácil bajar precios que subirlos. Comienza más alto de lo que crees correcto para {PROJECT_NAME} y ajusta basándote en datos de conversión y retroalimentación de clientes.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, elige un modelo de ingresos que se alinee con cómo {TARGET_AUDIENCE} obtiene valor de {PROJECT_NAME}. Segundo, diseña niveles de precios que creen un camino claro de actualización de básico a premium. Tercero, si usas freemium, asegúrate de que el nivel gratuito demuestre valor sin regalar el producto central. Cuarto, rastrea la economía unitaria — LTV, CAC y período de recuperación — desde el día uno. Quinto, fija precios basados en el valor entregado, no en el costo incurrido. Estos principios de monetización ayudarán a {PROJECT_NAME} a construir un negocio {BUSINESS_TYPE} sostenible.',
  },
];

// ---------------------------------------------------------------------------
// Lección 5: ¿Cuáles son tus métricas clave?
// ---------------------------------------------------------------------------

const genericKeyMetricsBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introducción',
    content:
      'Lo que se mide se gestiona. Para {PROJECT_NAME}, rastrear las métricas correctas es esencial para entender si tu emprendimiento {BUSINESS_TYPE} está sano y creciendo. En esta lección aprenderás sobre los indicadores clave de rendimiento (KPIs) que todo fundador debe monitorear, cómo configurar un panel de métricas y cómo usar datos para tomar mejores decisiones. Cubriremos métricas de ingresos como ingresos recurrentes mensuales y anuales, métricas de crecimiento como tasas de activación y retención, y métricas de eficiencia que revelan si tu crecimiento es sostenible. También aprenderás cómo evitar métricas de vanidad — números que se ven impresionantes pero no se correlacionan con el éxito del negocio. Al final de esta lección tendrás un marco de métricas claro para {PROJECT_NAME} que te dirá exactamente cómo está funcionando tu producto con {TARGET_AUDIENCE} y dónde enfocar tus esfuerzos de mejora. La toma de decisiones basada en datos es lo que separa a los emprendimientos que escalan de los que se estancan.',
  },
  {
    type: 'text',
    title: 'Métricas de Ingresos y Crecimiento',
    content:
      'Las métricas de ingresos son los indicadores más importantes para cualquier emprendimiento {BUSINESS_TYPE}. Si tu modelo es recurrente, los Ingresos Recurrentes Mensuales (MRR) representan los ingresos predecibles que {PROJECT_NAME} genera cada mes. Si tu modelo es transaccional, rastrea los Ingresos Brutos y los Ingresos Netos después de reembolsos y contracargos. Más allá de los ingresos brutos, la Retención Neta de Ingresos (NRR) mide cuántos ingresos retienes de clientes existentes después de contabilizar la rotación, las degradaciones y la expansión. Un NRR por encima del 100 por ciento significa que tu base de clientes existente está creciendo incluso sin nuevas adquisiciones — un indicador poderoso de product-market fit. Para {PROJECT_NAME}, rastrea los ingresos desglosados en nuevos ingresos, ingresos de expansión, contracción y rotación. Esta descomposición revela si el crecimiento proviene de adquirir nuevos miembros de {TARGET_AUDIENCE} o de entregar más valor a los clientes existentes. La tasa de crecimiento en sí también importa: rastrea el crecimiento mes a mes y año a año para entender tu trayectoria. Los negocios digitales más saludables crecen tanto de la adquisición de nuevos clientes como del aumento de valor entregado a los usuarios existentes simultáneamente.',
  },
  {
    type: 'callout',
    title: 'Escenario Real: El Poder de las Métricas de Retención',
    content:
      'Considera dos negocios digitales, ambos generando $100K en ingresos mensuales. El Negocio A retiene el 120 por ciento de sus ingresos de clientes existentes — gastan 20 por ciento más cada año a través de actualizaciones y uso expandido. El Negocio B retiene solo el 85 por ciento — pierde 15 por ciento de ingresos de clientes existentes cada mes. Después de 12 meses con adquisición de nuevos clientes idéntica, el Negocio A tiene $240K de ingresos mensuales mientras que el Negocio B tiene solo $170K. Para {PROJECT_NAME}, enfócate en construir funcionalidades que aumenten el uso y el valor para {TARGET_AUDIENCE}, impulsando ingresos de expansión junto con la adquisición de nuevos clientes.',
  },
  {
    type: 'callout',
    title: 'Escenario: Métricas de Vanidad vs. Métricas Accionables',
    content:
      'Un fundador reportó orgullosamente 100,000 usuarios registrados para su producto. Pero solo 5,000 estaban activos en los últimos 30 días, y solo 500 eran clientes de pago. El número de usuarios registrados era una métrica de vanidad que enmascaraba serios problemas de activación y conversión. Para {PROJECT_NAME}, enfócate en métricas que impulsen la acción: tasa de activación (qué porcentaje de registros de {TARGET_AUDIENCE} completan el onboarding y experimentan el valor central), frecuencia de engagement (con qué frecuencia la gente usa tu {ENTITY}) y tasa de conversión (qué porcentaje de usuarios gratuitos o de prueba se convierten en clientes de pago). Estas métricas te dicen dónde invertir tus esfuerzos de mejora.',
  },
  {
    type: 'text',
    title: 'Métricas de Engagement y Salud del Producto',
    content:
      'Más allá de los ingresos, {PROJECT_NAME} necesita rastrear métricas que indiquen la salud del producto y el engagement de los usuarios. La tasa de activación mide el porcentaje de nuevos registros que alcanzan el momento "ajá" — el punto donde experimentan el valor central de tu {ENTITY}. Para la mayoría de los productos digitales, esto sucede dentro de la primera sesión o los primeros días. Si tu tasa de activación está por debajo del 40 por ciento, tu onboarding necesita trabajo. Las métricas de usuarios activos como Usuarios Activos Diarios (DAU) y Usuarios Activos Semanales (WAU) miden la intensidad del engagement. La relación DAU-a-WAU, a veces llamada stickiness, indica con qué frecuencia regresan los usuarios. Una relación por encima de 0.6 sugiere un fuerte engagement diario. La tasa de rotación mide el porcentaje de clientes que dejan de usar o pagar por tu producto cada mes. Para emprendimientos en etapa temprana dirigidos a {TARGET_AUDIENCE}, una rotación mensual por debajo del 5 por ciento es aceptable, pero deberías apuntar a menos del 3 por ciento a medida que maduras. Las puntuaciones de satisfacción del cliente como NPS o CSAT proporcionan señales cualitativas que complementan tus datos cuantitativos. Cada una de estas métricas cuenta una parte diferente de la historia, y juntas te dan una imagen completa de cómo está funcionando {PROJECT_NAME}.',
  },
  {
    type: 'tip',
    title: 'Configura Tu Panel de Métricas Temprano',
    content:
      'No esperes hasta que {PROJECT_NAME} tenga miles de usuarios para comenzar a rastrear métricas. Configura un panel simple desde el día uno usando herramientas como PostHog, Mixpanel, Google Analytics o incluso una hoja de cálculo. Rastrea tu métrica de ingresos principal, tasa de activación y rotación semanalmente. Los datos tempranos — incluso de un número pequeño de miembros de {TARGET_AUDIENCE} — revelan patrones que informan decisiones críticas de producto.',
  },
  {
    type: 'warning',
    title: 'Cuidado con las Métricas de Vanidad',
    content:
      'Los registros totales, las vistas de página y los seguidores en redes sociales pueden hacer que {PROJECT_NAME} parezca exitoso sin indicar la salud real del negocio. Siempre acompaña las métricas de la parte superior del embudo con métricas posteriores como activación, retención e ingresos. Si los registros están creciendo pero la activación está estancada, tienes un problema de producto, no de marketing. Enfócate en las métricas que realmente predicen el éxito a largo plazo.',
  },
  {
    type: 'callout',
    title: 'Puntos Clave',
    content:
      'Primero, las métricas de ingresos y retención son los indicadores más importantes para {PROJECT_NAME} como emprendimiento {BUSINESS_TYPE}. Segundo, rastrea la tasa de activación, la frecuencia de engagement y la rotación para entender la salud del producto. Tercero, descompón los ingresos en componentes nuevos, de expansión, de contracción y de rotación para una visión más profunda. Cuarto, evita las métricas de vanidad que se ven bien pero no impulsan decisiones. Quinto, configura un panel de métricas desde el día uno y revísalo semanalmente con tu equipo. Las decisiones basadas en datos ayudarán a {PROJECT_NAME} a crecer eficientemente y servir mejor a {TARGET_AUDIENCE} con el tiempo.',
  },
];


// ============================================================================
// Template Maps & Export Functions
// ============================================================================

// --- SaaS Spanish ---

export const level1SaasSpanishTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: '¿Qué problema resuelve este SaaS?',
    description:
      'Aprende a identificar, validar y articular el problema central que tu producto SaaS aborda.',
    blocks: saasProblemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: '¿Quiénes son tus clientes objetivo?',
    description:
      'Define tus segmentos de clientes ideales, construye perfiles y encuentra adoptadores tempranos.',
    blocks: saasTargetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: '¿Qué hace única a tu solución?',
    description:
      'Descubre tus ventajas competitivas y crea una propuesta de valor única convincente.',
    blocks: saasUniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: '¿Cómo ganarás dinero?',
    description:
      'Explora modelos de ingresos SaaS, estrategias de precios y economía unitaria.',
    blocks: saasMonetizationBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: '¿Cuáles son tus métricas clave?',
    description:
      'Aprende qué KPIs rastrear y cómo construir un negocio SaaS basado en datos.',
    blocks: saasKeyMetricsBlocks,
  },
};

export function getLevel1SaasSpanishTemplates(): Level1LessonTemplate[] {
  return [
    level1SaasSpanishTemplateMap.problem_solved,
    level1SaasSpanishTemplateMap.target_customers,
    level1SaasSpanishTemplateMap.unique_solution,
    level1SaasSpanishTemplateMap.monetization,
    level1SaasSpanishTemplateMap.key_metrics,
  ];
}

// --- E-commerce Spanish ---

export const level1EcommerceSpanishTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: '¿Qué problema resuelve este e-commerce?',
    description:
      'Aprende a identificar, validar y articular el problema central que tu tienda de e-commerce aborda para los compradores.',
    blocks: ecommerceProblemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: '¿Quiénes son tus clientes objetivo?',
    description:
      'Define tus segmentos de compradores ideales, construye perfiles y encuentra adoptadores tempranos para tu tienda online.',
    blocks: ecommerceTargetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: '¿Qué hace única a tu solución?',
    description:
      'Descubre tus ventajas competitivas y crea una propuesta de valor que destaque frente a Amazon y los competidores.',
    blocks: ecommerceUniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: '¿Cómo ganarás dinero?',
    description:
      'Explora modelos de ingresos de e-commerce, estrategias de precios y economía unitaria por pedido.',
    blocks: ecommerceMonetizationBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: '¿Cuáles son tus métricas clave?',
    description:
      'Aprende qué KPIs rastrear — AOV, tasa de conversión, abandono de carrito, CLV — y cómo construir un negocio de e-commerce basado en datos.',
    blocks: ecommerceKeyMetricsBlocks,
  },
};

export function getLevel1EcommerceSpanishTemplates(): Level1LessonTemplate[] {
  return [
    level1EcommerceSpanishTemplateMap.problem_solved,
    level1EcommerceSpanishTemplateMap.target_customers,
    level1EcommerceSpanishTemplateMap.unique_solution,
    level1EcommerceSpanishTemplateMap.monetization,
    level1EcommerceSpanishTemplateMap.key_metrics,
  ];
}

// --- Marketplace Spanish ---

export const level1MarketplaceSpanishTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: '¿Qué problema resuelve este marketplace?',
    description:
      'Aprende a identificar, validar y articular el problema central que tu plataforma de marketplace aborda para compradores y vendedores.',
    blocks: marketplaceProblemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: '¿Quiénes son tus clientes objetivo?',
    description:
      'Define tus segmentos ideales de compradores y vendedores, construye perfiles bilaterales y resuelve el problema del huevo y la gallina.',
    blocks: marketplaceTargetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: '¿Qué hace única a tu solución?',
    description:
      'Descubre tus ventajas competitivas y crea una propuesta de valor convincente para ambos lados de tu mercado bilateral.',
    blocks: marketplaceUniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: '¿Cómo ganarás dinero?',
    description:
      'Explora modelos de ingresos de marketplace, estrategias de comisión y economía unitaria por transacción.',
    blocks: marketplaceMonetizationBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: '¿Cuáles son tus métricas clave?',
    description:
      'Aprende qué KPIs rastrear — GMV, liquidez, tasa de búsqueda-a-completación, salud de red — y cómo construir un negocio de marketplace basado en datos.',
    blocks: marketplaceKeyMetricsBlocks,
  },
};

export function getLevel1MarketplaceSpanishTemplates(): Level1LessonTemplate[] {
  return [
    level1MarketplaceSpanishTemplateMap.problem_solved,
    level1MarketplaceSpanishTemplateMap.target_customers,
    level1MarketplaceSpanishTemplateMap.unique_solution,
    level1MarketplaceSpanishTemplateMap.monetization,
    level1MarketplaceSpanishTemplateMap.key_metrics,
  ];
}

// --- Generic Spanish ---

export const level1GenericSpanishTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: '¿Qué problema resuelve tu negocio?',
    description:
      'Aprende a identificar, validar y articular el problema central que tu negocio digital aborda.',
    blocks: genericProblemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: '¿Quiénes son tus clientes objetivo?',
    description:
      'Define tus segmentos de clientes ideales, construye perfiles y encuentra adoptadores tempranos para tu emprendimiento.',
    blocks: genericTargetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: '¿Qué hace única a tu solución?',
    description:
      'Descubre tus ventajas competitivas y crea una propuesta de valor única convincente para cualquier tipo de negocio.',
    blocks: genericUniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: '¿Cómo ganarás dinero?',
    description:
      'Explora modelos de ingresos, estrategias de precios y economía unitaria para negocios digitales.',
    blocks: genericMonetizationBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: '¿Cuáles son tus métricas clave?',
    description:
      'Aprende qué KPIs rastrear — ingresos, activación, retención, engagement — y cómo construir un negocio basado en datos.',
    blocks: genericKeyMetricsBlocks,
  },
};

export function getLevel1GenericSpanishTemplates(): Level1LessonTemplate[] {
  return [
    level1GenericSpanishTemplateMap.problem_solved,
    level1GenericSpanishTemplateMap.target_customers,
    level1GenericSpanishTemplateMap.unique_solution,
    level1GenericSpanishTemplateMap.monetization,
    level1GenericSpanishTemplateMap.key_metrics,
  ];
}
