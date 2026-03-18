// ============================================================================
// LEVEL 1 GENERIC TEMPLATES - Understanding the Business
// ============================================================================
//
// Comprehensive Level 1 lesson templates for Generic business type.
// Each template generates 5-10 ContentBlock items covering:
//   introduction, explanations, examples, tips, warnings, scenarios, takeaways
// Placeholders: {PROJECT_NAME}, {BUSINESS_TYPE}, {ENTITY}, {TARGET_AUDIENCE}
// ============================================================================

import { ContentBlock } from '../courseTypes';
import { Level1LessonTemplate } from './level1SaasTemplates';

// ---------------------------------------------------------------------------
// Lesson 1: What problem does your business solve?
// ---------------------------------------------------------------------------

const problemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Every successful digital business begins with a clearly defined problem. Before investing time and resources into {PROJECT_NAME}, you need to articulate the exact pain point your {TARGET_AUDIENCE} faces in their daily lives or work. A well-defined problem statement acts as a compass that guides product decisions, marketing messages, and development priorities. In this lesson you will learn how to identify, validate, and communicate the core problem your {BUSINESS_TYPE} venture addresses. We will explore frameworks used by successful founders across industries, examine real-world examples from businesses that started with a sharp problem focus, and give you a repeatable process for refining your problem statement until it resonates with potential customers. By the end of this lesson you will be able to describe the problem in one sentence, explain why existing alternatives fall short, and connect the problem directly to measurable outcomes for your {TARGET_AUDIENCE}. Understanding the problem deeply is the single most important step in building something people actually want to use and pay for.',
  },
  {
    type: 'text',
    title: 'Why Problem Definition Matters',
    content:
      'Many first-time founders skip straight to building features without fully understanding the problem they are solving. This leads to products that are technically impressive but commercially irrelevant. When you define the problem clearly for {PROJECT_NAME}, you create alignment across your entire team: designers know what experiences to simplify, developers know which edge cases matter most, and marketers know which pain points to highlight. A strong problem definition also helps you prioritize your roadmap. Instead of chasing every feature request, you can ask a simple question: "Does this bring us closer to solving the core problem for {TARGET_AUDIENCE}?" If the answer is no, it goes to the backlog. Research consistently shows that the number one reason startups fail is building something nobody needs. That statistic alone should convince you to invest serious time in problem discovery before you invest serious money in development. The problem is your foundation; your product features, growth strategy, revenue model, and customer experience are all built on top of it. Without a clear problem, you risk building a solution in search of a purpose.',
  },
  {
    type: 'text',
    title: 'Frameworks for Problem Discovery',
    content:
      'There are several proven frameworks you can use to uncover and articulate the problem {PROJECT_NAME} solves. The Jobs-to-be-Done framework asks: "What job is {TARGET_AUDIENCE} hiring your product to do?" This shifts focus from features to outcomes. The Five Whys technique helps you drill past surface-level symptoms to find root causes. Start with the obvious complaint and ask "why" five times until you reach the underlying issue. Customer Development interviews, popularized by Steve Blank, involve talking to at least 20 potential users before building anything. During these conversations, listen for recurring frustrations, workarounds, and the language people use to describe their pain. Finally, the Problem-Solution Fit canvas lets you map the problem, existing alternatives, and your unique approach side by side. Whichever framework you choose, the goal is the same: arrive at a problem statement that is specific, measurable, and tied to a real cost — whether that cost is time, money, or missed opportunity for your {TARGET_AUDIENCE}. A vague problem leads to a vague product; a sharp problem leads to a focused, compelling {ENTITY} that people are eager to adopt.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Problem Discovery in Action',
    content:
      'Imagine you are building {PROJECT_NAME}, a {BUSINESS_TYPE} venture for {TARGET_AUDIENCE}. During customer interviews you discover that your users spend an average of 4 hours per week on a manual process that could be streamlined. That is over 200 hours per year per user — a clear, quantifiable pain point. You also learn that existing alternatives only solve part of the problem, forcing users to juggle multiple tools or workarounds. This insight becomes the foundation of your value proposition: "{PROJECT_NAME} eliminates the 4-hour weekly bottleneck by providing a single, integrated {ENTITY} that handles the entire workflow." Notice how the problem statement includes a specific metric, a clear audience, and a hint at the solution.',
  },
  {
    type: 'callout',
    title: 'Scenario: When the Problem Is Not Clear Enough',
    content:
      'Consider a founder who describes the problem as "people need better tools." This is too vague to guide any decision. Compare it with: "{TARGET_AUDIENCE} lose 15% of their productive time because they cannot efficiently manage their core workflow without switching between disconnected tools." The second version is specific, measurable, and immediately suggests what {PROJECT_NAME} should do. If your problem statement sounds like the first example, keep iterating. Talk to more users, gather data, and narrow your focus until the problem is sharp enough to cut through the noise in a competitive {BUSINESS_TYPE} market.',
  },
  {
    type: 'tip',
    title: 'Validate Before You Build',
    content:
      'Before committing to a problem statement for {PROJECT_NAME}, validate it with at least 10 potential users from your {TARGET_AUDIENCE}. Ask open-ended questions like "What is the hardest part of your day?" and listen for patterns. If fewer than 7 out of 10 people mention the same pain point, your problem may not be widespread enough to support a viable {BUSINESS_TYPE} business.',
  },
  {
    type: 'warning',
    title: 'Avoid Solution Bias',
    content:
      'A common mistake is falling in love with your solution before understanding the problem. If you find yourself describing {PROJECT_NAME} in terms of features rather than outcomes, step back and revisit your problem statement. Features change; the core problem your {TARGET_AUDIENCE} faces should remain stable for years. Build for the problem, not for the technology.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, a well-defined problem is the foundation of every successful {BUSINESS_TYPE} venture. Second, use frameworks like Jobs-to-be-Done and Customer Development to uncover the real pain points of {TARGET_AUDIENCE}. Third, your problem statement should be specific, measurable, and tied to a real cost. Fourth, validate the problem with real users before investing in development of {PROJECT_NAME}. Fifth, revisit and refine your problem statement as you learn more from the market. These principles will keep {PROJECT_NAME} focused on delivering genuine value.',
  },
];


