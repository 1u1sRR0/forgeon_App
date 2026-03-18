// ============================================================================
// LEVEL 1 MARKETPLACE TEMPLATES - Understanding the Business
// ============================================================================
//
// Comprehensive Level 1 lesson templates for Marketplace business type.
// Each template generates 5-10 ContentBlock items covering:
//   introduction, explanations, examples, tips, warnings, scenarios, takeaways
// Placeholders: {PROJECT_NAME}, {BUSINESS_TYPE}, {ENTITY}, {TARGET_AUDIENCE}
// ============================================================================

import { ContentBlock } from '../courseTypes';
import { Level1LessonTemplate } from './level1SaasTemplates';

// ---------------------------------------------------------------------------
// Lesson 1: What problem does this marketplace solve?
// ---------------------------------------------------------------------------

const problemSolvedBlocks: ContentBlock[] = [
  {
    type: 'text',
    title: 'Introduction',
    content:
      'Every successful marketplace begins with a clearly defined problem that affects both sides of the market. Before building a single feature for {PROJECT_NAME}, you need to articulate the exact pain point your {TARGET_AUDIENCE} faces when trying to find, compare, and transact around {ENTITY} today. A well-defined problem statement acts as a compass that guides platform decisions, trust and safety policies, and growth strategies for both buyers and sellers. In this lesson you will learn how to identify, validate, and communicate the core problem your {BUSINESS_TYPE} platform addresses. We will explore frameworks used by leading marketplace founders, examine real-world examples from platforms like Airbnb, Uber, and Etsy, and give you a repeatable process for refining your problem statement until it resonates with both sides of your two-sided market. By the end of this lesson you will be able to describe the problem in one sentence, explain why existing solutions fail to connect supply and demand efficiently, and connect the problem directly to measurable outcomes like liquidity, transaction volume, and Gross Merchandise Value for your {TARGET_AUDIENCE}. Understanding the problem deeply is the single most important step in building a platform people actually want to use and transact on.',
  },
  {
    type: 'text',
    title: 'Why Problem Definition Matters in Marketplaces',
    content:
      'Many first-time marketplace founders skip straight to building platform features without fully understanding the friction they are removing from the transaction process. This leads to platforms that are technically functional but fail to achieve the liquidity needed to sustain a two-sided market. When you define the problem clearly for {PROJECT_NAME}, you create alignment across your entire team: product designers know which workflows to simplify for buyers and sellers, engineers know which trust and safety features matter most, and growth teams know which side of the market to prioritize first. A strong problem definition also helps you solve the classic chicken-and-egg dilemma — should you attract supply or demand first? The answer depends on which side feels the pain more acutely and which side has fewer existing alternatives. Research from marketplace experts shows that over 60% of marketplace startups fail because they cannot achieve sufficient liquidity in their target market. That statistic alone should convince you to invest serious time in problem discovery before you invest serious money in platform development. The problem is your foundation; your matching algorithms, payment systems, review mechanisms, and dispute resolution processes are all built on top of it. Without a clear problem, you risk building a platform that nobody on either side of the market needs.',
  },
  {
    type: 'text',
    title: 'Frameworks for Marketplace Problem Discovery',
    content:
      'There are several proven frameworks you can use to uncover and articulate the problem {PROJECT_NAME} solves. The Two-Sided Pain Analysis framework asks: "What friction does {TARGET_AUDIENCE} experience on the buy side, and what friction do suppliers experience on the sell side?" This ensures you understand both perspectives. The Transaction Cost Theory approach examines the costs of finding, evaluating, and completing a transaction without your platform — including search costs, verification costs, negotiation costs, and enforcement costs. If {PROJECT_NAME} can dramatically reduce these costs, you have a compelling value proposition. Customer Development interviews should include at least 15 potential buyers and 15 potential sellers. During these conversations, listen for recurring frustrations with existing channels, creative workarounds people use to find each other, and the specific language they use to describe their pain. The Marketplace Canvas, adapted from the Business Model Canvas, lets you map supply characteristics, demand characteristics, the transaction being facilitated, and your unique approach to matching and trust. Whichever framework you choose, the goal is the same: arrive at a problem statement that is specific, measurable, and tied to a real cost — whether that cost is time spent searching, money lost to intermediaries, or trust gaps that prevent transactions from happening for your {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Marketplace Problem Discovery',
    content:
      'Imagine you are building {PROJECT_NAME}, a {BUSINESS_TYPE} platform for {TARGET_AUDIENCE}. During interviews with potential buyers you discover they spend an average of 3 hours searching across fragmented channels to find the right {ENTITY}, and 40% give up without completing a transaction because they cannot verify quality or trust the seller. On the supply side, sellers tell you they spend 30% of their time on administrative tasks instead of delivering their core service. This insight becomes the foundation of your value proposition: "{PROJECT_NAME} eliminates the 3-hour search and trust gap by curating verified {ENTITY} providers and enabling secure transactions for {TARGET_AUDIENCE}." Notice how the problem statement includes specific metrics, addresses both sides of the market, and hints at the platform solution.',
  },
  {
    type: 'callout',
    title: 'Scenario: When the Problem Is Not Clear Enough',
    content:
      'Consider a founder who describes the problem as "people need a place to buy and sell things." This is too vague to guide any decision and describes every marketplace ever built. Compare it with: "{TARGET_AUDIENCE} lose an average of 15% of potential transaction value to inefficient intermediaries because there is no transparent, trust-verified platform for {ENTITY} in their local market." The second version is specific, measurable, and immediately suggests what {PROJECT_NAME} should do — provide transparency, build trust mechanisms, and reduce intermediary costs. If your problem statement sounds like the first example, keep iterating. Talk to more users on both sides of the market, gather data on transaction friction, and narrow your focus until the problem is sharp enough to justify building a dedicated {BUSINESS_TYPE} platform.',
  },
  {
    type: 'tip',
    title: 'Validate Both Sides of the Market',
    content:
      'Before committing to a problem statement for {PROJECT_NAME}, validate it with at least 10 potential buyers and 10 potential sellers from your {TARGET_AUDIENCE}. A marketplace only works if both sides feel the pain. If buyers are desperate but sellers are indifferent, or vice versa, your platform will struggle to achieve the liquidity needed to sustain a {BUSINESS_TYPE} business. The strongest marketplace problems are ones where both sides actively seek a better way to transact.',
  },
  {
    type: 'warning',
    title: 'Avoid Building a Solution Looking for a Problem',
    content:
      'A common mistake is falling in love with marketplace technology — matching algorithms, payment systems, review engines — before understanding the transaction friction you are removing. If you find yourself describing {PROJECT_NAME} in terms of platform features rather than the transaction outcomes it enables for {TARGET_AUDIENCE}, step back and revisit your problem statement. Technology is an enabler; the core problem of connecting supply and demand for {ENTITY} should remain stable for years.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, a well-defined problem is the foundation of every successful {BUSINESS_TYPE} platform and must address friction on both sides of the market. Second, use frameworks like Two-Sided Pain Analysis and Transaction Cost Theory to uncover the real pain points of {TARGET_AUDIENCE}. Third, your problem statement should be specific, measurable, and tied to a real cost such as search time, intermediary fees, or trust gaps. Fourth, validate the problem with real users on both the buy and sell sides before investing in platform development for {PROJECT_NAME}. Fifth, revisit and refine your problem statement as you learn more from transaction data and user feedback. These principles will keep {PROJECT_NAME} focused on delivering genuine value to its marketplace community.',
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
      'In a marketplace, knowing your customers means understanding two distinct groups: the buyers who create demand and the sellers who provide supply. For {PROJECT_NAME}, defining your target customers on both sides is the difference between a {BUSINESS_TYPE} platform that achieves liquidity and one that remains an empty storefront. In this lesson you will learn how to segment both sides of your market, build detailed personas for buyers and sellers, and identify the early adopters most likely to transact on your platform for {ENTITY}. We will cover quantitative methods like market sizing and network effect analysis alongside qualitative techniques such as empathy mapping for each side of the market. You will also learn how to prioritize which side to attract first to solve the chicken-and-egg problem that kills most marketplace startups. By the end of this lesson you will have a clear picture of who {TARGET_AUDIENCE} really is on both sides, what drives their participation decisions, and how to reach them efficiently. This clarity will inform everything from your onboarding flows to your trust and safety policies and your take rate structure.',
  },
  {
    type: 'text',
    title: 'Two-Sided Market Segmentation',
    content:
      'Market segmentation in a marketplace is fundamentally different from single-sided businesses because you must segment both supply and demand independently and then understand how segments interact. For a {BUSINESS_TYPE} platform like {PROJECT_NAME}, segment your demand side by purchase frequency, transaction value, urgency of need, and willingness to pay a premium for quality or convenience. Segment your supply side by volume capacity, quality level, pricing strategy, and reliability. Your Total Addressable Market (TAM) includes every potential buyer and seller of {ENTITY} in your target geography or vertical. Your Serviceable Addressable Market (SAM) narrows that to participants you can realistically attract with your current platform capabilities and go-to-market strategy. Your Serviceable Obtainable Market (SOM) is the slice you can capture in the next 12 to 18 months. For {PROJECT_NAME}, focus your initial efforts on the SOM — the intersection where buyer demand is strongest and seller supply is most reliable. This focused approach creates a dense pocket of liquidity that generates positive transaction experiences, which in turn attract more participants through word of mouth and network effects. Trying to serve every buyer and seller type at once is the fastest way to create a marketplace where nobody can find what they need.',
  },
  {
    type: 'text',
    title: 'Building Personas for Both Sides',
    content:
      'A marketplace requires separate personas for each side of the market, and each persona must reflect the unique motivations and constraints of that side. For {PROJECT_NAME}, create two to three buyer personas and two to three seller personas that represent distinct segments of {TARGET_AUDIENCE}. Buyer personas should include transaction frequency, average spend, quality expectations, trust requirements, and preferred discovery methods. Seller personas should include inventory volume, pricing flexibility, service quality standards, technology comfort level, and growth ambitions. Go beyond surface-level attributes: what makes a buyer choose your platform over searching independently? What makes a seller willing to pay your take rate instead of finding customers directly? For buyers, understand their decision-making process — do they compare multiple listings, read reviews carefully, or book the first available option? For sellers, understand their economics — what is their cost structure, how much time do they spend on customer acquisition today, and what take rate would they accept in exchange for reliable demand? The answers to these questions will shape your matching algorithms, review systems, pricing policies, and dispute resolution processes. Remember that personas are living documents — update them quarterly as you gather real transaction data from {PROJECT_NAME} and observe how buyer and seller behaviors evolve over time.',
  },
  {
    type: 'callout',
    title: 'Example: Marketplace Buyer and Seller Personas',
    content:
      'Meet "Busy Buyer Ben," a professional who values convenience over price. He searches for {ENTITY} on mobile, reads the top 3 reviews, and books within 5 minutes. He is willing to pay a 20% premium for verified quality and instant confirmation. On the supply side, meet "Professional Provider Paula," a full-time seller who lists 15-20 {ENTITY} per month and depends on marketplace platforms for 70% of her income. She values consistent demand flow, fair dispute resolution, and tools that reduce her administrative overhead. Together, Ben and Paula represent the ideal transaction pair for {PROJECT_NAME} — high-intent demand meeting reliable, quality supply. Understanding both personas helps you design features that make their transaction seamless.',
  },
  {
    type: 'callout',
    title: 'Scenario: Solving the Chicken-and-Egg Problem',
    content:
      'A marketplace founder launched a platform for freelance designers but focused all marketing on attracting buyers first. With no designers on the platform, buyers found empty search results and never returned. The founder then pivoted to attracting designers, but with no buyer demand, designers saw no reason to create profiles. The platform died in the liquidity desert between supply and demand. For {PROJECT_NAME}, solve the chicken-and-egg problem by starting with the harder side to attract — typically supply. Offer early sellers free listings, reduced take rates, or guaranteed minimum earnings. Once you have quality supply, buyers will come. Airbnb famously started by personally photographing early listings to ensure quality supply attracted demand.',
  },
  {
    type: 'tip',
    title: 'Start With a Constrained Market',
    content:
      'Instead of launching {PROJECT_NAME} nationally or globally, start in a single city, neighborhood, or niche vertical where you can achieve high liquidity quickly. Uber started in San Francisco, Airbnb started with air mattresses during conferences, and Etsy started with handmade crafts. A constrained market lets you personally onboard {TARGET_AUDIENCE} on both sides, ensure quality transactions, and build the trust that fuels organic growth through network effects.',
  },
  {
    type: 'warning',
    title: 'Do Not Ignore the Supply Side',
    content:
      'Many marketplace founders obsess over buyer acquisition because it feels more like traditional marketing. But in a {BUSINESS_TYPE} platform, supply quality determines everything. If {PROJECT_NAME} attracts thousands of buyers but the {ENTITY} listings are low quality, unreliable, or sparse, buyers will have bad experiences and never return. Invest at least as much effort in seller onboarding, quality standards, and supply-side tools as you do in demand generation for {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, segment both sides of your market independently — buyers by purchase behavior and sellers by supply characteristics and reliability. Second, build separate personas for buyers and sellers based on real conversations with {TARGET_AUDIENCE}. Third, focus your initial launch on a constrained market where {PROJECT_NAME} can achieve high liquidity quickly and iterate on the transaction experience. Fourth, solve the chicken-and-egg problem by subsidizing the harder side to attract first, typically supply. Fifth, invest equally in supply quality and demand generation — a marketplace is only as good as its worst transaction. These principles will help {PROJECT_NAME} build the network effects that make {BUSINESS_TYPE} platforms defensible over time.',
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
      'In a crowded {BUSINESS_TYPE} landscape where platforms like Airbnb, Uber, and Etsy dominate their categories, having a functional marketplace is not enough — you need a platform that stands out. Your unique value proposition (UVP) is the reason {TARGET_AUDIENCE} will choose {PROJECT_NAME} over every alternative, including existing platforms, direct transactions, and traditional intermediaries. In this lesson you will learn how to identify your competitive advantages, articulate them clearly, and embed them into every aspect of your platform experience. We will examine differentiation strategies used by successful marketplace companies, explore positioning frameworks specific to two-sided markets, and help you craft a UVP that resonates with both buyers and sellers. By the end of this lesson you will be able to explain in one sentence why {PROJECT_NAME} is the best platform for {ENTITY} transactions, and you will have a framework for maintaining that differentiation as competitors emerge. Your UVP is not a tagline — it is a strategic decision that shapes your matching logic, trust mechanisms, and the entire transaction experience for both sides of the market.',
  },
  {
    type: 'text',
    title: 'Understanding Competitive Differentiation in Marketplaces',
    content:
      'Differentiation in a {BUSINESS_TYPE} platform can come from many sources: superior matching algorithms, stronger trust and safety mechanisms, better supply curation, lower transaction friction, specialized vertical focus, or unique network effects. For {PROJECT_NAME}, start by mapping the competitive landscape. List every alternative your {TARGET_AUDIENCE} currently uses to find and transact around {ENTITY} — including established marketplaces, classified ads, social media groups, word-of-mouth referrals, and traditional intermediaries like agents or brokers. For each alternative, note its strengths and weaknesses from both the buyer and seller perspective. Then identify the gaps: where do existing platforms fail to create trust, reduce friction, or deliver value? Perhaps existing platforms have broad selection but poor quality control. Perhaps they charge high fees but provide minimal seller tools. Perhaps they work well for one side but create a terrible experience for the other. These gaps are your opportunities. Differentiation in marketplaces does not mean being different in every way; it means being meaningfully better in the ways that matter most to both sides of your market. A platform that is 10% better across the board will struggle against one that is 10x better in one critical dimension — whether that is trust verification, matching precision, transaction speed, or dispute resolution. Find your 10x dimension and build {PROJECT_NAME} around it.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Finding Your 10x Advantage',
    content:
      'Consider how Airbnb differentiated in the crowded short-term rental market. Craigslist had listings but no trust. Hotels had trust but no variety or local experience. Airbnb focused on trust — professional photography, verified profiles, secure payments, and a review system that held both hosts and guests accountable. This trust layer transformed strangers into willing transaction partners. For {PROJECT_NAME}, ask yourself: what is the one thing that prevents {TARGET_AUDIENCE} from transacting around {ENTITY} today? If it is trust, build the best verification system. If it is discovery, build the best matching algorithm. If it is transaction complexity, build the simplest checkout flow. Your {ENTITY} marketplace should be the obvious choice for that specific friction point.',
  },
  {
    type: 'callout',
    title: 'Scenario: Positioning Against Established Marketplace Giants',
    content:
      'When {PROJECT_NAME} enters a market with established platforms, avoid competing on their terms. You will never beat a horizontal marketplace on breadth of selection or a well-funded competitor on marketing spend. Instead, compete on vertical depth, specialized trust mechanisms, or superior experience for a specific niche. Position {PROJECT_NAME} as the best platform for a specific subset of {TARGET_AUDIENCE} rather than a general-purpose marketplace. Etsy succeeded against eBay by focusing exclusively on handmade and vintage items. Fiverr succeeded against Upwork by simplifying the freelance transaction into fixed-price gigs. This "wedge" strategy lets you build dense liquidity in a niche before expanding. Remember, even Uber started as a black car service for tech executives before becoming a mass-market ride-sharing platform.',
  },
  {
    type: 'text',
    title: 'Crafting Your Marketplace Value Proposition',
    content:
      'A strong marketplace UVP must address both sides of the market because each side needs a distinct and compelling reason to participate on your platform. Use this formula: "For [buyers] who [have this transaction friction], and [sellers] who [have this distribution problem], {PROJECT_NAME} is a {BUSINESS_TYPE} platform that [key benefit]. Unlike [competitors], {PROJECT_NAME} [unique differentiator]." This template forces you to be specific about the value you create for each side. Fill it in with real data from your customer research on both the buy and sell sides. Test it separately with buyers and sellers from {TARGET_AUDIENCE} and iterate until both sides see clear value. A good marketplace UVP should pass the "why not do it directly?" test — if buyers and sellers can easily transact without your platform, your value proposition is not strong enough. It should also pass the "why not use the incumbent?" test — every claim should highlight a specific advantage over existing alternatives for {ENTITY} transactions. Your UVP will appear on your landing pages for both buyers and sellers, in your onboarding flows, and in every communication with {TARGET_AUDIENCE}. Make sure it is sharp, honest, and addresses the needs of both sides of your two-sided market.',
  },
  {
    type: 'tip',
    title: 'Test Your UVP With Both Sides Separately',
    content:
      'Show your UVP to five potential buyers and five potential sellers from {TARGET_AUDIENCE} and ask each group to explain why they would use {PROJECT_NAME}. If buyers cannot articulate the benefit of finding {ENTITY} on your platform, or if sellers cannot explain why they would list there instead of finding customers directly, your value proposition needs work. The strongest marketplace UVPs make both sides feel they are getting a better deal than any alternative.',
  },
  {
    type: 'warning',
    title: 'Do Not Differentiate on Low Fees Alone',
    content:
      'Competing on take rate in a {BUSINESS_TYPE} platform is a race to the bottom. A competitor can always charge less, and a zero-fee platform funded by venture capital can undercut you entirely. Instead, differentiate {PROJECT_NAME} on the value of each transaction — better matches, higher trust, faster completion, fewer disputes. If your platform helps sellers earn 30% more per transaction through better matching with {TARGET_AUDIENCE}, a reasonable take rate becomes a small price to pay for dramatically better outcomes.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, marketplace differentiation must address both sides of the market — buyers and sellers need distinct reasons to choose {PROJECT_NAME}. Second, map the competitive landscape including established platforms, direct transactions, and traditional intermediaries. Third, find your 10x advantage — the one dimension where you dramatically reduce transaction friction for {TARGET_AUDIENCE}, whether that is trust, discovery, or simplicity. Fourth, craft a UVP using the two-sided formula and test it separately with buyers and sellers. Fifth, avoid competing on fees alone; compete on the unique transaction value your {BUSINESS_TYPE} platform delivers for {ENTITY}. These principles will help {PROJECT_NAME} build defensible network effects in a competitive marketplace landscape.',
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
      'Revenue in a marketplace is fundamentally different from other business models because you do not own the inventory — you facilitate transactions between independent buyers and sellers. For {PROJECT_NAME}, choosing the right monetization strategy means understanding how to capture a fair share of the value you create without discouraging participation on either side of the market. In this lesson you will explore the most common marketplace revenue models, learn how to calculate unit economics per transaction, and develop a pricing strategy that aligns with the value you deliver to {TARGET_AUDIENCE}. We will cover take rates, listing fees, subscription tiers for sellers, featured placement, and ancillary revenue streams. You will also learn about key financial metrics every marketplace founder must track, including Gross Merchandise Value (GMV), net revenue, take rate, and the critical balance between monetization and liquidity. By the end of this lesson you will have a clear monetization plan for {PROJECT_NAME} that balances growth with sustainable revenue. Getting your take rate and fee structure right from the start can accelerate your path to liquidity, while getting it wrong can drive away the supply or demand that your platform depends on.',
  },
  {
    type: 'text',
    title: 'Marketplace Revenue Models Explained',
    content:
      'The most common marketplace revenue models are commission-based (take rate), listing fees, subscription tiers, and featured placement. Commission-based pricing charges a percentage of each transaction — typically between 5% and 30% depending on the category and value you add. This model aligns your revenue directly with transaction volume and is the most common approach for platforms facilitating {ENTITY} transactions. Listing fees charge sellers a fixed amount to post each listing, regardless of whether it sells. This model works well when listings have value even without a transaction, such as job postings or real estate listings. Subscription tiers offer sellers premium tools, analytics, and visibility in exchange for a monthly fee. This model provides predictable revenue and works well when sellers are professionals who depend on the platform for their livelihood. Featured placement charges sellers to boost their {ENTITY} listings in search results or category pages, similar to advertising. For {PROJECT_NAME}, consider which model best matches how {TARGET_AUDIENCE} derives value from your platform. If transactions are high-value and infrequent, a commission model captures the most revenue. If transactions are frequent and low-value, subscriptions or listing fees may be more practical. Many successful marketplaces like Etsy and Airbnb use hybrid models that combine a base commission with optional premium features and promoted listings.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: Take Rate Strategy for Marketplaces',
    content:
      'Imagine {PROJECT_NAME} facilitates transactions for {ENTITY} with an average transaction value of $150. You set a 15% take rate, earning $22.50 per transaction. At 1,000 transactions per month, that generates $22,500 in net revenue on $150,000 GMV. You also offer a "Pro Seller" subscription at $49/month that gives sellers priority placement, advanced analytics, and a reduced 10% take rate. If 100 sellers subscribe, that adds $4,900 in predictable monthly revenue. This hybrid model lets {PROJECT_NAME} earn from every transaction while giving professional sellers an incentive to invest in the platform — a pattern that increases seller retention and supply quality for {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Scenario: The Take Rate Trap',
    content:
      'A marketplace founder set a 30% take rate from day one to maximize revenue per transaction. Sellers quickly calculated that they were losing nearly a third of their earnings and began directing repeat customers to transact off-platform through direct messages and personal websites. Within six months, the platform had high GMV on paper but declining actual transaction volume as sellers disintermediated the marketplace. For {PROJECT_NAME}, start with a competitive take rate that sellers perceive as fair — typically 10-20% for most categories. You can increase it later as you add more value through tools, demand generation, and trust mechanisms. Remember that a 10% take rate on a thriving marketplace generates far more revenue than a 30% take rate on a platform sellers are actively trying to circumvent.',
  },
  {
    type: 'text',
    title: 'Unit Economics: GMV, Net Revenue, and CAC',
    content:
      'Unit economics in a marketplace revolve around Gross Merchandise Value (GMV), net revenue, and the cost of acquiring participants on both sides of the market. GMV is the total value of all transactions facilitated through {PROJECT_NAME} — it represents the size of your marketplace but is not your revenue. Net revenue is the portion of GMV you keep after paying sellers, processing payments, and handling refunds. Your take rate determines the relationship between GMV and net revenue. Customer Acquisition Cost (CAC) in a marketplace must be calculated separately for buyers and sellers because the channels and costs differ significantly. Buyer CAC includes marketing spend, referral bonuses, and promotional discounts. Seller CAC includes onboarding costs, initial fee waivers, and sales team expenses. The Lifetime Value (LTV) of each participant depends on their transaction frequency and average transaction value over their entire relationship with the platform. For a healthy marketplace, the LTV-to-CAC ratio should be at least 3:1 on each side. Track these metrics from day one for {PROJECT_NAME}. Pay special attention to the ratio of buyers to sellers — most marketplaces need 5-10 active buyers per seller to maintain healthy liquidity. If this ratio drops, sellers see fewer transactions and may leave, triggering a negative spiral that can collapse your {BUSINESS_TYPE} platform.',
  },
  {
    type: 'tip',
    title: 'Subsidize the Hard Side First',
    content:
      'In the early days of {PROJECT_NAME}, consider offering reduced or zero take rates to attract the supply side. Once you have quality {ENTITY} listings from reliable sellers, buyers will come organically. Uber subsidized drivers with guaranteed hourly earnings, and Airbnb offered free professional photography to hosts. The cost of subsidizing early supply is an investment in liquidity that pays for itself once network effects kick in for {TARGET_AUDIENCE}.',
  },
  {
    type: 'warning',
    title: 'Do Not Monetize Before Achieving Liquidity',
    content:
      'The biggest monetization mistake in marketplaces is charging too much too soon. If {PROJECT_NAME} has not yet achieved consistent transaction volume where buyers reliably find what they need and sellers reliably get orders, adding fees will drive away the participants you desperately need. Focus on liquidity first, monetization second. Many successful marketplaces operated at a loss for years while building the network effects that eventually made them highly profitable. Patience with monetization is not optional — it is a survival strategy for {TARGET_AUDIENCE} platforms.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, choose a revenue model that aligns with how {TARGET_AUDIENCE} transacts on {PROJECT_NAME} — commission for high-value transactions, subscriptions for professional sellers, or a hybrid approach. Second, set a take rate that sellers perceive as fair to prevent disintermediation — typically 10-20% for most {ENTITY} categories. Third, track GMV, net revenue, and separate CAC for buyers and sellers from day one. Fourth, subsidize the harder side to attract first to build initial liquidity. Fifth, do not monetize aggressively before achieving consistent transaction volume — liquidity comes before revenue in the {BUSINESS_TYPE} playbook. These monetization principles will help {PROJECT_NAME} build a sustainable platform business.',
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
      'What gets measured gets managed, and in a marketplace the metrics you track are fundamentally different from single-sided businesses. For {PROJECT_NAME}, tracking the right metrics is essential to understanding whether your {BUSINESS_TYPE} platform is achieving the liquidity and network effects needed for long-term success. In this lesson you will learn about the key performance indicators every marketplace founder must monitor, how to set up a metrics dashboard that covers both sides of the market, and how to use data to make better decisions about growth, monetization, and platform health. We will cover transaction metrics like GMV and take rate, liquidity metrics like search-to-fill rate and time-to-transaction, and network health metrics like the buyer-to-seller ratio and repeat transaction rate. You will also learn how to avoid vanity metrics — numbers that look impressive but do not indicate whether your marketplace is actually working for {TARGET_AUDIENCE}. By the end of this lesson you will have a clear metrics framework for {PROJECT_NAME} that tells you exactly how your platform is performing and where to focus your improvement efforts. Data-driven decision making is what separates marketplaces that achieve escape velocity from those that stall in the liquidity desert.',
  },
  {
    type: 'text',
    title: 'Transaction Metrics: GMV, Net Revenue, and Take Rate',
    content:
      'Gross Merchandise Value (GMV) is the headline metric for any {BUSINESS_TYPE} platform. It represents the total value of all transactions facilitated through {PROJECT_NAME} and indicates the overall size and growth trajectory of your marketplace. However, GMV alone can be misleading — a marketplace with $1 million GMV and a 5% take rate generates only $50,000 in net revenue, while one with $500,000 GMV and a 15% take rate generates $75,000. Net revenue — the actual money {PROJECT_NAME} keeps after paying sellers and processing costs — is what funds your operations and growth. Track GMV broken down by category, geography, and customer segment to understand where growth is coming from and which verticals are most profitable for your platform. Monitor your effective take rate, which is net revenue divided by GMV, to ensure your monetization strategy is working as planned. Watch for take rate compression, which happens when sellers negotiate lower fees or shift to subscription plans with reduced commissions. For {PROJECT_NAME}, also track the average transaction value and transaction frequency per buyer and per seller separately. These metrics reveal whether your marketplace is attracting high-value participants from {TARGET_AUDIENCE} or filling up with low-value transactions that consume support resources without generating meaningful revenue.',
  },
  {
    type: 'callout',
    title: 'Real-World Scenario: The Power of Liquidity Metrics',
    content:
      'Consider two marketplace platforms, both with $500K monthly GMV. Platform A has a 90% search-to-fill rate — 9 out of 10 buyer searches result in a transaction. Platform B has a 30% search-to-fill rate — only 3 out of 10 searches convert. Platform A has strong liquidity and happy participants on both sides. Platform B has frustrated buyers who cannot find what they need and sellers who are not getting enough orders. Within 12 months, Platform A grows to $2M GMV through organic referrals while Platform B stagnates as participants leave for better alternatives. For {PROJECT_NAME}, focus obsessively on liquidity metrics — they predict future growth far better than raw GMV numbers.',
  },
  {
    type: 'callout',
    title: 'Scenario: Vanity Metrics vs. Actionable Metrics in Marketplaces',
    content:
      'A marketplace founder proudly reported 50,000 registered users and 10,000 listings for their {ENTITY} platform. But only 2,000 users had completed a transaction in the last 30 days, and the average time from search to transaction was 5 days — far too long for the category. The "registered users" and "total listings" numbers were vanity metrics that masked serious liquidity and matching problems. For {PROJECT_NAME}, focus on metrics that drive action: search-to-fill rate (what percentage of buyer searches from {TARGET_AUDIENCE} result in a completed transaction), time-to-transaction (how quickly buyers find and complete a purchase), and repeat transaction rate (what percentage of buyers and sellers transact more than once). These metrics tell you whether your marketplace is actually working.',
  },
  {
    type: 'text',
    title: 'Liquidity and Network Health Metrics',
    content:
      'Beyond transaction volume, {PROJECT_NAME} needs to track metrics that indicate marketplace health and the strength of network effects. The buyer-to-seller ratio measures the balance between supply and demand — most marketplaces need 5-10 active buyers per active seller to maintain healthy liquidity. If this ratio drops too low, sellers do not get enough orders and leave. If it rises too high, buyers cannot find available {ENTITY} and leave. The search-to-fill rate measures the percentage of buyer searches that result in a completed transaction. For most marketplaces, a rate above 70% indicates strong liquidity. Below 50% signals a matching or supply problem that needs immediate attention. The repeat transaction rate measures what percentage of participants transact more than once within 90 days. A rate above 40% on the buyer side and 60% on the seller side indicates strong product-market fit. The supplier concentration metric tracks what percentage of GMV comes from your top 10% of sellers. If concentration is too high, your marketplace is vulnerable to losing key sellers. For {PROJECT_NAME}, track these metrics weekly and set alerts for when any metric drops below your threshold. Early detection of liquidity problems gives you time to intervene before negative network effects take hold and participants from {TARGET_AUDIENCE} begin leaving your platform.',
  },
  {
    type: 'tip',
    title: 'Build a Two-Sided Dashboard From Day One',
    content:
      'Do not wait until {PROJECT_NAME} has thousands of transactions to start tracking metrics. Set up a dashboard that shows buyer-side and seller-side metrics separately using tools like Mixpanel, Amplitude, or even a well-structured spreadsheet. Track GMV, search-to-fill rate, time-to-transaction, and repeat rates weekly. Early data — even from a small number of {TARGET_AUDIENCE} participants — reveals liquidity patterns that inform critical platform decisions about where to invest in supply acquisition versus demand generation.',
  },
  {
    type: 'warning',
    title: 'Beware of GMV Inflation',
    content:
      'Total GMV can be inflated by high-value one-time transactions, promotional discounts that artificially boost volume, or even fraudulent activity. Always pair GMV with net revenue, transaction count, and fraud rate to get an accurate picture of {PROJECT_NAME} platform health. If GMV is growing but net revenue per transaction is declining, you may have a take rate or fraud problem. If GMV is growing but repeat transaction rates are flat, you may have a retention problem that will eventually stall growth among {TARGET_AUDIENCE}.',
  },
  {
    type: 'callout',
    title: 'Key Takeaways',
    content:
      'First, GMV and net revenue are the most important transaction metrics for {PROJECT_NAME} as a {BUSINESS_TYPE} platform, but they must be paired with liquidity metrics. Second, track search-to-fill rate, time-to-transaction, and repeat transaction rate to understand whether your marketplace is actually working for {TARGET_AUDIENCE}. Third, monitor the buyer-to-seller ratio to maintain healthy supply-demand balance for {ENTITY}. Fourth, avoid vanity metrics like total registered users or total listings that mask underlying liquidity problems. Fifth, build a two-sided metrics dashboard from day one and review it weekly. Data-driven decisions about where to invest in supply versus demand will help {PROJECT_NAME} achieve the network effects that make marketplace businesses defensible over time.',
  },
];



