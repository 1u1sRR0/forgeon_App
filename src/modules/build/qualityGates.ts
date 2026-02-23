// Quality gates for build validation

import * as fs from 'fs';
import * as path from 'path';
import { QualityCheckResult } from './types';

export class QualityGates {
  private buildDir: string;
  private entityName: string;

  constructor(buildDir: string, entityName: string) {
    this.buildDir = buildDir;
    this.entityName = entityName;
  }

  /**
   * Run all quality checks
   */
  async runChecks(): Promise<QualityCheckResult> {
    const checks: Array<{
      name: string;
      passed: boolean;
      message: string;
    }> = [];

    // Check 1: Required files exist
    const requiredFiles = [
      'package.json',
      'next.config.ts',
      'tsconfig.json',
      'tailwind.config.ts',
      'prisma/schema.prisma',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'README.md',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.buildDir, file);
      const exists = fs.existsSync(filePath);
      checks.push({
        name: `File exists: ${file}`,
        passed: exists,
        message: exists ? `✓ ${file} found` : `✗ ${file} missing`,
      });
    }

    // Check 2: Required directories exist
    const requiredDirs = [
      'src/app',
      'src/app/api',
      'src/app/(auth)',
      'src/app/(dashboard)',
      'src/lib',
      'prisma',
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.buildDir, dir);
      const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
      checks.push({
        name: `Directory exists: ${dir}`,
        passed: exists,
        message: exists ? `✓ ${dir}/ found` : `✗ ${dir}/ missing`,
      });
    }

    // Check 3: Prisma schema contains User model
    const schemaPath = path.join(this.buildDir, 'prisma/schema.prisma');
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      const hasUserModel = schemaContent.includes('model User');
      checks.push({
        name: 'Prisma schema contains User model',
        passed: hasUserModel,
        message: hasUserModel
          ? '✓ User model found in schema'
          : '✗ User model missing from schema',
      });

      // Check 4: Prisma schema contains entity model
      const entityNameUpper = this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
      const hasEntityModel = schemaContent.includes(`model ${entityNameUpper}`);
      checks.push({
        name: `Prisma schema contains ${entityNameUpper} model`,
        passed: hasEntityModel,
        message: hasEntityModel
          ? `✓ ${entityNameUpper} model found in schema`
          : `✗ ${entityNameUpper} model missing from schema`,
      });
    } else {
      checks.push({
        name: 'Prisma schema validation',
        passed: false,
        message: '✗ Prisma schema file not found',
      });
    }

    // Check 5: package.json is valid JSON
    const packageJsonPath = path.join(this.buildDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const hasName = !!packageJson.name;
        const hasDependencies = !!packageJson.dependencies;
        const hasScripts = !!packageJson.scripts;

        checks.push({
          name: 'package.json is valid',
          passed: hasName && hasDependencies && hasScripts,
          message:
            hasName && hasDependencies && hasScripts
              ? '✓ package.json is valid and complete'
              : '✗ package.json is missing required fields',
        });
      } catch (error) {
        checks.push({
          name: 'package.json is valid JSON',
          passed: false,
          message: '✗ package.json is not valid JSON',
        });
      }
    }

    // Check 6: API routes exist
    const entityNamePlural = this.entityName.toLowerCase() + 's';
    const apiRoutes = [
      `src/app/api/${entityNamePlural}/route.ts`,
      `src/app/api/${entityNamePlural}/[id]/route.ts`,
      'src/app/api/auth/[...nextauth]/route.ts',
      'src/app/api/auth/register/route.ts',
    ];

    for (const route of apiRoutes) {
      const routePath = path.join(this.buildDir, route);
      const exists = fs.existsSync(routePath);
      checks.push({
        name: `API route exists: ${route}`,
        passed: exists,
        message: exists ? `✓ ${route} found` : `✗ ${route} missing`,
      });
    }

    // Check 7: Dashboard pages exist
    const dashboardPages = [
      'src/app/(dashboard)/dashboard/page.tsx',
      `src/app/(dashboard)/dashboard/${entityNamePlural}/new/page.tsx`,
      `src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/page.tsx`,
      `src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/edit/page.tsx`,
    ];

    for (const page of dashboardPages) {
      const pagePath = path.join(this.buildDir, page);
      const exists = fs.existsSync(pagePath);
      checks.push({
        name: `Dashboard page exists: ${page}`,
        passed: exists,
        message: exists ? `✓ ${page} found` : `✗ ${page} missing`,
      });
    }

    // Check 8: Auth pages exist
    const authPages = [
      'src/app/(auth)/login/page.tsx',
      'src/app/(auth)/register/page.tsx',
    ];

    for (const page of authPages) {
      const pagePath = path.join(this.buildDir, page);
      const exists = fs.existsSync(pagePath);
      checks.push({
        name: `Auth page exists: ${page}`,
        passed: exists,
        message: exists ? `✓ ${page} found` : `✗ ${page} missing`,
      });
    }

    // Check 9: Build directory is not empty
    const files = fs.readdirSync(this.buildDir);
    const notEmpty = files.length > 0;
    checks.push({
      name: 'Build directory is not empty',
      passed: notEmpty,
      message: notEmpty
        ? `✓ Build directory contains ${files.length} items`
        : '✗ Build directory is empty',
    });

    // Determine overall pass/fail
    const allPassed = checks.every((check) => check.passed);

    return {
      passed: allPassed,
      checks,
    };
  }
}