// ---------------------------------------------------------------------------
// Lesson 2: Who are your target customers?
// ---------------------------------------------------------------------------

const targetCustomersBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Knowing exactly who your customers are is the difference between a {BUSINESS_TYPE} venture that grows and one that stalls. For {PROJECT_NAME}, defining your target customers means going beyond demographics to understand behaviors, motivations, and buying triggers. In this lesson you will learn how to segment your market, build detailed customer personas, and identify the early adopters most likely to use and pay for your {ENTITY}. We will cover quantitative methods like TAM-SAM-SOM analysis alongside qualitative techniques such as empathy mapping. You will also learn how to prioritize segments so that your limited resources generate maximum impact. By the end of this lesson you will have a clear picture of who {TARGET_AUDIENCE} really is, what drives their decisions, and how to reach them efficiently. This clarity will inform everything from your pricing strategy to your onboarding flow and marketing channels.',
  },
  {
    type: 'text',
    title: 'Market Segmentation for Digital Businesses',
    content:
      'Market segmentation divides your potential users into groups that share common characteristics. For a {BUSINESS_TYPE} venture like {PROJECT_NAME}, the most useful segmentation dimensions include user demographics, behavior patterns, needs intensity, and willingness to pay. Start broad and then narrow down. Your Total Addressable Market (TAM) might include everyone who could theoretically use your product. Your Serviceable Addressable Market (SAM) narrows that to users you can realistically reach with your current go-to-market strategy. Your Serviceable Obtainable Market (SOM) is the slice you can capture in the next 12 to 18 months. For {PROJECT_NAME}, focus your initial efforts on the SOM — the segment where your product-market fit is strongest and where {TARGET_AUDIENCE} is already actively looking for solutions. Trying to serve everyone at once is the fastest way to serve no one well. A focused approach lets you build deep expertise in one segment before expanding to adjacent ones.',
  },
  {
    type: 'text',
    title: 'Building Customer Personas',
    content:
      'A customer persona is a semi-fictional representation of your ideal user based on real data and educated assumptions. For {PROJECT_NAME}, create two to three personas that represent distinct segments of {TARGET_AUDIENCE}. Each persona should include a name, role or situation, goals, frustrations, preferred channels, and decision-making factors. Go beyond surface-level attributes: what does this person worry about? What metrics or outcomes matter most to them? What would make them a champion of your product within their organization or community? The answers to these questions will shape your messaging, feature priorities, and even your user interface design. Remember that personas are living documents — update them as you gather more data from real users of {PROJECT_NAME}. A persona that was accurate at launch may drift as your product and market evolve. The best personas are grounded in real conversations, not assumptions made in a conference room.',
  },
  {
    type: 'callout',
    title: 'Example: Building a Customer Persona',
    content:
      'Meet "Efficient Emma," a mid-level professional who manages a small team. She spends 3 hours daily on repetitive tasks and is evaluated on team productivity metrics. She has budget authority for tools under $500 per month and prefers solutions that integrate with her existing workflow. Emma represents a key segment of {TARGET_AUDIENCE} for {PROJECT_NAME}. She is tech-savvy enough to adopt new tools but not technical enough to build her own solution. Her pain point aligns perfectly with what {PROJECT_NAME} offers, making her an ideal early adopter for your {BUSINESS_TYPE} venture.',
  },
  {
    type: 'callout',
    title: 'Scenario: Choosing the Wrong Segment',
    content:
      'A founder built a productivity tool targeting large enterprises with 10,000-plus employees. The sales cycle was 9 months, the product required extensive customization, and the founder ran out of runway before closing a single deal. Had they started with small teams of 5 to 20 people — a segment with shorter decision cycles and simpler needs — they could have iterated faster and built revenue sooner. For {PROJECT_NAME}, start with the segment of {TARGET_AUDIENCE} that can say "yes" the fastest and expand from there. Speed of adoption matters more than size of the initial market.',
  },
  {
    type: 'tip',
    title: 'Start With Early Adopters',
    content:
      'Early adopters are users who actively seek new solutions and tolerate imperfections. For {PROJECT_NAME}, look for {TARGET_AUDIENCE} members who are already using workarounds like spreadsheets, manual processes, or cobbled-together tools. These people feel the pain most acutely and are willing to try a new {ENTITY} even before it is fully polished. They will also give you the most valuable feedback.',
  },
  {
    type: 'warning',
    title: 'Do Not Target Everyone',
    content:
      'Saying "{PROJECT_NAME} is for everyone" is the same as saying it is for no one. A {BUSINESS_TYPE} venture that tries to serve all segments simultaneously ends up with a bloated feature set, confused messaging, and high churn. Pick one or two segments of {TARGET_AUDIENCE} and serve them exceptionally well before expanding. Depth beats breadth in the early stages.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, segment your market using dimensions relevant to your {BUSINESS_TYPE} venture: demographics, behavior, needs, and willingness to pay. Second, build detailed personas based on real conversations with {TARGET_AUDIENCE}. Third, focus your initial go-to-market on the Serviceable Obtainable Market where {PROJECT_NAME} has the strongest fit. Fourth, target early adopters who are already using workarounds. Fifth, resist the urge to serve everyone at once — depth beats breadth in the early stages of any digital business.',
  },
];


