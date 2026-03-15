import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

function genId() {
  return crypto.randomUUID();
}

async function main() {
  console.log('🌱 Seeding database...');

  const now = new Date();
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mvpincubator.com' },
    update: {},
    create: {
      id: genId(),
      email: 'demo@mvpincubator.com',
      name: 'Demo User',
      password: hashedPassword,
      updatedAt: now,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample project in IDEA state
  const ideaProject = await prisma.project.upsert({
    where: { id: 'demo-idea-project' },
    update: {},
    create: {
      id: 'demo-idea-project',
      name: 'AI-Powered Task Manager',
      description: 'A smart task management app that uses AI to prioritize and suggest optimal work schedules',
      state: 'IDEA',
      userId: demoUser.id,
      updatedAt: now,
    },
  });

  console.log('✅ Created IDEA project:', ideaProject.name);

  // Create sample project in STRUCTURED state with wizard answers
  const structuredProject = await prisma.project.upsert({
    where: { id: 'demo-structured-project' },
    update: {},
    create: {
      id: 'demo-structured-project',
      name: 'Freelance Marketplace for Designers',
      description: 'A curated marketplace connecting businesses with vetted freelance designers',
      state: 'STRUCTURED',
      userId: demoUser.id,
      updatedAt: now,
    },
  });

  // Add wizard answers for structured project
  const wizardAnswers = [
    { step: 1, key: 'userRole', value: 'Entrepreneur' },
    { step: 1, key: 'experience', value: 'Some experience with digital products' },
    { step: 2, key: 'goal', value: 'Build a sustainable business' },
    { step: 2, key: 'timeline', value: '6-12 months' },
    { step: 3, key: 'businessType', value: 'Marketplace' },
    { step: 4, key: 'targetAudience', value: 'Small to medium businesses needing design work (10-100 employees)' },
    { step: 5, key: 'problemStatement', value: 'Businesses struggle to find reliable, high-quality freelance designers.' },
    { step: 6, key: 'valueProposition', value: 'Curated marketplace with pre-vetted designers and quality guarantees' },
    { step: 7, key: 'monetizationModel', value: 'Commission on transactions (15% from designers)' },
    { step: 8, key: 'differentiation', value: 'Strict vetting process, quality guarantees, integrated project management' },
    { step: 9, key: 'deliveryModel', value: 'Online platform with escrow payments and milestone tracking' },
    { step: 10, key: 'risks', value: 'Competition from established platforms, designer acquisition costs' },
  ];

  for (const answer of wizardAnswers) {
    await prisma.wizardAnswer.upsert({
      where: {
        projectId_step_key: {
          projectId: structuredProject.id,
          step: answer.step,
          key: answer.key,
        },
      },
      update: {},
      create: {
        id: genId(),
        projectId: structuredProject.id,
        step: answer.step,
        key: answer.key,
        value: answer.value,
        completed: true,
        updatedAt: now,
      },
    });
  }

  console.log('✅ Created STRUCTURED project with wizard answers:', structuredProject.name);

  // Create sample project in BUILD_READY state
  const buildReadyProject = await prisma.project.upsert({
    where: { id: 'demo-buildready-project' },
    update: {},
    create: {
      id: 'demo-buildready-project',
      name: 'SaaS Analytics Dashboard',
      description: 'Real-time analytics dashboard for SaaS businesses to track key metrics',
      state: 'BUILD_READY',
      userId: demoUser.id,
      updatedAt: now,
    },
  });

  // Add viability score
  await prisma.viabilityScore.create({
    data: {
      id: genId(),
      projectId: buildReadyProject.id,
      marketScore: 22,
      productScore: 21,
      financialScore: 20,
      executionScore: 19,
      totalScore: 82,
      breakdownReasons: JSON.stringify([
        { category: 'Market', reason: 'Strong market demand', points: 22, penalty: 0 },
        { category: 'Product', reason: 'Clear value proposition', points: 21, penalty: 0 },
        { category: 'Financial', reason: 'Viable monetization model', points: 20, penalty: 0 },
        { category: 'Execution', reason: 'Feasible technical implementation', points: 19, penalty: 0 },
      ]),
      criticalFlags: JSON.stringify([]),
    },
  });

  // Add template mapping
  await prisma.templateMapping.create({
    data: {
      id: genId(),
      projectId: buildReadyProject.id,
      recommendedTemplate: 'SAAS_BASIC',
      confidence: 0.95,
      reasoning: 'SaaS business model with dashboard UI requirements matches SAAS_BASIC template',
      updatedAt: now,
    },
  });

  // Add artifacts
  const artifactTypes = [
    'BUSINESS_MODEL_CANVAS',
    'PRODUCT_REQUIREMENTS',
    'TECHNICAL_ARCHITECTURE',
    'USER_STORIES',
    'RISK_ASSESSMENT',
    'GO_TO_MARKET',
  ];

  for (const type of artifactTypes) {
    await prisma.generatedArtifact.create({
      data: {
        id: genId(),
        projectId: buildReadyProject.id,
        type: type as any,
        title: `${type.replace(/_/g, ' ')} for ${buildReadyProject.name}`,
        content: `# ${type.replace(/_/g, ' ')}\n\nSample artifact for demonstration.\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3`,
        updatedAt: now,
      },
    });
  }

  console.log('✅ Created BUILD_READY project with evaluation:', buildReadyProject.name);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📧 Demo credentials:');
  console.log('   Email: demo@mvpincubator.com');
  console.log('   Password: Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
