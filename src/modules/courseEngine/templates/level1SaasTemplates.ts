// ============================================================================
// LEVEL 1 SAAS TEMPLATES - Understanding the Business
// ============================================================================
//
// Comprehensive Level 1 lesson templates for SaaS business type.
// Each template generates 5-10 ContentBlock items covering:
//   introduction, explanations, examples, tips, warnings, scenarios, takeaways
// Placeholders: {PROJECT_NAME}, {BUSINESS_TYPE}, {ENTITY}, {TARGET_AUDIENCE}
// ============================================================================

import { ContentBlock } from '../courseTypes';

export interface Level1LessonTemplate {
  topic: string;
  title: string;
  description: string;
  blocks: ContentBlock[];
}

// ---------------------------------------------------------------------------
// Lesson 1: What problem does this SaaS solve?
// ---------------------------------------------------------------------------

const problemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Every successful SaaS product begins with a clearly defined problem. Before writing a single line of code for {PROJECT_NAME}, you need to articulate the exact pain point your {TARGET_AUDIENCE} faces every day. A well-defined problem statement acts as a compass that guides product decisions, marketing messages, and engineering priorities. In this lesson you will learn how to identify, validate, and communicate the core problem your {BUSINESS_TYPE} product addresses. We will explore frameworks used by leading SaaS founders, examine real-world examples, and give you a repeatable process for refining your problem statement until it resonates with potential customers. By the end of this lesson you will be able to describe the problem in one sentence, explain why existing solutions fall short, and connect the problem directly to measurable business outcomes for your {TARGET_AUDIENCE}. Understanding the problem deeply is the single most important step in building a product people actually want to pay for.',
  },
  {
    type: 'text',
    title: 'Why Problem Definition Matters',
    content:
      'Many first-time SaaS founders skip straight to building features without fully understanding the problem they are solving. This leads to products that are technically impressive but commercially irrelevant. When you define the problem clearly for {PROJECT_NAME}, you create alignment across your entire team: designers know what workflows to simplify, engineers know which edge cases matter most, and marketers know which pain points to highlight. A strong problem definition also helps you prioritize your roadmap. Instead of chasing every feature request, you can ask a simple question: "Does this bring us closer to solving the core problem for {TARGET_AUDIENCE}?" If the answer is no, it goes to the backlog. Research from CB Insights shows that 35% of startups fail because there is no market need. That statistic alone should convince you to invest serious time in problem discovery before you invest serious money in development. The problem is your foundation; everything else is built on top of it.',
  },
  {
    type: 'text',
    title: 'Frameworks for Problem Discovery',
    content:
      'There are several proven frameworks you can use to uncover and articulate the problem {PROJECT_NAME} solves. The Jobs-to-be-Done framework asks: "What job is {TARGET_AUDIENCE} hiring your product to do?" This shifts focus from features to outcomes. The Five Whys technique helps you drill past surface-level symptoms to find root causes. Start with the obvious complaint and ask "why" five times until you reach the underlying issue. Customer Development interviews, popularized by Steve Blank, involve talking to at least 20 potential users before building anything. During these conversations, listen for recurring frustrations, workarounds, and the language people use to describe their pain. Finally, the Problem-Solution Fit canvas lets you map the problem, existing alternatives, and your unique approach side by side. Whichever framework you choose, the goal is the same: arrive at a problem statement that is specific, measurable, and tied to a real cost — whether that cost is time, money, or missed opportunity for your {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: SaaS Problem Discovery',
    content:
      'Imagine you are building {PROJECT_NAME}, a {BUSINESS_TYPE} product for {TARGET_AUDIENCE}. During customer interviews you discover that your users spend an average of 5 hours per week on a manual process that could be automated. That is 260 hours per year per user — a clear, quantifiable pain point. You also learn that existing tools only solve part of the problem, forcing users to switch between three different applications. This insight becomes the foundation of your value proposition: "{PROJECT_NAME} eliminates the 5-hour weekly bottleneck by combining all three workflows into a single {ENTITY}." Notice how the problem statement includes a specific metric, a clear audience, and a hint at the solution.',
  },
  {
    type: 'callout',
    title: 'Scenario: When the Problem Is Not Clear Enough',
    content:
      'Consider a founder who describes the problem as "businesses need better software." This is too vague to guide any decision. Compare it with: "{TARGET_AUDIENCE} lose 20% of potential revenue because they cannot track customer engagement across channels in real time." The second version is specific, measurable, and immediately suggests what {PROJECT_NAME} should do. If your problem statement sounds like the first example, keep iterating. Talk to more users, gather data, and narrow your focus until the problem is sharp enough to cut through the noise in a crowded {BUSINESS_TYPE} market.',
  },
  {
    type: 'tip',
    title: 'Validate Before You Build',
    content:
      'Before committing to a problem statement for {PROJECT_NAME}, validate it with at least 10 potential users from your {TARGET_AUDIENCE}. Ask open-ended questions like "What is the hardest part of your day?" and listen for patterns. If fewer than 7 out of 10 people mention the same pain point, your problem may not be widespread enough to support a {BUSINESS_TYPE} business.',
  },
  {
    type: 'warning',
    title: 'Avoid Solution Bias',
    content:
      'A common mistake is falling in love with your solution before understanding the problem. If you find yourself describing {PROJECT_NAME} in terms of features rather than outcomes, step back and revisit your problem statement. Features change; the core problem your {TARGET_AUDIENCE} faces should remain stable for years.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, a well-defined problem is the foundation of every successful {BUSINESS_TYPE} product. Second, use frameworks like Jobs-to-be-Done and Customer Development to uncover the real pain points of {TARGET_AUDIENCE}. Third, your problem statement should be specific, measurable, and tied to a real cost. Fourth, validate the problem with real users before investing in development of {PROJECT_NAME}. Fifth, revisit and refine your problem statement as you learn more from the market. These principles will keep {PROJECT_NAME} focused on delivering genuine value.',
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
      'Knowing exactly who your customers are is the difference between a {BUSINESS_TYPE} product that grows and one that stalls. For {PROJECT_NAME}, defining your target customers means going beyond demographics to understand behaviors, motivations, and buying triggers. In this lesson you will learn how to segment your market, build detailed customer personas, and identify the early adopters most likely to pay for your {ENTITY}. We will cover quantitative methods like TAM-SAM-SOM analysis alongside qualitative techniques such as empathy mapping. You will also learn how to prioritize segments so that your limited resources generate maximum impact. By the end of this lesson you will have a clear picture of who {TARGET_AUDIENCE} really is, what drives their purchasing decisions, and how to reach them efficiently. This clarity will inform everything from your pricing strategy to your onboarding flow.',
  },
  {
    type: 'text',
    title: 'Market Segmentation for SaaS',
    content:
      'Market segmentation divides your potential users into groups that share common characteristics. For a {BUSINESS_TYPE} product like {PROJECT_NAME}, the most useful segmentation dimensions are company size, industry vertical, job role, and current tech stack. Start broad and then narrow down. Your Total Addressable Market (TAM) might include every company that could theoretically use your product. Your Serviceable Addressable Market (SAM) narrows that to companies you can realistically reach with your current go-to-market strategy. Your Serviceable Obtainable Market (SOM) is the slice you can capture in the next 12 to 18 months. For {PROJECT_NAME}, focus your initial efforts on the SOM — the segment where your product-market fit is strongest and where {TARGET_AUDIENCE} is already actively looking for solutions. Trying to serve everyone at once is the fastest way to serve no one well.',
  },
  {
    type: 'text',
    title: 'Building Customer Personas',
    content:
      'A customer persona is a semi-fictional representation of your ideal user based on real data and educated assumptions. For {PROJECT_NAME}, create two to three personas that represent distinct segments of {TARGET_AUDIENCE}. Each persona should include a name, job title, company size, goals, frustrations, preferred communication channels, and decision-making authority. Go beyond surface-level attributes: what does this person worry about on Sunday night before the work week starts? What metrics is their boss tracking? What would make them a hero in their organization? The answers to these questions will shape your messaging, feature priorities, and even your UI design. Remember that personas are living documents — update them as you gather more data from real users of {PROJECT_NAME}. A persona that was accurate at launch may drift as your product and market evolve.',
  },
  {
    type: 'callout',
    title: 'Example: SaaS Customer Persona',
    content:
      'Meet "Operations Olivia," a mid-level operations manager at a 50-person company. She spends 3 hours daily on manual reporting and is evaluated on team efficiency metrics. She has budget authority up to $500/month and prefers tools that integrate with her existing stack. Olivia represents a key segment of {TARGET_AUDIENCE} for {PROJECT_NAME}. She is tech-savvy enough to adopt new tools but not technical enough to build her own solution. Her pain point aligns perfectly with what {PROJECT_NAME} offers, making her an ideal early adopter for your {BUSINESS_TYPE} product.',
  },
  {
    type: 'callout',
    title: 'Scenario: Choosing the Wrong Segment',
    content:
      'A SaaS founder built a project management tool targeting enterprise companies with 10,000+ employees. The sales cycle was 9 months, the product required extensive customization, and the founder ran out of runway before closing a single deal. Had they started with small teams of 5 to 20 people — a segment with shorter sales cycles and simpler needs — they could have iterated faster and built revenue sooner. For {PROJECT_NAME}, start with the segment of {TARGET_AUDIENCE} that can say "yes" the fastest and expand from there.',
  },
  {
    type: 'tip',
    title: 'Start With Early Adopters',
    content:
      'Early adopters are users who actively seek new solutions and tolerate imperfections. For {PROJECT_NAME}, look for {TARGET_AUDIENCE} members who are already using workarounds like spreadsheets, manual processes, or cobbled-together tools. These people feel the pain most acutely and are willing to try a new {ENTITY} even before it is fully polished.',
  },
  {
    type: 'warning',
    title: 'Do Not Target Everyone',
    content:
      'Saying "{PROJECT_NAME} is for everyone" is the same as saying it is for no one. A {BUSINESS_TYPE} product that tries to serve all segments simultaneously ends up with a bloated feature set, confused messaging, and high churn. Pick one or two segments of {TARGET_AUDIENCE} and serve them exceptionally well before expanding.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, segment your market using dimensions relevant to {BUSINESS_TYPE}: company size, industry, role, and tech stack. Second, build detailed personas based on real conversations with {TARGET_AUDIENCE}. Third, focus your initial go-to-market on the Serviceable Obtainable Market where {PROJECT_NAME} has the strongest fit. Fourth, target early adopters who are already using workarounds. Fifth, resist the urge to serve everyone at once — depth beats breadth in the early stages of a SaaS business.',
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
      'In a crowded {BUSINESS_TYPE} market, having a good product is not enough — you need a product that stands out. Your unique value proposition (UVP) is the reason {TARGET_AUDIENCE} will choose {PROJECT_NAME} over every alternative, including doing nothing. In this lesson you will learn how to identify your competitive advantages, articulate them clearly, and embed them into every aspect of your product and marketing. We will examine differentiation strategies used by successful SaaS companies, explore positioning frameworks, and help you craft a UVP that resonates with your ideal customers. By the end of this lesson you will be able to explain in one sentence why {PROJECT_NAME} is the best choice for {TARGET_AUDIENCE}, and you will have a framework for maintaining that differentiation as competitors evolve. Your UVP is not a tagline — it is a strategic decision that shapes your entire business.',
  },
  {
    type: 'text',
    title: 'Understanding Competitive Differentiation',
    content:
      'Differentiation in {BUSINESS_TYPE} can come from many sources: technology, user experience, pricing, integrations, customer support, or domain expertise. For {PROJECT_NAME}, start by mapping the competitive landscape. List every alternative your {TARGET_AUDIENCE} currently uses — including spreadsheets, manual processes, and competing SaaS products. For each alternative, note its strengths and weaknesses. Then identify the gaps: where do existing solutions fall short? These gaps are your opportunities. Differentiation does not mean being different in every way; it means being meaningfully better in the ways that matter most to your customers. A SaaS product that is 10% better across the board will struggle against one that is 10x better in one critical dimension. Find your 10x dimension and build {PROJECT_NAME} around it. This focused approach also makes your marketing message clearer and your sales conversations more compelling.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Finding Your 10x Advantage',
    content:
      'Consider how Slack differentiated in the crowded messaging market. Email was the incumbent, and dozens of chat tools existed. Slack did not try to be better at everything. Instead, it focused on integrations and searchability — two pain points that existing tools handled poorly. For {PROJECT_NAME}, ask yourself: what is the one thing {TARGET_AUDIENCE} cares about most that no competitor does well? That is where you should concentrate your engineering and design resources. Your {ENTITY} should be the obvious choice for that specific need.',
  },
  {
    type: 'callout',
    title: 'Scenario: Positioning Against Established Competitors',
    content:
      'When {PROJECT_NAME} enters a market with established players, avoid competing on their terms. If the market leader wins on features, compete on simplicity. If they win on price, compete on specialization. Position {PROJECT_NAME} as the best solution for a specific subset of {TARGET_AUDIENCE} rather than a general-purpose tool. This "wedge" strategy lets you build a loyal user base in a niche before expanding. Remember, even Salesforce started by targeting small sales teams before becoming an enterprise platform.',
  },
  {
    type: 'text',
    title: 'Crafting Your Unique Value Proposition',
    content:
      'A strong UVP follows a simple formula: "For [target customer] who [has this problem], {PROJECT_NAME} is a [category] that [key benefit]. Unlike [competitors], {PROJECT_NAME} [unique differentiator]." This template forces you to be specific about every element. Fill it in with real data from your customer research. Test it with members of {TARGET_AUDIENCE} and iterate until it clicks. A good UVP should pass the "so what?" test — if a potential customer reads it and shrugs, it is not specific enough. It should also pass the "prove it" test — every claim should be backed by evidence, whether that is a metric, a testimonial, or a product demo. Your UVP will appear on your landing page, in your sales decks, and in every conversation your team has with prospects. Make sure it is sharp, honest, and memorable.',
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
      'Competing on price in {BUSINESS_TYPE} is a race to the bottom. There will always be a cheaper alternative or a free open-source option. Instead, differentiate {PROJECT_NAME} on value delivered to {TARGET_AUDIENCE}. If your product saves users 10 hours per week, the price becomes a fraction of the value created.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, differentiation is about being meaningfully better in the ways that matter most to {TARGET_AUDIENCE}. Second, map the competitive landscape and identify gaps that {PROJECT_NAME} can fill. Third, find your 10x advantage — the one dimension where you are dramatically better than alternatives. Fourth, craft a UVP using the formula and test it with real users. Fifth, avoid competing on price alone; compete on the unique value your {ENTITY} delivers. These principles will help {PROJECT_NAME} stand out in a crowded {BUSINESS_TYPE} market.',
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
      'Revenue is the lifeblood of any {BUSINESS_TYPE} business. For {PROJECT_NAME}, choosing the right monetization strategy is as important as building the right product. In this lesson you will explore the most common SaaS revenue models, learn how to calculate unit economics, and develop a pricing strategy that aligns with the value you deliver to {TARGET_AUDIENCE}. We will cover subscription tiers, usage-based pricing, freemium models, and hybrid approaches. You will also learn about key financial metrics every SaaS founder must track, including Monthly Recurring Revenue (MRR), Customer Acquisition Cost (CAC), and Lifetime Value (LTV). By the end of this lesson you will have a clear monetization plan for {PROJECT_NAME} that balances growth with profitability. Getting pricing right from the start can accelerate your path to product-market fit, while getting it wrong can stall even the best products.',
  },
  {
    type: 'text',
    title: 'SaaS Revenue Models Explained',
    content:
      'The most common SaaS revenue models are subscription-based, usage-based, and freemium. Subscription pricing charges a fixed monthly or annual fee for access to your {ENTITY}. This model provides predictable revenue and is easy for customers to budget. Usage-based pricing charges based on consumption — API calls, storage, active users, or transactions. This model aligns cost with value but can make revenue less predictable. Freemium offers a free tier with limited functionality and charges for premium features. This model lowers the barrier to entry and can drive viral growth, but conversion rates from free to paid typically range from 2% to 5%. For {PROJECT_NAME}, consider which model best matches how {TARGET_AUDIENCE} derives value from your product. If value scales with usage, usage-based pricing makes sense. If value is consistent regardless of volume, subscription pricing is simpler. Many successful SaaS companies use hybrid models that combine elements of all three.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Pricing Tiers for SaaS',
    content:
      'Imagine {PROJECT_NAME} offers three tiers: Starter at $29/month for individuals, Professional at $79/month for small teams, and Business at $199/month for growing companies. Each tier unlocks more features and higher usage limits. The Starter tier serves as a low-risk entry point for {TARGET_AUDIENCE}, while the Business tier captures more value from power users. This structure lets {PROJECT_NAME} grow revenue per account over time as customers upgrade — a pattern known as expansion revenue, which is the most efficient form of growth in {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Scenario: The Freemium Trap',
    content:
      'A SaaS founder launched with a generous free tier that included 90% of the product functionality. Users loved the free version but had no reason to upgrade. The company acquired 50,000 free users but only 200 paying customers — a 0.4% conversion rate that could not sustain the business. For {PROJECT_NAME}, design your free tier carefully: it should demonstrate value to {TARGET_AUDIENCE} while creating a clear incentive to upgrade. The free tier is a marketing tool, not the product itself.',
  },
  {
    type: 'text',
    title: 'Unit Economics: CAC, LTV, and Payback Period',
    content:
      'Unit economics determine whether your {BUSINESS_TYPE} business is financially viable. Customer Acquisition Cost (CAC) is the total cost of acquiring one paying customer, including marketing, sales, and onboarding expenses. Lifetime Value (LTV) is the total revenue you expect from a customer over their entire relationship with {PROJECT_NAME}. The LTV-to-CAC ratio should be at least 3:1 for a healthy SaaS business — meaning each customer generates three times more revenue than it costs to acquire them. The payback period is how long it takes to recoup the CAC from a single customer. For most SaaS companies, a payback period under 12 months is considered good. Track these metrics from day one for {PROJECT_NAME}. Even rough estimates will help you make better decisions about where to invest your marketing budget and how aggressively to pursue growth among {TARGET_AUDIENCE}.',
  },
  {
    type: 'tip',
    title: 'Price Based on Value, Not Cost',
    content:
      'Do not set prices for {PROJECT_NAME} based on what it costs you to deliver the {ENTITY}. Instead, price based on the value {TARGET_AUDIENCE} receives. If your product saves a customer $1,000 per month, charging $100 per month is a bargain — and you have room to increase prices as you add more value.',
  },
  {
    type: 'warning',
    title: 'Do Not Undercharge',
    content:
      'Many SaaS founders set prices too low out of fear that {TARGET_AUDIENCE} will not pay. Low prices signal low value and attract price-sensitive customers who churn quickly. It is easier to lower prices than to raise them. Start higher than you think is right for {PROJECT_NAME} and adjust based on conversion data.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, choose a revenue model that aligns with how {TARGET_AUDIENCE} derives value from {PROJECT_NAME}. Second, design pricing tiers that create a clear upgrade path. Third, if using freemium, ensure the free tier demonstrates value without giving away the core product. Fourth, track unit economics — LTV, CAC, and payback period — from day one. Fifth, price based on value delivered, not cost incurred. These monetization principles will help {PROJECT_NAME} build a sustainable {BUSINESS_TYPE} business.',
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
      'What gets measured gets managed. For {PROJECT_NAME}, tracking the right metrics is essential to understanding whether your {BUSINESS_TYPE} business is healthy and growing. In this lesson you will learn about the key performance indicators (KPIs) every SaaS founder must monitor, how to set up a metrics dashboard, and how to use data to make better decisions. We will cover revenue metrics like MRR and ARR, growth metrics like activation and retention rates, and efficiency metrics like the magic number and burn multiple. You will also learn how to avoid vanity metrics — numbers that look impressive but do not correlate with business success. By the end of this lesson you will have a clear metrics framework for {PROJECT_NAME} that tells you exactly how your product is performing with {TARGET_AUDIENCE} and where to focus your improvement efforts. Data-driven decision making is what separates SaaS companies that scale from those that stall.',
  },
  {
    type: 'text',
    title: 'Revenue Metrics: MRR, ARR, and Net Revenue Retention',
    content:
      'Monthly Recurring Revenue (MRR) is the most important metric for any {BUSINESS_TYPE} business. It represents the predictable revenue {PROJECT_NAME} generates each month from active subscriptions. Annual Recurring Revenue (ARR) is simply MRR multiplied by 12 and is useful for longer-term planning. But raw MRR only tells part of the story. Net Revenue Retention (NRR) measures how much revenue you retain from existing customers after accounting for churn, downgrades, and expansion. An NRR above 100% means your existing customer base is growing even without new acquisitions — a powerful indicator of product-market fit. For {PROJECT_NAME}, track MRR broken down by new revenue, expansion revenue, contraction, and churn. This decomposition reveals whether growth is coming from acquiring new {TARGET_AUDIENCE} members or from delivering more value to existing customers. The healthiest SaaS companies grow from both sources simultaneously.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: The Power of Net Revenue Retention',
    content:
      'Consider two SaaS companies, both with $100K MRR. Company A has 120% NRR — its existing customers spend 20% more each year through upgrades and expanded usage. Company B has 85% NRR — it loses 15% of revenue from existing customers each month. After 12 months with identical new customer acquisition, Company A has $240K MRR while Company B has only $170K MRR. For {PROJECT_NAME}, focus on building features that increase usage and value for {TARGET_AUDIENCE}, driving expansion revenue alongside new customer acquisition.',
  },
  {
    type: 'callout',
    title: 'Scenario: Vanity Metrics vs. Actionable Metrics',
    content:
      'A SaaS founder proudly reported 100,000 registered users for their product. But only 5,000 were active in the last 30 days, and only 500 were paying customers. The "registered users" number was a vanity metric that masked serious activation and conversion problems. For {PROJECT_NAME}, focus on metrics that drive action: activation rate (what percentage of signups from {TARGET_AUDIENCE} complete onboarding), weekly active users (how many people use your {ENTITY} regularly), and conversion rate (what percentage of free users become paying customers).',
  },
  {
    type: 'text',
    title: 'Growth and Engagement Metrics',
    content:
      'Beyond revenue, {PROJECT_NAME} needs to track metrics that indicate product health and user engagement. Activation rate measures the percentage of new signups who reach the "aha moment" — the point where they experience the core value of your {ENTITY}. For most SaaS products, this happens within the first session. If your activation rate is below 40%, your onboarding needs work. Daily Active Users (DAU) and Weekly Active Users (WAU) measure engagement intensity. The DAU/WAU ratio, sometimes called "stickiness," indicates how often users return. A ratio above 0.6 suggests strong daily engagement. Churn rate measures the percentage of customers who cancel their subscription each month. For early-stage SaaS targeting {TARGET_AUDIENCE}, monthly churn below 5% is acceptable, but you should aim for below 3% as you mature. Each of these metrics tells a different part of the story, and together they give you a complete picture of how {PROJECT_NAME} is performing.',
  },
  {
    type: 'tip',
    title: 'Set Up Your Metrics Dashboard Early',
    content:
      'Do not wait until {PROJECT_NAME} has thousands of users to start tracking metrics. Set up a simple dashboard from day one using tools like PostHog, Mixpanel, or even a spreadsheet. Track MRR, activation rate, and churn weekly. Early data — even from a small number of {TARGET_AUDIENCE} members — reveals patterns that inform critical product decisions.',
  },
  {
    type: 'warning',
    title: 'Beware of Vanity Metrics',
    content:
      'Total signups, page views, and social media followers can make {PROJECT_NAME} look successful without indicating real business health. Always pair top-of-funnel metrics with downstream metrics like activation, retention, and revenue. If signups are growing but activation is flat, you have a product problem, not a marketing problem.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, MRR and NRR are the most important revenue metrics for {PROJECT_NAME} as a {BUSINESS_TYPE} business. Second, track activation rate, engagement, and churn to understand product health. Third, decompose MRR into new, expansion, contraction, and churned revenue for deeper insight. Fourth, avoid vanity metrics that look good but do not drive decisions. Fifth, set up a metrics dashboard from day one and review it weekly with your team. Data-driven decisions will help {PROJECT_NAME} grow efficiently and serve {TARGET_AUDIENCE} better over time.',
  },
];