// ---------------------------------------------------------------------------
// Lesson 3: What makes your solution unique?
// ---------------------------------------------------------------------------

const uniqueSolutionBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'In a crowded digital landscape, having a good product is not enough — you need a product that stands out. Your unique value proposition (UVP) is the reason {TARGET_AUDIENCE} will choose {PROJECT_NAME} over every alternative, including doing nothing at all. In this lesson you will learn how to identify your competitive advantages, articulate them clearly, and embed them into every aspect of your product and marketing. We will examine differentiation strategies used by successful digital businesses, explore positioning frameworks, and help you craft a UVP that resonates with your ideal customers. By the end of this lesson you will be able to explain in one sentence why {PROJECT_NAME} is the best choice for {TARGET_AUDIENCE}, and you will have a framework for maintaining that differentiation as competitors evolve. Your UVP is not a tagline — it is a strategic decision that shapes your entire {BUSINESS_TYPE} venture.',
  },
  {
    type: 'text',
    title: 'Understanding Competitive Differentiation',
    content:
      'Differentiation in the {BUSINESS_TYPE} space can come from many sources: technology, user experience, pricing, integrations, customer support, or domain expertise. For {PROJECT_NAME}, start by mapping the competitive landscape. List every alternative your {TARGET_AUDIENCE} currently uses — including manual processes, spreadsheets, free tools, and competing products. For each alternative, note its strengths and weaknesses. Then identify the gaps: where do existing solutions fall short? These gaps are your opportunities. Differentiation does not mean being different in every way; it means being meaningfully better in the ways that matter most to your customers. A product that is 10 percent better across the board will struggle against one that is 10 times better in one critical dimension. Find your 10x dimension and build {PROJECT_NAME} around it. This focused approach also makes your marketing message clearer and your growth conversations more compelling.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Finding Your 10x Advantage',
    content:
      'Consider how successful digital businesses differentiate in crowded markets. They do not try to be better at everything. Instead, they focus on one or two dimensions that existing solutions handle poorly — perhaps speed, simplicity, or a specific workflow that competitors overlook. For {PROJECT_NAME}, ask yourself: what is the one thing {TARGET_AUDIENCE} cares about most that no competitor does well? That is where you should concentrate your development and design resources. Your {ENTITY} should be the obvious choice for that specific need, even if competitors offer more features overall.',
  },
  {
    type: 'callout',
    title: 'Scenario: Positioning Against Established Competitors',
    content:
      'When {PROJECT_NAME} enters a market with established players, avoid competing on their terms. If the market leader wins on features, compete on simplicity. If they win on price, compete on specialization. Position {PROJECT_NAME} as the best solution for a specific subset of {TARGET_AUDIENCE} rather than a general-purpose tool. This wedge strategy lets you build a loyal user base in a niche before expanding. Many of the most successful digital businesses started by dominating a narrow segment before broadening their appeal to adjacent markets.',
  },
  {
    type: 'text',
    title: 'Crafting Your Unique Value Proposition',
    content:
      'A strong UVP follows a simple formula: "For [target customer] who [has this problem], {PROJECT_NAME} is a [category] that [key benefit]. Unlike [competitors], {PROJECT_NAME} [unique differentiator]." This template forces you to be specific about every element. Fill it in with real data from your customer research. Test it with members of {TARGET_AUDIENCE} and iterate until it clicks. A good UVP should pass the "so what?" test — if a potential customer reads it and shrugs, it is not specific enough. It should also pass the "prove it" test — every claim should be backed by evidence, whether that is a metric, a testimonial, or a product demo. Your UVP will appear on your landing page, in your pitch decks, and in every conversation your team has with prospects. Make sure it is sharp, honest, and memorable for anyone evaluating your {ENTITY}.',
  },
  {
    type: 'tip',
    title: 'Test Your UVP With Real Users',
    content:
      'Show your UVP to five members of {TARGET_AUDIENCE} and ask them to repeat it back in their own words. If they cannot, it is too complex. If they add details you did not include, those details might belong in your UVP. This simple test costs nothing and can save {PROJECT_NAME} months of misaligned messaging.',
  },
  {
    type: 'warning',
    title: 'Do Not Differentiate on Price Alone',
    content:
      'Competing on price is a race to the bottom. There will always be a cheaper alternative or a free option. Instead, differentiate {PROJECT_NAME} on value delivered to {TARGET_AUDIENCE}. If your {ENTITY} saves users significant time or money, the price becomes a fraction of the value created. Sustainable businesses compete on value, not cost.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, differentiation is about being meaningfully better in the ways that matter most to {TARGET_AUDIENCE}. Second, map the competitive landscape and identify gaps that {PROJECT_NAME} can fill. Third, find your 10x advantage — the one dimension where you are dramatically better than alternatives. Fourth, craft a UVP using the formula and test it with real users. Fifth, avoid competing on price alone; compete on the unique value your {ENTITY} delivers. These principles will help {PROJECT_NAME} stand out in a competitive {BUSINESS_TYPE} landscape.',
  },
];


