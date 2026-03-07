/**
 * Bug Condition Exploration Test for TypeScript Compilation Errors
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * GOAL: Surface counterexamples that demonstrate the compilation errors exist
 * 
 * Property 1: Fault Condition - TypeScript Compilation Errors Detection
 * 
 * This test verifies that approximately 18 TypeScript compilation errors exist
 * across the following categories:
 * 1. Module import errors (marketIntelTypes)
 * 2. Implicit 'any' type errors (signal, idx, risk, item parameters)
 * 3. Non-existent function imports (saveCourse)
 * 4. Missing properties (ContentBlock content, marketGapId)
 * 5. String index signature errors (template access)
 * 6. Prisma type mismatches (evidence, Opportunity fields, Project.title)
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CompilationError {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
}

/**
 * Runs TypeScript compilation and captures all errors
 */
function runTypeScriptCompilation(): CompilationError[] {
  // Run tsc with --noEmit to check for errors without generating output
  const result = spawnSync('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf-8',
    shell: true
  });
  
  const output = result.stdout + result.stderr;
  console.log('DEBUG - Exit code:', result.status);
  console.log('DEBUG - stdout length:', result.stdout?.length || 0);
  console.log('DEBUG - stderr length:', result.stderr?.length || 0);
  console.log('DEBUG - First 500 chars of output:', output.substring(0, 500));
  
  return parseTypeScriptErrors(output);
}

/**
 * Parses TypeScript error output into structured error objects
 */
function parseTypeScriptErrors(output: string): CompilationError[] {
  const errors: CompilationError[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    // Match TypeScript error format: file(line,column): error TSxxxx: message
    const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
    if (match) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: match[4],
        message: match[5]
      });
    }
  }
  
  return errors;
}

/**
 * Checks if an error matches a specific bug condition
 */
function matchesErrorPattern(error: CompilationError, pattern: {
  filePattern?: RegExp;
  codePattern?: RegExp;
  messagePattern?: RegExp;
}): boolean {
  if (pattern.filePattern && !pattern.filePattern.test(error.file)) {
    return false;
  }
  if (pattern.codePattern && !pattern.codePattern.test(error.code)) {
    return false;
  }
  if (pattern.messagePattern && !pattern.messagePattern.test(error.message)) {
    return false;
  }
  return true;
}

/**
 * Main test function - verifies all bug conditions exist
 */
