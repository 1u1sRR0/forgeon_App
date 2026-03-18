/**
 * Integration Test: ContentRenderer Compatibility
 *
 * Validates: Requirements 11.4
 *
 * Verifies that enhanced lesson content blocks conform to the data contract
 * expected by the ContentRenderer component. This test checks structural
 * compatibility — that every block produced by the lesson builder has the
 * correct shape (type, content, metadata fields) so ContentRenderer can
 * render it without errors.
 *
 * ContentRenderer expects blocks with:
 *   - type: 'text' | 'code' | 'checklist' | 'warning' | 'tip' | 'callout' | 'step'
 *   - content?: string   (used by text, code, warning, tip, callout)
 *   - language?: string   (used by code blocks)
 *   - items?: string[]    (used by checklist blocks)
 *   - title?: string      (used by callout, warning, tip, step)
 *   - steps?: string[]    (used by step blocks)
 */

import { ContentBlock, ContentBlockType, ProjectContext } from '../courseTypes';
import { buildLessons } from '../lessonBuilder';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_BLOCK_TYPES: ContentBlockType[] = [
  'text',
  'code',
  'checklist',
  'warning',
  'tip',
  'callout',
  'step',
];

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, message: string): void {
  results.push({ name, passed: condition, message });
  if (!condition) {
    console.log(`  ✗ ${name}: ${message}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

// ---------------------------------------------------------------------------
// Sample project context used to generate lessons
// ---------------------------------------------------------------------------

function createSaaSContext(): ProjectContext {
  return {
    projectId: 'test-project-001',
    name: 'TaskFlow Pro',
    problemStatement: 'Teams waste hours on manual task tracking and status updates.',
    solution: 'An AI-powered task management platform that automates status updates.',
    businessType: 'SaaS',
    businessModel: 'subscription',
    industry: 'Productivity',
    targetAudience: 'Small to mid-size development teams',
    monetization: 'Monthly subscription tiers',
    monetizationModel: 'subscription',
    templateType: 'saas',
    projectType: 'saas',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    uniqueValue: 'AI-driven automatic status updates from code commits',
    wizardAnswers: {
      targetAudience: 'Small to mid-size development teams',
      problemStatement: 'Manual task tracking wastes developer time',
    },
  };
}

// ---------------------------------------------------------------------------
// Validation functions
// ---------------------------------------------------------------------------

/**
 * Validates that a block has a valid ContentBlockType recognised by
 * ContentRenderer's switch statement.
 */
function isValidBlockType(type: string): type is ContentBlockType {
  return (VALID_BLOCK_TYPES as string[]).includes(type);
}

/**
 * Validates that a text block has the fields ContentRenderer uses.
 * ContentRenderer renders block.content inside a <div>.
 */
function validateTextBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] text has content`,
    typeof block.content === 'string' && block.content.length > 0,
    `text block at index ${idx} must have non-empty content string`,
  );
}

/**
 * Validates that a code block has the fields ContentRenderer uses.
 * ContentRenderer renders block.content inside <pre><code>.
 * It does not currently use block.language, but the field should be present
 * for future syntax-highlighting support.
 */
function validateCodeBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] code has content`,
    typeof block.content === 'string' && block.content.length > 0,
    `code block at index ${idx} must have non-empty content string`,
  );
  assert(
    `Block[${idx}] code has language metadata`,
    typeof block.language === 'string' && block.language.length > 0,
    `code block at index ${idx} should have a language string`,
  );
}

/**
 * Validates that a checklist block has the fields ContentRenderer uses.
 * ContentRenderer iterates over block.items to render <li> elements.
 */
function validateChecklistBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] checklist has items`,
    Array.isArray(block.items) && block.items.length > 0,
    `checklist block at index ${idx} must have a non-empty items array`,
  );
  if (Array.isArray(block.items)) {
    block.items.forEach((item, itemIdx) => {
      assert(
        `Block[${idx}] checklist item[${itemIdx}] is string`,
        typeof item === 'string' && item.length > 0,
        `checklist item at index ${itemIdx} must be a non-empty string`,
      );
    });
  }
}

/**
 * Validates warning block. ContentRenderer uses block.title (optional) and
 * block.content.
 */
function validateWarningBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] warning has content`,
    typeof block.content === 'string' && block.content.length > 0,
    `warning block at index ${idx} must have non-empty content`,
  );
  // title is optional in ContentRenderer but required by the enhanced spec
  assert(
    `Block[${idx}] warning has title`,
    typeof block.title === 'string' && block.title.length > 0,
    `warning block at index ${idx} should have a title for display`,
  );
}

/**
 * Validates tip block. ContentRenderer uses block.title (optional) and
 * block.content.
 */
function validateTipBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] tip has content`,
    typeof block.content === 'string' && block.content.length > 0,
    `tip block at index ${idx} must have non-empty content`,
  );
  assert(
    `Block[${idx}] tip has title`,
    typeof block.title === 'string' && block.title.length > 0,
    `tip block at index ${idx} should have a title for display`,
  );
}

/**
 * Validates callout block. ContentRenderer uses block.title (optional) and
 * block.content.
 */
function validateCalloutBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] callout has content`,
    typeof block.content === 'string' && block.content.length > 0,
    `callout block at index ${idx} must have non-empty content`,
  );
  assert(
    `Block[${idx}] callout has title`,
    typeof block.title === 'string' && block.title.length > 0,
    `callout block at index ${idx} should have a title for display`,
  );
}

/**
 * Validates step block. ContentRenderer uses block.title (optional) and
 * block.steps to render an ordered list.
 */
function validateStepBlock(block: ContentBlock, idx: number): void {
  // ContentRenderer's local interface has steps?: string[]
  const anyBlock = block as ContentBlock & { steps?: string[] };
  assert(
    `Block[${idx}] step has steps array`,
    Array.isArray(anyBlock.steps) && anyBlock.steps.length > 0,
    `step block at index ${idx} must have a non-empty steps array`,
  );
  if (Array.isArray(anyBlock.steps)) {
    anyBlock.steps.forEach((step, stepIdx) => {
      assert(
        `Block[${idx}] step item[${stepIdx}] is string`,
        typeof step === 'string' && step.length > 0,
        `step item at index ${stepIdx} must be a non-empty string`,
      );
    });
  }
}

/**
 * Dispatch validation to the correct block-type validator.
 */
function validateBlock(block: ContentBlock, idx: number): void {
  assert(
    `Block[${idx}] has valid type`,
    isValidBlockType(block.type),
    `block type "${block.type}" is not recognised by ContentRenderer`,
  );

  switch (block.type) {
    case 'text':
      validateTextBlock(block, idx);
      break;
    case 'code':
      validateCodeBlock(block, idx);
      break;
    case 'checklist':
      validateChecklistBlock(block, idx);
      break;
    case 'warning':
      validateWarningBlock(block, idx);
      break;
    case 'tip':
      validateTipBlock(block, idx);
      break;
    case 'callout':
      validateCalloutBlock(block, idx);
      break;
    case 'step':
      validateStepBlock(block, idx);
      break;
  }
}

// ---------------------------------------------------------------------------
// Main test runner
// ---------------------------------------------------------------------------

function runTests(): void {
  console.log('🔍 ContentRenderer Compatibility Integration Test\n');
  console.log('Validates: Requirements 11.4\n');

  const context = createSaaSContext();

  // Generate lessons for Level 1 (business-focused, should have callouts, tips, warnings)
  console.log('--- Level 1: Understanding the Problem ---');
  const level1Lessons = buildLessons(1, 'Understanding the Problem', context);

  assert(
    'Level 1 generates at least one lesson',
    level1Lessons.length > 0,
    `Expected at least 1 lesson, got ${level1Lessons.length}`,
  );

  // Track which block types we encounter across all lessons
  const seenTypes = new Set<string>();

  for (const lesson of level1Lessons) {
    console.log(`\n  Lesson: "${lesson.title}" (${lesson.content.length} blocks)`);

    assert(
      `Lesson "${lesson.title}" has content array`,
      Array.isArray(lesson.content),
      'lesson.content must be an array',
    );

    assert(
      `Lesson "${lesson.title}" has 1+ blocks`,
      lesson.content.length >= 1,
      `Expected at least 1 block, got ${lesson.content.length}`,
    );

    for (let i = 0; i < lesson.content.length; i++) {
      const block = lesson.content[i];
      seenTypes.add(block.type);
      validateBlock(block, i);
    }
  }

  // Also generate Level 4 lessons (technical architecture, should include code blocks)
  console.log('\n--- Level 4: Technical Architecture ---');
  const level4Lessons = buildLessons(4, 'Technical Architecture', context);

  for (const lesson of level4Lessons) {
    console.log(`\n  Lesson: "${lesson.title}" (${lesson.content.length} blocks)`);

    for (let i = 0; i < lesson.content.length; i++) {
      const block = lesson.content[i];
      seenTypes.add(block.type);
      validateBlock(block, i);
    }
  }

  // Verify we saw a good variety of block types
  console.log('\n--- Block Type Coverage ---');
  const expectedTypes: ContentBlockType[] = ['text', 'callout', 'tip', 'warning'];
  for (const t of expectedTypes) {
    assert(
      `Block type "${t}" was generated`,
      seenTypes.has(t),
      `Expected to see at least one "${t}" block across all lessons`,
    );
  }

  // Code blocks should appear in level 4 (technical architecture)
  assert(
    'Code blocks generated for technical level',
    seenTypes.has('code'),
    'Expected code blocks in Level 4 technical lessons',
  );

  // Checklist blocks may or may not appear depending on level; just note coverage
  console.log(`\n  Block types seen: ${[...seenTypes].sort().join(', ')}`);

  // ---------------------------------------------------------------------------
  // Additional test: manually constructed enhanced content (5-10 blocks)
  // ---------------------------------------------------------------------------
  console.log('\n--- Manual Enhanced Content Compatibility ---');

  const enhancedContent: (ContentBlock & { steps?: string[] })[] = [
    {
      type: 'text',
      content:
        'This is an introduction paragraph with enough words to meet the minimum requirement for enhanced lessons. It covers the topic in depth and sets the stage for what follows.',
    },
    {
      type: 'text',
      content:
        'This is a detailed explanation block that dives deeper into the subject matter, providing context and background information that helps the learner understand the concepts.',
    },
    {
      type: 'code',
      content: 'const project = { name: "TaskFlow Pro", type: "saas" };',
      language: 'typescript',
    },
    {
      type: 'tip',
      title: 'Pro Tip',
      content: 'Always validate your assumptions with real users before building features.',
    },
    {
      type: 'warning',
      title: 'Common Mistake',
      content: 'Do not skip user research — it is the most common cause of product failure.',
    },
    {
      type: 'callout',
      title: 'Real-World Example',
      content:
        'A SaaS startup validated their idea with 50 customer interviews before writing any code, resulting in 3x faster product-market fit.',
    },
    {
      type: 'checklist',
      items: [
        'Define the core problem',
        'Identify target audience',
        'Validate with 10+ users',
        'Build MVP scope',
      ],
    },
    {
      type: 'step',
      title: 'Getting Started',
      steps: [
        'Set up your development environment',
        'Create the project scaffold',
        'Configure the database',
        'Implement authentication',
      ],
    },
    {
      type: 'callout',
      title: 'Key Takeaways',
      content:
        'Remember to validate early, build incrementally, and always keep the user at the center of your decisions.',
    },
  ];

  assert(
    'Enhanced content has 5-10 blocks',
    enhancedContent.length >= 5 && enhancedContent.length <= 10,
    `Expected 5-10 blocks, got ${enhancedContent.length}`,
  );

  for (let i = 0; i < enhancedContent.length; i++) {
    validateBlock(enhancedContent[i] as ContentBlock, i);
  }

  // Verify all 7 block types are represented in the manual content
  const manualTypes = new Set(enhancedContent.map((b) => b.type));
  for (const t of VALID_BLOCK_TYPES) {
    assert(
      `Manual content includes "${t}" block`,
      manualTypes.has(t),
      `Enhanced content should include a "${t}" block for full coverage`,
    );
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n📊 Summary');
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ FAILED assertions:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => console.log(`  - ${r.name}: ${r.message}`));
    process.exit(1);
  } else {
    console.log('\n✅ All assertions passed — enhanced content is compatible with ContentRenderer');
    process.exit(0);
  }
}

runTests();