// ---------------------------------------------------------------------------
// Lesson 4: How will you make money?
// ---------------------------------------------------------------------------

const makeMoneyBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Revenue is the lifeblood of any {BUSINESS_TYPE} venture. For {PROJECT_NAME}, choosing the right monetization strategy is as important as building the right product. In this lesson you will explore the most common revenue models for digital businesses, learn how to calculate unit economics, and develop a pricing strategy that aligns with the value you deliver to {TARGET_AUDIENCE}. We will cover subscriptions, one-time purchases, usage-based pricing, freemium models, and hybrid approaches. You will also learn about key financial metrics every founder must track, including revenue growth rate, Customer Acquisition Cost (CAC), and Lifetime Value (LTV). By the end of this lesson you will have a clear monetization plan for {PROJECT_NAME} that balances growth with profitability. Getting pricing right from the start can accelerate your path to product-market fit, while getting it wrong can stall even the best products.',
  },
  {
    type: 'text',
    title: 'Revenue Models for Digital Businesses',
    content:
      'The most common revenue models for digital businesses are subscription-based, transaction-based, usage-based, and freemium. Subscription pricing charges a recurring fee for access to your {ENTITY}. This model provides predictable revenue and is easy for customers to budget. Transaction-based pricing charges a fee or commission each time a user completes an action or purchase. Usage-based pricing charges based on consumption — API calls, storage, active users, or volume processed. This model aligns cost with value but can make revenue less predictable. Freemium offers a free tier with limited functionality and charges for premium features. This model lowers the barrier to entry and can drive organic growth, but conversion rates from free to paid typically range from 2 to 5 percent. For {PROJECT_NAME}, consider which model best matches how {TARGET_AUDIENCE} derives value from your product. If value is ongoing, recurring pricing makes sense. If value is tied to specific actions, transaction-based pricing may be better. Many successful digital businesses use hybrid models that combine elements of multiple approaches to capture value at different stages of the customer journey.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Choosing a Pricing Model',
    content:
      'Imagine {PROJECT_NAME} offers three tiers: a Basic plan at $19 per month for individuals, a Professional plan at $49 per month for small teams, and a Business plan at $129 per month for growing organizations. Each tier unlocks more features and higher usage limits. The Basic tier serves as a low-risk entry point for {TARGET_AUDIENCE}, while the Business tier captures more value from power users. This structure lets {PROJECT_NAME} grow revenue per account over time as customers upgrade — a pattern known as expansion revenue, which is one of the most efficient forms of growth for any {BUSINESS_TYPE} venture.',
  },
  {
    type: 'callout',
    title: 'Scenario: The Freemium Trap',
    content:
      'A founder launched with a generous free tier that included 90 percent of the product functionality. Users loved the free version but had no reason to upgrade. The company acquired 50,000 free users but only 200 paying customers — a 0.4 percent conversion rate that could not sustain the business. For {PROJECT_NAME}, design your free tier carefully: it should demonstrate value to {TARGET_AUDIENCE} while creating a clear incentive to upgrade. The free tier is a marketing tool, not the product itself. Give users enough to experience the core value of your {ENTITY}, but reserve the features that drive serious outcomes for paid plans.',
  },
  {
    type: 'text',
    title: 'Unit Economics: CAC, LTV, and Payback Period',
    content:
      'Unit economics determine whether your {BUSINESS_TYPE} venture is financially viable. Customer Acquisition Cost (CAC) is the total cost of acquiring one paying customer, including marketing, sales, and onboarding expenses. Lifetime Value (LTV) is the total revenue you expect from a customer over their entire relationship with {PROJECT_NAME}. The LTV-to-CAC ratio should be at least 3 to 1 for a healthy business — meaning each customer generates three times more revenue than it costs to acquire them. The payback period is how long it takes to recoup the CAC from a single customer. For most digital businesses, a payback period under 12 months is considered good. Track these metrics from day one for {PROJECT_NAME}. Even rough estimates will help you make better decisions about where to invest your marketing budget and how aggressively to pursue growth among {TARGET_AUDIENCE}. Understanding your unit economics early prevents the common trap of growing fast while losing money on every customer.',
  },
  {
    type: 'tip',
    title: 'Price Based on Value, Not Cost',
    content:
      'Do not set prices for {PROJECT_NAME} based on what it costs you to deliver the {ENTITY}. Instead, price based on the value {TARGET_AUDIENCE} receives. If your product saves a customer significant time or money each month, charging a fraction of that value is a bargain — and you have room to increase prices as you add more value over time.',
  },
  {
    type: 'warning',
    title: 'Do Not Undercharge',
    content:
      'Many founders set prices too low out of fear that {TARGET_AUDIENCE} will not pay. Low prices signal low value and attract price-sensitive customers who churn quickly. It is easier to lower prices than to raise them. Start higher than you think is right for {PROJECT_NAME} and adjust based on conversion data and customer feedback.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, choose a revenue model that aligns with how {TARGET_AUDIENCE} derives value from {PROJECT_NAME}. Second, design pricing tiers that create a clear upgrade path from basic to premium. Third, if using freemium, ensure the free tier demonstrates value without giving away the core product. Fourth, track unit economics — LTV, CAC, and payback period — from day one. Fifth, price based on value delivered, not cost incurred. These monetization principles will help {PROJECT_NAME} build a sustainable {BUSINESS_TYPE} business.',
  },
];