function testBugConditions() {
  console.log('🔍 Running Bug Condition Exploration Test...\n');
  console.log('CRITICAL: This test MUST FAIL on unfixed code\n');
  
  const errors = runTypeScriptCompilation();
  
  console.log(`Found ${errors.length} TypeScript compilation errors\n`);
  
  // Define expected bug conditions based on bugfix.md requirements
  const bugConditions = [
    {
      name: 'Bug 1.1: Module not found - marketIntelTypes',
      requirement: '2.1',
      pattern: {
        filePattern: /market-intelligence\/page\.tsx$/,
        codePattern: /TS2307/,
        messagePattern: /Cannot find module.*marketIntel\/marketIntelTypes/
      }
    },
    {
      name: 'Bug 1.2: Implicit any - signal parameter',
      requirement: '2.2',
      pattern: {
        filePattern: /market-intelligence\/page\.tsx$/,
        codePattern: /TS7006/,
        messagePattern: /Parameter 'signal' implicitly has an 'any' type/
      }
    },
    {
      name: 'Bug 1.2: Implicit any - idx parameter',
      requirement: '2.2',
      pattern: {
        filePattern: /market-intelligence\/page\.tsx$/,
        codePattern: /TS7006/,
        messagePattern: /Parameter 'idx' implicitly has an 'any' type/
      }
    },
    {
      name: 'Bug 1.2: Implicit any - risk parameter',
      requirement: '2.2',
      pattern: {
        filePattern: /market-intelligence\/page\.tsx$/,
        codePattern: /TS7006/,
        messagePattern: /Parameter 'risk' implicitly has an 'any' type/
      }
    },
    {
      name: 'Bug 1.2: Implicit any - item parameter',
      requirement: '2.2',
      pattern: {
        filePattern: /market-intelligence\/page\.tsx$/,
        codePattern: /TS7006/,
        messagePattern: /Parameter 'item' implicitly has an 'any' type/
      }
    },
    {
      name: 'Bug 1.3: Non-existent function - saveCourse',
      requirement: '2.3',
      pattern: {
        filePattern: /buildExecutor\.ts$/,
        codePattern: /TS2339/,
        messagePattern: /Property 'saveCourse' does not exist/
      }
    },
    {
      name: 'Bug 1.5: Missing property - ContentBlock content',
      requirement: '2.5',
      pattern: {
        filePattern: /genericTemplates\.ts$/,
        codePattern: /TS2345/,
        messagePattern: /Property 'content' is missing.*ContentBlock/
      }
    },
    {
      name: 'Bug 1.6: String index signature - template access',
      requirement: '2.6',
      pattern: {
        filePattern: /templates\/index\.ts$/,
        codePattern: /TS7053/,
        messagePattern: /Element implicitly has an 'any' type.*No index signature/
      }
    },
    {
      name: 'Bug 1.7: Prisma type mismatch - evidence field',
      requirement: '2.7',
      pattern: {
        filePattern: /marketGapService\.ts$/,
        codePattern: /TS2322/,
        messagePattern: /GapEvidence\[\].*JsonNull|InputJsonValue/
      }
    },
    {
      name: 'Bug 1.8: Missing required field - marketGapId',
      requirement: '2.8',
      pattern: {
        filePattern: /marketGapService\.ts$/,
        codePattern: /TS2322/,
        messagePattern: /Property 'marketGapId' is missing/
      }
    },
    {
      name: 'Bug 1.9: Missing Opportunity fields',
      requirement: '2.9',
      pattern: {
        filePattern: /opportunityService\.ts$/,
        codePattern: /TS2322/,
        messagePattern: /missing the following properties.*category.*problemStatement.*targetAudience.*solutionOverview.*coreFeatures/
      }
    },
    {
      name: 'Bug 1.10: Wrong field name - Project.title',
      requirement: '2.10',
      pattern: {
        filePattern: /opportunityService\.ts$/,
        codePattern: /TS2353/,
        messagePattern: /'title' does not exist.*Project/
      }
    }
  ];
  
  // Check each bug condition
  const results: { condition: string; found: boolean; matchingErrors: CompilationError[] }[] = [];
  
  for (const condition of bugConditions) {
    const matchingErrors = errors.filter(error => matchesErrorPattern(error, condition.pattern));
    const found = matchingErrors.length > 0;
    
    results.push({
      condition: condition.name,
      found,
      matchingErrors
    });
    
    console.log(`${found ? '✓' : '✗'} ${condition.name} (Req ${condition.requirement})`);
    if (found) {
      matchingErrors.forEach(err => {
        console.log(`  → ${err.file}(${err.line},${err.column}): ${err.code}`);
        console.log(`    ${err.message.substring(0, 80)}...`);
      });
    }
  }
  
  console.log('\n📊 Summary:');
  const foundCount = results.filter(r => r.found).length;
  const totalCount = results.length;
  console.log(`Found ${foundCount}/${totalCount} expected bug conditions`);
  console.log(`Total compilation errors: ${errors.length}`);
  
  // Document all errors for analysis
  console.log('\n📝 All Compilation Errors:');
  const errorsByFile = new Map<string, CompilationError[]>();
  errors.forEach(error => {
    const fileName = error.file.split(/[/\\]/).pop() || error.file;
    if (!errorsByFile.has(fileName)) {
      errorsByFile.set(fileName, []);
    }
    errorsByFile.get(fileName)!.push(error);
  });
  
  errorsByFile.forEach((fileErrors, fileName) => {
    console.log(`\n  ${fileName}: ${fileErrors.length} errors`);
    fileErrors.forEach(err => {
      console.log(`    - Line ${err.line}: ${err.code} - ${err.message.substring(0, 60)}...`);
    });
  });
  
  // CRITICAL: This test MUST FAIL on unfixed code
  // The test passes when NO compilation errors exist (after fix)
  // The test fails when compilation errors exist (before fix)
  console.log('\n🎯 Test Result:');
  if (errors.length === 0) {
    console.log('✅ PASS: No compilation errors found (bug is FIXED)');
    process.exit(0);
  } else {
    console.log(`❌ FAIL: ${errors.length} compilation errors found (bug EXISTS)`);
    console.log('This is EXPECTED on unfixed code - the bug is confirmed!');
    process.exit(1);
  }
}

// Run the test
testBugConditions();
