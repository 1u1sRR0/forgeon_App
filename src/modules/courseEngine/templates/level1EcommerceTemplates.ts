// ============================================================================
// LEVEL 1 E-COMMERCE TEMPLATES - Understanding the Business
// ============================================================================
//
// Comprehensive Level 1 lesson templates for E-commerce business type.
// Each template generates 5-10 ContentBlock items covering:
//   introduction, explanations, examples, tips, warnings, scenarios, takeaways
// Placeholders: {PROJECT_NAME}, {BUSINESS_TYPE}, {ENTITY}, {TARGET_AUDIENCE}
// ============================================================================

import { ContentBlock } from '../courseTypes';
import { Level1LessonTemplate } from './level1SaasTemplates';

// ---------------------------------------------------------------------------
// Lesson 1: What problem does this e-commerce solve?
// ---------------------------------------------------------------------------

const problemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Every successful e-commerce business starts with a clearly defined problem. Before sourcing a single product for {PROJECT_NAME}, you need to articulate the exact pain point your {TARGET_AUDIENCE} faces when shopping for {ENTITY} today. A well-defined problem statement acts as a compass that guides product selection, pricing decisions, and marketing strategy. In this lesson you will learn how to identify, validate, and communicate the core problem your {BUSINESS_TYPE} store addresses. We will explore frameworks used by leading e-commerce founders, examine real-world examples from brands that disrupted their categories, and give you a repeatable process for refining your problem statement until it resonates with potential customers. By the end of this lesson you will be able to describe the problem in one sentence, explain why existing shopping options fall short, and connect the problem directly to measurable outcomes like conversion rate, average order value, and customer lifetime value for your {TARGET_AUDIENCE}. Understanding the problem deeply is the single most important step in building an online store people actually want to buy from.',
  },
  {
    type: 'text',
    title: 'Why Problem Definition Matters in E-commerce',
    content:
      'Many first-time e-commerce founders skip straight to listing products without fully understanding the problem they are solving. This leads to stores that carry inventory nobody wants and marketing that fails to convert browsers into buyers. When you define the problem clearly for {PROJECT_NAME}, you create alignment across your entire operation: buyers know which products to source, designers know what shopping experience to create, and marketers know which pain points to highlight in ads and email campaigns. A strong problem definition also helps you prioritize your catalog and avoid the trap of becoming a generic everything-store. Instead of adding every product you can find, you can ask a simple question: "Does this product help solve the core problem for {TARGET_AUDIENCE}?" If the answer is no, it does not belong in your store. Research shows that niche e-commerce stores with a clear problem focus achieve 2-3x higher conversion rates than general stores trying to compete with Amazon on breadth. Cart abandonment rates average 70% across e-commerce — a clear problem statement helps you build the trust and urgency needed to push customers past checkout and complete their purchase. The problem is your foundation; your product catalog, fulfillment strategy, customer experience, and brand identity are all built on top of it.',
  },
  {
    type: 'text',
    title: 'Frameworks for E-commerce Problem Discovery',
    content:
      'There are several proven frameworks you can use to uncover and articulate the problem {PROJECT_NAME} solves. The Customer Journey Mapping framework asks: "Where does {TARGET_AUDIENCE} experience friction when trying to buy {ENTITY}?" This shifts focus from products to the buying experience. The Five Whys technique helps you drill past surface-level complaints to find root causes. Start with the obvious frustration — perhaps "I cannot find the right product" — and ask "why" five times until you reach the underlying issue, which might be poor product curation or lack of expert guidance. Customer interviews, adapted from Steve Blank\'s methodology, involve talking to at least 20 potential buyers before stocking any inventory. During these conversations, listen carefully for recurring frustrations with existing stores, creative workarounds people use, and the specific language they use to describe their shopping pain points. Finally, competitor gap analysis lets you map what existing e-commerce stores offer versus what customers actually need and want. Whichever framework you choose, the goal is the same: arrive at a problem statement that is specific, measurable, and tied to a real cost — whether that cost is wasted money on wrong products, time spent searching across multiple sites, or the frustration of poor fulfillment experiences for your {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: E-commerce Problem Discovery',
    content:
      'Imagine you are building {PROJECT_NAME}, a {BUSINESS_TYPE} store for {TARGET_AUDIENCE}. During customer interviews you discover that your potential buyers spend an average of 45 minutes comparing products across multiple websites before making a purchase, and 30% of them abandon the process entirely because they cannot determine which {ENTITY} is right for their needs. That is a clear, quantifiable pain point. You also learn that existing stores offer thousands of options but no guidance, forcing customers to rely on unreliable reviews. This insight becomes the foundation of your value proposition: "{PROJECT_NAME} eliminates the 45-minute comparison headache by curating the best {ENTITY} and providing expert buying guides for {TARGET_AUDIENCE}." Notice how the problem statement includes a specific metric, a clear audience, and a hint at the solution.',
  },
  {
    type: 'callout',
    title: 'Scenario: When the Problem Is Not Clear Enough',
    content:
      'Consider a founder who describes the problem as "people need to buy things online." This is too vague to guide any decision. Compare it with: "{TARGET_AUDIENCE} waste an average of $200 per year on {ENTITY} that does not meet their expectations because product descriptions are misleading and return processes are painful." The second version is specific, measurable, and immediately suggests what {PROJECT_NAME} should do — provide accurate product information, honest reviews, and hassle-free returns. If your problem statement sounds like the first example, keep iterating. Talk to more potential customers, gather data on cart abandonment and return rates, and narrow your focus until the problem is sharp enough to differentiate your store in a crowded {BUSINESS_TYPE} market.',
  },
  {
    type: 'tip',
    title: 'Validate With Pre-Orders or Landing Pages',
    content:
      'Before committing to inventory for {PROJECT_NAME}, validate your problem statement with at least 10 potential customers from your {TARGET_AUDIENCE}. Create a simple landing page describing the problem and your proposed solution, then measure interest through email signups or pre-orders. If fewer than 5% of visitors take action, your problem may not be compelling enough to support a {BUSINESS_TYPE} business.',
  },
  {
    type: 'warning',
    title: 'Avoid Product-First Thinking',
    content:
      'A common mistake in e-commerce is falling in love with a product before understanding the problem it solves. If you find yourself describing {PROJECT_NAME} in terms of product features and specifications rather than customer outcomes, step back and revisit your problem statement. Products change with trends and seasons; the core problem your {TARGET_AUDIENCE} faces when shopping for {ENTITY} should remain stable.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, a well-defined problem is the foundation of every successful {BUSINESS_TYPE} store and guides all downstream decisions. Second, use frameworks like Customer Journey Mapping and competitor gap analysis to uncover the real shopping pain points of {TARGET_AUDIENCE}. Third, your problem statement should be specific, measurable, and tied to a real cost such as wasted money, time, or frustration. Fourth, validate the problem with real potential customers before investing in inventory for {PROJECT_NAME}. Fifth, revisit and refine your problem statement as you learn more from order data, return rates, and customer feedback. These principles will keep {PROJECT_NAME} focused on delivering genuine value to shoppers.',
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
      'Knowing exactly who your customers are is the difference between an {BUSINESS_TYPE} store that thrives and one that bleeds money on unsold inventory. For {PROJECT_NAME}, defining your target customers means going beyond basic demographics to understand shopping behaviors, purchase motivations, and the triggers that turn browsers into buyers. In this lesson you will learn how to segment your market, build detailed buyer personas, and identify the early adopters most likely to place their first order for your {ENTITY}. We will cover quantitative methods like market sizing and average order value analysis alongside qualitative techniques such as empathy mapping and social listening. You will also learn how to prioritize segments so that your limited marketing budget generates maximum return on ad spend. By the end of this lesson you will have a clear picture of who {TARGET_AUDIENCE} really is, what drives their purchasing decisions, and how to reach them through the right channels. This clarity will inform everything from your product catalog to your checkout flow and post-purchase experience.',
  },
  {
    type: 'text',
    title: 'Market Segmentation for E-commerce',
    content:
      'Market segmentation divides your potential buyers into groups that share common characteristics relevant to their purchasing behavior and preferences. For a {BUSINESS_TYPE} store like {PROJECT_NAME}, the most useful segmentation dimensions are purchase frequency, average order value, shopping channel preference, geographic location, and product category affinity. Start broad and then narrow down systematically using available data. Your Total Addressable Market (TAM) might include everyone who buys {ENTITY} online globally. Your Serviceable Addressable Market (SAM) narrows that to buyers you can realistically reach with your current marketing channels, fulfillment capabilities, and shipping zones. Your Serviceable Obtainable Market (SOM) is the slice you can realistically capture in the next 12 to 18 months given your inventory investment, marketing budget, and current brand awareness. For {PROJECT_NAME}, focus your initial efforts on the SOM — the segment where your product selection is strongest and where {TARGET_AUDIENCE} is already actively searching for better options than what they currently have. Trying to serve every type of online shopper at once is the fastest way to dilute your brand and drain your marketing budget on low-converting traffic. Niche focus drives higher conversion rates, lower customer acquisition costs, and stronger word-of-mouth referrals that compound over time and reduce your dependence on paid advertising channels.',
  },
  {
    type: 'text',
    title: 'Building Buyer Personas for E-commerce',
    content:
      'A buyer persona is a semi-fictional representation of your ideal customer based on real data and educated assumptions about their shopping behavior and purchasing motivations. For {PROJECT_NAME}, create two to three personas that represent distinct segments of {TARGET_AUDIENCE}. Each persona should include a name, age range, income level, shopping habits, preferred devices, favorite social platforms, and purchase decision triggers. Go beyond surface-level attributes: what does this person search for before buying {ENTITY}? Do they compare prices across multiple stores or buy impulsively when they see something they like? Are they influenced by reviews, influencer recommendations, or brand loyalty? What would make them choose {PROJECT_NAME} over Amazon or a direct competitor? How do they feel about paying for expedited shipping versus waiting for free standard delivery? The answers to these important questions will shape your product descriptions, photography style, ad targeting, email marketing sequences, and even your shipping and return policies. Remember that personas are living documents — update them quarterly as you gather more data from actual orders, customer support interactions, abandoned cart recovery emails, and post-purchase surveys. A persona that was accurate at launch may drift significantly as your product catalog expands and your target market evolves over time.',
  },
  {
    type: 'callout',
    title: 'Example: E-commerce Buyer Persona',
    content:
      'Meet "Savvy Sarah," a 32-year-old professional who shops primarily on mobile during her commute. She spends an average of $150 per order and values fast shipping over the lowest price. She reads 3-5 reviews before purchasing and trusts user-generated photos more than studio shots. Sarah discovers new products through Instagram and TikTok but completes purchases on the brand website. She represents a key segment of {TARGET_AUDIENCE} for {PROJECT_NAME}. She is willing to pay a premium for curated selections and a seamless mobile checkout experience. Her pain point aligns perfectly with what {PROJECT_NAME} offers, making her an ideal early adopter for your {BUSINESS_TYPE} store.',
  },
  {
    type: 'callout',
    title: 'Scenario: Choosing the Wrong Customer Segment',
    content:
      'An e-commerce founder launched a premium kitchenware store targeting professional chefs. The products were high quality but the average order value needed to be $300 to cover fulfillment costs. Professional chefs, however, buy through wholesale distributors at 40% lower prices. The founder ran out of cash before reaching profitability. Had they targeted home cooking enthusiasts — a segment willing to pay retail prices and with higher purchase frequency — they could have built sustainable revenue sooner. For {PROJECT_NAME}, start with the segment of {TARGET_AUDIENCE} that has the highest willingness to pay at retail prices and the shortest path to first purchase.',
  },
  {
    type: 'tip',
    title: 'Use Purchase Data to Refine Personas',
    content:
      'Once {PROJECT_NAME} starts receiving orders, use real purchase data to refine your personas. Track which products {TARGET_AUDIENCE} buys together, what time of day they shop, which marketing channels drive the highest average order value, and what their repeat purchase rate looks like. Tools like Google Analytics, Shopify analytics, or your platform\'s built-in reporting can reveal patterns that interviews alone cannot.',
  },
  {
    type: 'warning',
    title: 'Do Not Target Everyone',
    content:
      'Saying "{PROJECT_NAME} is for everyone who shops online" is the same as saying it is for no one. An {BUSINESS_TYPE} store that tries to serve all customer segments simultaneously ends up with a bloated catalog, generic marketing, and high return rates. Pick one or two segments of {TARGET_AUDIENCE} and serve them exceptionally well before expanding your product range and audience.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, segment your market using dimensions relevant to {BUSINESS_TYPE}: purchase frequency, average order value, shopping channel, and product affinity. Second, build detailed buyer personas based on real conversations with and behavioral data from {TARGET_AUDIENCE}. Third, focus your initial marketing spend on the Serviceable Obtainable Market where {PROJECT_NAME} has the strongest product-market fit and highest conversion potential. Fourth, target early adopters who are already frustrated with existing shopping options for {ENTITY}. Fifth, resist the urge to serve everyone at once — a focused catalog with deep expertise beats a wide catalog with shallow knowledge in the early stages of building an e-commerce business.',
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
      'In a crowded {BUSINESS_TYPE} market where customers can find almost anything on Amazon, having good products is not enough — you need a store that stands out. Your unique value proposition (UVP) is the reason {TARGET_AUDIENCE} will choose {PROJECT_NAME} over every alternative, including marketplace giants and direct-to-consumer competitors. In this lesson you will learn how to identify your competitive advantages, articulate them clearly, and embed them into every aspect of your store — from product pages to packaging. We will examine differentiation strategies used by successful e-commerce brands, explore positioning frameworks, and help you craft a UVP that resonates with your ideal buyers. By the end of this lesson you will be able to explain in one sentence why {PROJECT_NAME} is the best place to buy {ENTITY}, and you will have a framework for maintaining that differentiation as competitors copy your ideas. Your UVP is not a tagline — it is a strategic decision that shapes your entire business, from sourcing to fulfillment to customer service.',
  },
  {
    type: 'text',
    title: 'Understanding Competitive Differentiation in E-commerce',
    content:
      'Differentiation in {BUSINESS_TYPE} can come from many sources: product curation, brand storytelling, customer experience, shipping speed, return policies, exclusive products, or deep expertise in a niche. For {PROJECT_NAME}, start by mapping the competitive landscape. List every alternative your {TARGET_AUDIENCE} currently uses to buy {ENTITY} — including Amazon, specialty retailers, direct-to-consumer brands, local boutiques, and even physical stores. For each alternative, note its strengths and weaknesses from the customer perspective. Then identify the gaps: where do existing options fall short? Perhaps Amazon has everything but no curation or expert guidance. Perhaps specialty stores have expertise but poor online experiences and slow shipping. Perhaps direct-to-consumer brands have great branding but limited selection. These gaps are your opportunities to create a differentiated position. Differentiation does not mean being different in every way; it means being meaningfully better in the ways that matter most to your customers. An e-commerce store that is 10% better across the board will struggle against one that is 10x better in one critical dimension — whether that is product quality, unboxing experience, personalized recommendations, or post-purchase support. Find your 10x dimension and build {PROJECT_NAME} around it. This focused approach also makes your marketing message clearer and your brand more memorable in a sea of generic online stores.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Finding Your 10x Advantage',
    content:
      'Consider how Warby Parker differentiated in the crowded eyewear market. Buying glasses online was risky because customers could not try them on. Warby Parker introduced a free home try-on program that eliminated the risk entirely. They did not try to beat LensCrafters on selection or Zenni on price. Instead, they focused on one critical friction point and solved it brilliantly. For {PROJECT_NAME}, ask yourself: what is the one thing {TARGET_AUDIENCE} cares about most when buying {ENTITY} that no competitor does well? That is where you should concentrate your investment in product experience, packaging, and customer service.',
  },
  {
    type: 'callout',
    title: 'Scenario: Positioning Against Amazon and Marketplace Giants',
    content:
      'When {PROJECT_NAME} enters a market where Amazon dominates, avoid competing on their terms. You will never beat Amazon on selection, price, or shipping speed. Instead, compete on what Amazon cannot offer: expert curation, brand story, community, personalized recommendations, or a premium unboxing experience. Position {PROJECT_NAME} as the best destination for a specific subset of {TARGET_AUDIENCE} who values quality and expertise over convenience and lowest price. This "wedge" strategy lets you build a loyal customer base in a niche before expanding. Remember, even Dollar Shave Club started by targeting men frustrated with overpriced razors before becoming a billion-dollar brand.',
  },
  {
    type: 'text',
    title: 'Crafting Your Unique Value Proposition',
    content:
      'A strong UVP follows a simple formula: "For [target customer] who [has this shopping frustration], {PROJECT_NAME} is a [category] store that [key benefit]. Unlike [competitors], {PROJECT_NAME} [unique differentiator]." This template forces you to be specific about every element. Fill it in with real data from your customer research and competitive analysis. Test it with members of {TARGET_AUDIENCE} and iterate until it clicks. A good UVP should pass the "so what?" test — if a potential customer reads it and shrugs, it is not specific enough. It should also pass the "prove it" test — every claim should be backed by evidence, whether that is a product guarantee, customer testimonials, or a unique sourcing story. Your UVP will appear on your homepage hero section, in your ad copy, on your packaging inserts, in your email welcome series, and in every customer touchpoint from first impression to post-purchase follow-up. Make sure it is sharp, honest, and memorable. In e-commerce, trust is everything — a UVP that overpromises and underdelivers will destroy your brand faster than any competitor can. The best e-commerce UVPs combine emotional appeal with a concrete, verifiable claim that sets clear expectations for what {TARGET_AUDIENCE} will experience when they shop at your store.',
  },
  {
    type: 'tip',
    title: 'Test Your UVP With Ad Copy',
    content:
      'Run two small Facebook or Google ad campaigns for {PROJECT_NAME}: one highlighting your UVP and one with a generic product message. Compare click-through rates and cost per acquisition. If the UVP version outperforms, you have found a message that resonates with {TARGET_AUDIENCE}. If not, iterate on your positioning before scaling your marketing spend.',
  },
  {
    type: 'warning',
    title: 'Do Not Differentiate on Price Alone',
    content:
      'Competing on price in {BUSINESS_TYPE} is a race to the bottom. Amazon, Walmart, and Temu will always undercut you. Instead, differentiate {PROJECT_NAME} on value delivered to {TARGET_AUDIENCE}. If your curated selection saves customers hours of research and your quality guarantee eliminates the risk of buying the wrong {ENTITY}, the price becomes a fraction of the value created. Customers who buy on price alone are the first to leave when a cheaper option appears.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, differentiation is about being meaningfully better in the ways that matter most to {TARGET_AUDIENCE} when they shop for {ENTITY}. Second, map the competitive landscape including Amazon and identify gaps that {PROJECT_NAME} can fill. Third, find your 10x advantage — the one dimension where you are dramatically better than alternatives, whether that is curation, experience, or expertise. Fourth, craft a UVP using the formula and test it with real ad campaigns. Fifth, avoid competing on price alone; compete on the unique value and trust your {BUSINESS_TYPE} store delivers. These principles will help {PROJECT_NAME} stand out in a market dominated by giants.',
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
      'Revenue is the lifeblood of any {BUSINESS_TYPE} business, but in e-commerce, revenue without healthy margins is a fast path to failure. For {PROJECT_NAME}, choosing the right monetization strategy means understanding not just how to generate sales, but how to generate profitable sales after accounting for product costs, shipping, returns, and customer acquisition. In this lesson you will explore the most common e-commerce revenue models, learn how to calculate unit economics per order, and develop a pricing strategy that aligns with the value you deliver to {TARGET_AUDIENCE}. We will cover direct product sales, subscription boxes, bundling strategies, and ancillary revenue streams. You will also learn about key financial metrics every e-commerce founder must track, including Average Order Value (AOV), Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), and gross margin per order. By the end of this lesson you will have a clear monetization plan for {PROJECT_NAME} that balances growth with profitability. Getting pricing and margins right from the start can mean the difference between a thriving store and one that sells a lot but loses money on every order.',
  },
  {
    type: 'text',
    title: 'E-commerce Revenue Models Explained',
    content:
      'The most common e-commerce revenue models are direct product sales, subscription commerce, and marketplace commissions. Direct product sales is the simplest and most common model: you buy or manufacture {ENTITY} at wholesale cost and sell at retail markup to consumers. Typical gross margins range from 30% to 70% depending on the category, with higher margins in specialty and branded products and lower margins in commoditized goods. Subscription commerce charges customers a recurring fee for regular deliveries — think Dollar Shave Club for razors or Stitch Fix for clothing. This model provides predictable revenue and significantly higher customer lifetime value but requires careful inventory planning, low churn rates, and a product category where regular replenishment or discovery makes sense. Bundling strategies increase average order value by packaging complementary products together at a slight discount, encouraging customers to buy more items per transaction. For {PROJECT_NAME}, consider which model best matches how {TARGET_AUDIENCE} buys {ENTITY}. If customers need regular replenishment, subscriptions make sense. If purchases are one-time or infrequent, focus on maximizing AOV through bundles, upsells, and cross-sells at checkout. Many successful e-commerce brands use hybrid models that combine one-time purchases with subscription options and loyalty programs to maximize both customer acquisition and long-term retention.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Pricing Strategy for E-commerce',
    content:
      'Imagine {PROJECT_NAME} sells curated {ENTITY} with three pricing tiers: a Starter bundle at $39 for first-time buyers, a Popular bundle at $79 that includes the best-selling items, and a Premium bundle at $149 with exclusive products and free express shipping. The Starter bundle serves as a low-risk entry point for {TARGET_AUDIENCE}, while the Premium bundle captures more value from enthusiasts. You also offer a monthly subscription at $59 that delivers curated selections with a 15% discount versus one-time pricing. This structure lets {PROJECT_NAME} grow revenue per customer over time through repeat purchases and subscription upgrades — a pattern known as increasing customer lifetime value, which is the most efficient form of growth in {BUSINESS_TYPE}.',
  },
  {
    type: 'callout',
    title: 'Scenario: The Free Shipping Trap',
    content:
      'An e-commerce founder offered free shipping on all orders to compete with Amazon Prime. The average order value was $35, but shipping cost $8 per order, eating into already thin margins. The store processed 5,000 orders per month but lost $2 per order after all costs. That is $10,000 per month in losses disguised as revenue growth. For {PROJECT_NAME}, set a free shipping threshold that encourages larger orders — for example, free shipping on orders over $75. This incentivizes {TARGET_AUDIENCE} to add more {ENTITY} to their cart, increasing AOV while protecting your margins. The free shipping threshold is one of the most powerful conversion and profitability levers in e-commerce.',
  },
  {
    type: 'text',
    title: 'Unit Economics: CAC, CLV, and Gross Margin',
    content:
      'Unit economics determine whether your {BUSINESS_TYPE} business is financially viable on a per-order and per-customer basis. Customer Acquisition Cost (CAC) is the total cost of acquiring one paying customer, including ad spend, influencer fees, promotional discounts, and any free samples or trial offers you provide. Customer Lifetime Value (CLV) is the total revenue you expect from a customer over their entire relationship with {PROJECT_NAME}, accounting for repeat purchases, average order frequency, and typical customer lifespan before they stop buying from your store. The CLV-to-CAC ratio should be at least 3:1 for a healthy e-commerce business — meaning each customer generates three times more revenue than it costs to acquire them. Gross margin per order is revenue minus cost of goods sold (COGS), shipping costs, packaging materials, and payment processing fees. For most e-commerce businesses, a gross margin above 40% is needed to cover operating expenses like warehousing, customer service, software tools, and marketing overhead while still generating profit. Track these metrics from your very first order at {PROJECT_NAME}. Even rough estimates based on small sample sizes will help you make better decisions about where to invest your marketing budget, which products to promote most aggressively, and how to pursue sustainable growth among {TARGET_AUDIENCE}.',
  },
  {
    type: 'tip',
    title: 'Price Based on Perceived Value, Not Cost-Plus',
    content:
      'Do not set prices for {PROJECT_NAME} by simply adding a fixed markup to your wholesale cost. Instead, price based on the perceived value {TARGET_AUDIENCE} receives. If your curated selection saves customers hours of research and your quality guarantee eliminates the risk of buying the wrong {ENTITY}, you can command a premium. Test different price points with small ad campaigns and measure conversion rate and AOV to find the sweet spot.',
  },
  {
    type: 'warning',
    title: 'Do Not Ignore Hidden Costs',
    content:
      'Many e-commerce founders calculate margins based on product cost and selling price alone, forgetting about shipping, packaging, payment processing fees (typically 2.9% plus $0.30 per transaction), returns (averaging 20-30% in some categories), and customer service costs. For {PROJECT_NAME}, build a complete cost model that includes every expense between sourcing {ENTITY} and delivering it to {TARGET_AUDIENCE}. A product that looks profitable on paper can lose money when all costs are included.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, choose a revenue model that aligns with how {TARGET_AUDIENCE} buys {ENTITY} — direct sales, subscriptions, or bundles. Second, design pricing tiers and bundles that create a clear path to higher average order value for every transaction. Third, use free shipping thresholds strategically to increase AOV while protecting your profit margins. Fourth, track unit economics — CLV, CAC, and gross margin per order — from your very first sale at {PROJECT_NAME}. Fifth, price based on perceived value delivered to the customer, not cost-plus markup. These monetization principles will help {PROJECT_NAME} build a sustainable and profitable {BUSINESS_TYPE} business over the long term.',
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
      'What gets measured gets managed, and in e-commerce the difference between a thriving store and a failing one often comes down to which metrics the founder watches. For {PROJECT_NAME}, tracking the right metrics is essential to understanding whether your {BUSINESS_TYPE} business is healthy, growing, and profitable. In this lesson you will learn about the key performance indicators (KPIs) every e-commerce founder must monitor, how to set up a metrics dashboard, and how to use data to make better decisions about inventory, marketing, and customer experience. We will cover revenue metrics like Average Order Value and revenue per visitor, conversion metrics like cart abandonment rate and checkout completion rate, and customer metrics like repeat purchase rate and customer lifetime value. You will also learn how to avoid vanity metrics — numbers that look impressive but do not correlate with profitability. By the end of this lesson you will have a clear metrics framework for {PROJECT_NAME} that tells you exactly how your store is performing with {TARGET_AUDIENCE} and where to focus your improvement efforts. Data-driven decision making is what separates e-commerce businesses that scale from those that stall.',
  },
  {
    type: 'text',
    title: 'Revenue and Conversion Metrics',
    content:
      'Average Order Value (AOV) is one of the most important metrics for any {BUSINESS_TYPE} business. It represents the average amount a customer spends per transaction at {PROJECT_NAME}. Increasing AOV by even 10% can dramatically improve profitability without acquiring a single new customer, making it one of the highest-leverage optimizations available. Track AOV alongside conversion rate — the percentage of website visitors who complete a purchase. Industry average conversion rates for e-commerce range from 1% to 4%, but top-performing stores with strong product-market fit and optimized checkout flows achieve 5% or higher. Revenue per visitor (RPV) combines both metrics into a single powerful number: RPV equals AOV multiplied by conversion rate. This is the most useful metric for comparing the effectiveness of different traffic sources, marketing campaigns, and landing pages. Cart abandonment rate measures the percentage of shoppers who add {ENTITY} to their cart but leave without completing checkout. The global average is approximately 70%, meaning 7 out of 10 potential orders are lost at the final step. For {PROJECT_NAME}, reducing cart abandonment by even 5 percentage points can increase revenue by 15-20% with zero additional ad spend. Track these metrics daily and look for trends — a sudden spike in cart abandonment might indicate a checkout bug, unexpected shipping costs revealed too late, a broken payment method, or a competitor running a promotion that is pulling {TARGET_AUDIENCE} away from your store.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: The Power of AOV Optimization',
    content:
      'Consider two e-commerce stores, both with 10,000 monthly visitors and a 3% conversion rate — 300 orders per month. Store A has an AOV of $50, generating $15,000 in monthly revenue. Store B has an AOV of $75 thanks to strategic bundling and a free shipping threshold at $70. Store B generates $22,500 per month — 50% more revenue from the same traffic. For {PROJECT_NAME}, focus on increasing AOV through product bundles, "frequently bought together" recommendations, and free shipping thresholds. These tactics cost almost nothing to implement but can transform your {BUSINESS_TYPE} economics.',
  },
  {
    type: 'callout',
    title: 'Scenario: Vanity Metrics vs. Actionable Metrics',
    content:
      'An e-commerce founder proudly reported 500,000 monthly website visitors and 50,000 Instagram followers. But the conversion rate was 0.5%, the average order value was $25, and the return rate was 35%. The impressive traffic numbers masked serious problems with product-market fit and customer experience. For {PROJECT_NAME}, focus on metrics that drive profitability: conversion rate (what percentage of visitors from {TARGET_AUDIENCE} actually buy), AOV (how much they spend per order), return rate (how many orders come back), and repeat purchase rate (how many customers buy again within 90 days). These four metrics tell you more about business health than any amount of traffic or social media followers.',
  },
  {
    type: 'text',
    title: 'Customer and Fulfillment Metrics',
    content:
      'Beyond revenue and conversion, {PROJECT_NAME} needs to track metrics that indicate customer satisfaction and operational efficiency. Repeat purchase rate measures the percentage of customers who place a second order — for most e-commerce businesses, getting a customer to buy twice is the inflection point for profitability since the second order has zero acquisition cost and proves the customer trusts your brand. Customer Lifetime Value (CLV) projects total revenue from a customer over their entire relationship with your store, factoring in average order value, purchase frequency, and expected customer lifespan. A healthy e-commerce business has a CLV-to-CAC ratio of at least 3:1. On the operations side, track order fulfillment time — how quickly orders are picked, packed, and shipped after purchase. Customers increasingly expect 1-2 day processing times, and delays directly impact reviews, repeat purchases, and word-of-mouth referrals. Return rate measures the percentage of orders that are sent back, and high return rates in certain product categories like apparel can destroy margins even when top-line sales look strong. For {PROJECT_NAME} targeting {TARGET_AUDIENCE}, also track Net Promoter Score (NPS) through post-purchase surveys sent 7-14 days after delivery. An NPS above 50 indicates strong customer loyalty and predicts organic growth through word-of-mouth referrals, which is the most cost-effective acquisition channel in e-commerce and reduces your dependence on increasingly expensive paid advertising.',
  },
  {
    type: 'tip',
    title: 'Set Up Your E-commerce Dashboard Early',
    content:
      'Do not wait until {PROJECT_NAME} has thousands of orders to start tracking metrics. Set up a dashboard from day one using your e-commerce platform analytics, Google Analytics, and a simple spreadsheet. Track AOV, conversion rate, cart abandonment, and repeat purchase rate weekly. Early data — even from a small number of orders from {TARGET_AUDIENCE} — reveals patterns that inform critical decisions about inventory, pricing, and marketing spend.',
  },
  {
    type: 'warning',
    title: 'Beware of Revenue Without Profit',
    content:
      'Total revenue and order count can make {PROJECT_NAME} look successful without indicating real business health. Always pair top-line revenue with gross margin, return rate, and CAC. If revenue is growing but gross margin is shrinking because of discounts and free shipping, you are buying growth at the expense of sustainability. A store doing $50,000 per month at 50% gross margin is healthier than one doing $100,000 at 15% gross margin.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, AOV and conversion rate are the most important revenue metrics for {PROJECT_NAME} as a {BUSINESS_TYPE} business — small improvements in either have outsized impact on revenue. Second, track cart abandonment rate and work relentlessly to reduce it below 60%. Third, monitor repeat purchase rate and CLV to understand long-term customer value beyond the first order. Fourth, avoid vanity metrics like traffic and followers that look good but do not drive profitability. Fifth, set up a metrics dashboard from day one and review it weekly. Data-driven decisions about inventory, pricing, and marketing will help {PROJECT_NAME} grow efficiently and serve {TARGET_AUDIENCE} better over time.',
  },
];