// ---------------------------------------------------------------------------
// Lesson 5: What are your key metrics?
// ---------------------------------------------------------------------------

const keyMetricsBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'What gets measured gets managed. For {PROJECT_NAME}, tracking the right metrics is essential to understanding whether your {BUSINESS_TYPE} venture is healthy and growing. In this lesson you will learn about the key performance indicators (KPIs) every founder must monitor, how to set up a metrics dashboard, and how to use data to make better decisions. We will cover revenue metrics like monthly and annual recurring revenue, growth metrics like activation and retention rates, and efficiency metrics that reveal whether your growth is sustainable. You will also learn how to avoid vanity metrics — numbers that look impressive but do not correlate with business success. By the end of this lesson you will have a clear metrics framework for {PROJECT_NAME} that tells you exactly how your product is performing with {TARGET_AUDIENCE} and where to focus your improvement efforts. Data-driven decision making is what separates ventures that scale from those that stall.',
  },
  {
    type: 'text',
    title: 'Revenue and Growth Metrics',
    content:
      'Revenue metrics are the most important indicators for any {BUSINESS_TYPE} venture. If your model is recurring, Monthly Recurring Revenue (MRR) represents the predictable revenue {PROJECT_NAME} generates each month. If your model is transactional, track Gross Revenue and Net Revenue after refunds and chargebacks. Beyond raw revenue, Net Revenue Retention (NRR) measures how much revenue you retain from existing customers after accounting for churn, downgrades, and expansion. An NRR above 100 percent means your existing customer base is growing even without new acquisitions — a powerful indicator of product-market fit. For {PROJECT_NAME}, track revenue broken down by new revenue, expansion revenue, contraction, and churn. This decomposition reveals whether growth is coming from acquiring new {TARGET_AUDIENCE} members or from delivering more value to existing customers. Growth rate itself matters too: track month-over-month and year-over-year growth to understand your trajectory. The healthiest digital businesses grow from both new customer acquisition and increased value delivery to existing users simultaneously.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: The Power of Retention Metrics',
    content:
      'Consider two digital businesses, both generating $100K in monthly revenue. Business A retains 120 percent of its revenue from existing customers — they spend 20 percent more each year through upgrades and expanded usage. Business B retains only 85 percent — it loses 15 percent of revenue from existing customers each month. After 12 months with identical new customer acquisition, Business A has $240K monthly revenue while Business B has only $170K. For {PROJECT_NAME}, focus on building features that increase usage and value for {TARGET_AUDIENCE}, driving expansion revenue alongside new customer acquisition.',
  },
  {
    type: 'callout',
    title: 'Scenario: Vanity Metrics vs. Actionable Metrics',
    content:
      'A founder proudly reported 100,000 registered users for their product. But only 5,000 were active in the last 30 days, and only 500 were paying customers. The registered users number was a vanity metric that masked serious activation and conversion problems. For {PROJECT_NAME}, focus on metrics that drive action: activation rate (what percentage of signups from {TARGET_AUDIENCE} complete onboarding and experience core value), engagement frequency (how often people use your {ENTITY}), and conversion rate (what percentage of free or trial users become paying customers). These metrics tell you where to invest your improvement efforts.',
  },
  {
    type: 'text',
    title: 'Engagement and Product Health Metrics',
    content:
      'Beyond revenue, {PROJECT_NAME} needs to track metrics that indicate product health and user engagement. Activation rate measures the percentage of new signups who reach the "aha moment" — the point where they experience the core value of your {ENTITY}. For most digital products, this happens within the first session or first few days. If your activation rate is below 40 percent, your onboarding needs work. Active user metrics like Daily Active Users (DAU) and Weekly Active Users (WAU) measure engagement intensity. The DAU-to-WAU ratio, sometimes called stickiness, indicates how often users return. A ratio above 0.6 suggests strong daily engagement. Churn rate measures the percentage of customers who stop using or paying for your product each month. For early-stage ventures targeting {TARGET_AUDIENCE}, monthly churn below 5 percent is acceptable, but you should aim for below 3 percent as you mature. Customer satisfaction scores like NPS or CSAT provide qualitative signals that complement your quantitative data. Each of these metrics tells a different part of the story, and together they give you a complete picture of how {PROJECT_NAME} is performing.',
  },
  {
    type: 'tip',
    title: 'Set Up Your Metrics Dashboard Early',
    content:
      'Do not wait until {PROJECT_NAME} has thousands of users to start tracking metrics. Set up a simple dashboard from day one using tools like PostHog, Mixpanel, Google Analytics, or even a spreadsheet. Track your core revenue metric, activation rate, and churn weekly. Early data — even from a small number of {TARGET_AUDIENCE} members — reveals patterns that inform critical product decisions.',
  },
  {
    type: 'warning',
    title: 'Beware of Vanity Metrics',
    content:
      'Total signups, page views, and social media followers can make {PROJECT_NAME} look successful without indicating real business health. Always pair top-of-funnel metrics with downstream metrics like activation, retention, and revenue. If signups are growing but activation is flat, you have a product problem, not a marketing problem. Focus on the metrics that actually predict long-term success.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, revenue and retention metrics are the most important indicators for {PROJECT_NAME} as a {BUSINESS_TYPE} venture. Second, track activation rate, engagement frequency, and churn to understand product health. Third, decompose revenue into new, expansion, contraction, and churned components for deeper insight. Fourth, avoid vanity metrics that look good but do not drive decisions. Fifth, set up a metrics dashboard from day one and review it weekly with your team. Data-driven decisions will help {PROJECT_NAME} grow efficiently and serve {TARGET_AUDIENCE} better over time.',
  },
];