// ============================================================================
// Template Map & Export Function
// ============================================================================

/**
 * All Level 1 SaaS lesson templates keyed by topic slug.
 */
export const level1SaasTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: 'What problem does this SaaS solve?',
    description:
      'Learn how to identify, validate, and articulate the core problem your SaaS product addresses.',
    blocks: problemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: 'Who are your target customers?',
    description:
      'Define your ideal customer segments, build personas, and identify early adopters.',
    blocks: targetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: 'What makes your solution unique?',
    description:
      'Discover your competitive advantages and craft a compelling unique value proposition.',
    blocks: uniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: 'How will you make money?',
    description:
      'Explore SaaS revenue models, pricing strategies, and unit economics.',
    blocks: makeMoneyBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: 'What are your key metrics?',
    description:
      'Learn which KPIs to track and how to build a data-driven SaaS business.',
    blocks: keyMetricsBlocks,
  },
};

/**
 * Return the ordered list of Level 1 SaaS lesson templates.
 * Each template contains 5-10 ContentBlock items ready for placeholder substitution.
 */
export function getLevel1SaasTemplates(): Level1LessonTemplate[] {
  return [
    level1SaasTemplateMap.problem_solved,
    level1SaasTemplateMap.target_customers,
    level1SaasTemplateMap.unique_solution,
    level1SaasTemplateMap.monetization,
    level1SaasTemplateMap.key_metrics,
  ];
}

/**
 * Retrieve a single Level 1 SaaS template by topic slug.
 * Returns undefined when the topic is not found.
 */
export function getLevel1SaasTemplate(topic: string): Level1LessonTemplate | undefined {
  return level1SaasTemplateMap[topic];
}
