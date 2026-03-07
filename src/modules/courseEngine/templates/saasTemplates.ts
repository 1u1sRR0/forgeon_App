export const saasTemplates = {
  business_model: {
    introduction: `A SaaS (Software as a Service) business model delivers software applications over the internet on a subscription basis. This model provides predictable recurring revenue and scales efficiently.`,
    sections: [
      {
        title: 'Core SaaS Principles',
        content: `Your SaaS application follows these key principles:
- **Subscription-based**: Users pay monthly or annually for access
- **Cloud-hosted**: No installation required, accessible anywhere
- **Continuous updates**: Features and improvements delivered automatically
- **Scalable infrastructure**: Grows with your user base`,
      },
      {
        title: 'Revenue Streams',
        content: `Common SaaS monetization strategies:
- **Tiered pricing**: Multiple plans (Basic, Pro, Enterprise)
- **Usage-based**: Pay for what you use (API calls, storage, users)
- **Freemium**: Free tier with paid upgrades
- **Per-seat pricing**: Cost per user or team member`,
        checklist: [
          'Define your pricing tiers',
          'Calculate unit economics (CAC, LTV)',
          'Set up billing infrastructure',
          'Plan for free trials',
        ],
      },
      {
        title: 'Key Metrics',
        content: `Track these essential SaaS metrics:
- **MRR/ARR**: Monthly/Annual Recurring Revenue
- **Churn Rate**: Percentage of customers who cancel
- **CAC**: Customer Acquisition Cost
- **LTV**: Lifetime Value of a customer
- **NPS**: Net Promoter Score`,
        tip: 'Aim for LTV:CAC ratio of at least 3:1 for a healthy SaaS business.',
      },
    ],
    summary: `SaaS businesses thrive on recurring revenue, customer retention, and continuous value delivery. Focus on reducing churn and increasing customer lifetime value.`,
  },

  value_proposition: {
    introduction: `Your value proposition is the unique benefit your SaaS provides that competitors don't. It answers: "Why should customers choose you?"`,
    sections: [
      {
        title: 'Defining Your Value',
        content: `A strong value proposition includes:
- **Problem**: What pain point do you solve?
- **Solution**: How do you solve it uniquely?
- **Benefit**: What outcome do customers achieve?
- **Differentiation**: Why are you better than alternatives?`,
      },
      {
        title: 'Crafting Your Message',
        content: `Your value proposition should be:
- **Clear**: Understood in 5 seconds
- **Specific**: Quantifiable benefits when possible
- **Relevant**: Addresses real customer needs
- **Unique**: Highlights your competitive advantage`,
        codeExample: `// Example: Value Prop Component
export function ValueProposition() {
  return (
    <section className="hero">
      <h1>Save 10 hours per week on {TASK}</h1>
      <p>The only {SOLUTION} built specifically for {AUDIENCE}</p>
      <button>Start Free Trial</button>
    </section>
  );
}`,
        language: 'typescript',
      },
    ],
    summary: `Your value proposition is your north star. Every feature, message, and decision should reinforce it.`,
  },

  tech_stack: {
    introduction: `Your SaaS is built with modern, production-ready technologies that enable rapid development and reliable scaling.`,
    sections: [
      {
        title: 'Frontend Stack',
        content: `**Next.js 14** with App Router provides:
- Server-side rendering for SEO and performance
- API routes for backend logic
- Built-in optimization (images, fonts, scripts)
- TypeScript for type safety`,
        codeExample: `// app/page.tsx - Server Component
export default async function HomePage() {
  const data = await fetchData(); // Runs on server
  return <Dashboard data={data} />;
}`,
        language: 'typescript',
      },
      {
        title: 'Database & ORM',
        content: `**Prisma** + **PostgreSQL** offers:
- Type-safe database queries
- Automatic migrations
- Relation management
- Connection pooling`,
        codeExample: `// Example: Prisma Query
const users = await prisma.user.findMany({
  where: { subscriptionStatus: 'active' },
  include: { subscription: true },
});`,
        language: 'typescript',
      },
      {
        title: 'Authentication',
        content: `**NextAuth.js** provides:
- Multiple auth providers (email, OAuth)
- Session management
- JWT tokens
- CSRF protection`,
        warning: 'Always use environment variables for auth secrets. Never commit them to git.',
      },
    ],
    summary: `This stack is battle-tested by thousands of SaaS companies. It balances developer experience with production reliability.`,
  },

  deployment: {
    introduction: `Deploying your SaaS to production makes it accessible to real users. We'll use Vercel for hosting and Supabase/Railway for the database.`,
    sections: [
      {
        title: 'Pre-Deployment Checklist',
        content: `Before deploying, ensure:`,
        checklist: [
          'All environment variables configured',
          'Database migrations applied',
          'Build succeeds locally (npm run build)',
          'Tests passing',
          'Error tracking configured (Sentry)',
        ],
      },
      {
        title: 'Vercel Deployment',
        content: `Deploy to Vercel in 3 steps:
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic CI/CD`,
        codeExample: `# Deploy from CLI
npm install -g vercel
vercel --prod`,
        language: 'bash',
      },
      {
        title: 'Database Setup',
        content: `Set up production database:
1. Create PostgreSQL instance (Supabase/Railway)
2. Run migrations: \`npx prisma migrate deploy\`
3. Seed initial data if needed
4. Configure connection pooling`,
        tip: 'Use connection pooling (PgBouncer) to handle serverless function connections efficiently.',
      },
      {
        title: 'Post-Deployment',
        content: `After deployment:
- Test all critical user flows
- Monitor error rates and performance
- Set up uptime monitoring (UptimeRobot)
- Configure custom domain and SSL`,
      },
    ],
    summary: `Deployment is just the beginning. Monitor, iterate, and improve based on real user feedback.`,
  },

  mvp_validation: {
    introduction: `MVP validation proves your SaaS solves a real problem people will pay for. Focus on learning, not perfection.`,
    sections: [
      {
        title: 'Validation Framework',
        content: `The Build-Measure-Learn loop:
1. **Build**: Ship minimum feature set
2. **Measure**: Track key metrics
3. **Learn**: Gather user feedback
4. **Iterate**: Improve based on data`,
      },
      {
        title: 'Key Validation Metrics',
        content: `Track these early indicators:
- **Activation rate**: % of signups who complete onboarding
- **Engagement**: Daily/weekly active users
- **Retention**: % of users who return
- **Conversion**: Free to paid conversion rate`,
        checklist: [
          'Set up analytics (PostHog, Mixpanel)',
          'Define success metrics',
          'Create feedback collection system',
          'Schedule user interviews',
        ],
      },
      {
        title: 'Feedback Collection',
        content: `Gather qualitative feedback through:
- In-app surveys (after key actions)
- User interviews (5-10 per week)
- Support tickets analysis
- Feature request tracking`,
        tip: 'Ask "What would make you recommend this to a colleague?" to uncover true value.',
      },
    ],
    summary: `Validation is ongoing. Keep talking to users and iterating based on their needs.`,
  },

  scaling_strategy: {
    introduction: `Scaling your SaaS means growing revenue while maintaining or improving unit economics. Focus on sustainable growth.`,
    sections: [
      {
        title: 'Technical Scaling',
        content: `Prepare for growth:
- **Database**: Add indexes, optimize queries, consider read replicas
- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Use Vercel Edge Network for static assets
- **Background jobs**: Move heavy tasks to queues (BullMQ)`,
      },
      {
        title: 'Growth Channels',
        content: `Prioritize channels by efficiency:
1. **Product-led growth**: Free tier, viral loops
2. **Content marketing**: SEO, blog, tutorials
3. **Partnerships**: Integrations, affiliates
4. **Paid ads**: Once CAC < LTV/3`,
        warning: 'Don\'t scale paid acquisition until you have product-market fit and positive unit economics.',
      },
      {
        title: 'Team Scaling',
        content: `Hire strategically:
- First hire: Customer success (reduce churn)
- Second hire: Sales/marketing (grow revenue)
- Third hire: Engineering (increase velocity)`,
      },
    ],
    summary: `Scale what works. Double down on channels with best ROI and fix retention before adding more users.`,
  },
};