// ============================================================================
// Template Map & Export Function
// ============================================================================

/**
 * All Level 1 Generic lesson templates keyed by topic slug.
 */
export const level1GenericTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: 'What problem does your business solve?',
    description:
      'Learn how to identify, validate, and articulate the core problem your digital business addresses.',
    blocks: problemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: 'Who are your target customers?',
    description:
      'Define your ideal customer segments, build personas, and identify early adopters for your venture.',
    blocks: targetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: 'What makes your solution unique?',
    description:
      'Discover your competitive advantages and craft a compelling unique value proposition for any business type.',
    blocks: uniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: 'How will you make money?',
    description:
      'Explore revenue models, pricing strategies, and unit economics for digital businesses.',
    blocks: makeMoneyBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: 'What are your key metrics?',
    description:
      'Learn which KPIs to track — revenue, activation, retention, engagement — and how to build a data-driven business.',
    blocks: keyMetricsBlocks,
  },
};

/**
 * Return the ordered list of Level 1 Generic lesson templates.
 * Each template contains 5-10 ContentBlock items ready for placeholder substitution.
 */
export function getLevel1GenericTemplates(): Level1LessonTemplate[] {
  return [
    level1GenericTemplateMap.problem_solved,
    level1GenericTemplateMap.target_customers,
    level1GenericTemplateMap.unique_solution,
    level1GenericTemplateMap.monetization,
    level1GenericTemplateMap.key_metrics,
  ];
}

/**
 * Retrieve a single Level 1 Generic template by topic slug.
 * Returns undefined when the topic is not found.
 */
export function getLevel1GenericTemplate(topic: string): Level1LessonTemplate | undefined {
  return level1GenericTemplateMap[topic];
}