// ============================================================================
// Template Map & Export Function
// ============================================================================

/**
 * All Level 1 Marketplace lesson templates keyed by topic slug.
 */
export const level1MarketplaceTemplateMap: Record<string, Level1LessonTemplate> = {
  problem_solved: {
    topic: 'problem_solved',
    title: 'What problem does this marketplace solve?',
    description:
      'Learn how to identify, validate, and articulate the core problem your marketplace platform addresses for both buyers and sellers.',
    blocks: problemSolvedBlocks,
  },
  target_customers: {
    topic: 'target_customers',
    title: 'Who are your target customers?',
    description:
      'Define your ideal buyer and seller segments, build two-sided personas, and solve the chicken-and-egg problem.',
    blocks: targetCustomersBlocks,
  },
  unique_solution: {
    topic: 'unique_solution',
    title: 'What makes your solution unique?',
    description:
      'Discover your competitive advantages and craft a compelling value proposition for both sides of your two-sided market.',
    blocks: uniqueSolutionBlocks,
  },
  monetization: {
    topic: 'monetization',
    title: 'How will you make money?',
    description:
      'Explore marketplace revenue models, take rate strategies, and unit economics per transaction.',
    blocks: makeMoneyBlocks,
  },
  key_metrics: {
    topic: 'key_metrics',
    title: 'What are your key metrics?',
    description:
      'Learn which KPIs to track — GMV, liquidity, search-to-fill rate, network health — and how to build a data-driven marketplace business.',
    blocks: keyMetricsBlocks,
  },
};

/**
 * Return the ordered list of Level 1 Marketplace lesson templates.
 * Each template contains 5-10 ContentBlock items ready for placeholder substitution.
 */
export function getLevel1MarketplaceTemplates(): Level1LessonTemplate[] {
  return [
    level1MarketplaceTemplateMap.problem_solved,
    level1MarketplaceTemplateMap.target_customers,
    level1MarketplaceTemplateMap.unique_solution,
    level1MarketplaceTemplateMap.monetization,
    level1MarketplaceTemplateMap.key_metrics,
  ];
}

/**
 * Retrieve a single Level 1 Marketplace template by topic slug.
 * Returns undefined when the topic is not found.
 */
export function getLevel1MarketplaceTemplate(topic: string): Level1LessonTemplate | undefined {
  return level1MarketplaceTemplateMap[topic];
}