// ============================================================================
// Template Map & Export Functions
// ============================================================================

/**
 * All Level 1 E-commerce lesson templates keyed by topic slug.
 */
export const level1EcommerceTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: 'What problem does this e-commerce solve?',
    description:
      'Learn how to identify, validate, and articulate the core problem your e-commerce store addresses for shoppers.',
    blocks: problemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: 'Who are your target customers?',
    description:
      'Define your ideal buyer segments, build personas, and identify early adopters for your online store.',
    blocks: targetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: 'What makes your solution unique?',
    description:
      'Discover your competitive advantages and craft a compelling value proposition that stands out against Amazon and competitors.',
    blocks: uniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: 'How will you make money?',
    description:
      'Explore e-commerce revenue models, pricing strategies, and unit economics per order.',
    blocks: makeMoneyBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: 'What are your key metrics?',
    description:
      'Learn which KPIs to track — AOV, conversion rate, cart abandonment, CLV — and how to build a data-driven e-commerce business.',
    blocks: keyMetricsBlocks,
  },
};

/**
 * Return the ordered list of Level 1 E-commerce lesson templates.
 * Each template contains 5-10 ContentBlock items ready for placeholder substitution.
 */
export function getLevel1EcommerceTemplates(): Level1LessonTemplate[] {
  return [
    level1EcommerceTemplateMap.problem_solved,
    level1EcommerceTemplateMap.target_customers,
    level1EcommerceTemplateMap.unique_solution,
    level1EcommerceTemplateMap.monetization,
    level1EcommerceTemplateMap.key_metrics,
  ];
}

/**
 * Retrieve a single Level 1 E-commerce template by topic slug.
 * Returns undefined when the topic is not found.
 */
export function getLevel1EcommerceTemplate(topic: string): Level1LessonTemplate | undefined {
  return level1EcommerceTemplateMap[topic];
}
