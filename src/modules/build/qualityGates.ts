// Quality gates for build validation

import * as fs from 'fs';
import * as path from 'path';
import { QualityCheckResult, TemplateType } from './types';

export class QualityGates {
  private buildDir: string;
  private entityName: string;
  private templateType: TemplateType;

  constructor(buildDir: string, entityName: string, templateType: TemplateType = 'SAAS_BASIC') {
    this.buildDir = buildDir;
    this.entityName = entityName;
    this.templateType = templateType;
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

    // Template-specific checks
    switch (this.templateType) {
      case 'MARKETPLACE_MINI':
        checks.push(...this.checkMarketplaceFiles());
        break;
      case 'ECOMMERCE_MINI':
        checks.push(...this.checkEcommerceFiles());
        break;
      case 'LANDING_BLOG':
        checks.push(...this.checkLandingBlogFiles());
        break;
    }

    // Check 10: Shared components exist
    checks.push(...this.checkSharedComponents());

    // Check 11: Import validity in TypeScript files
    checks.push(...this.checkImportValidity());

    // Check 12: Advanced template pages exist
    checks.push(...this.checkAdvancedTemplatePages());

    // Check 13: Zod schemas in API routes with input
    checks.push(...this.checkZodSchemas());

    // Determine overall pass/fail
    const allPassed = checks.every((check) => check.passed);

    return {
      passed: allPassed,
      checks,
    };
  }

  /**
   * Check that a file exists and is non-empty
   */
  private checkFileExistsAndNonEmpty(relativePath: string): { name: string; passed: boolean; message: string } {
    const filePath = path.join(this.buildDir, relativePath);
    const exists = fs.existsSync(filePath);
    if (!exists) {
      return {
        name: `Template file: ${relativePath}`,
        passed: false,
        message: `✗ ${relativePath} missing`,
      };
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const nonEmpty = content.trim().length > 0;
    return {
      name: `Template file: ${relativePath}`,
      passed: nonEmpty,
      message: nonEmpty
        ? `✓ ${relativePath} found and non-empty`
        : `✗ ${relativePath} exists but is empty`,
    };
  }

  /**
   * Validate marketplace-specific files exist and are non-empty
   */
  private checkMarketplaceFiles(): Array<{ name: string; passed: boolean; message: string }> {
    const marketplaceFiles = [
      'prisma/schema.prisma',
      'src/app/api/listings/route.ts',
      'src/app/api/listings/[id]/route.ts',
      'src/app/api/listings/search/route.ts',
      'src/app/api/transactions/route.ts',
      'src/app/(dashboard)/dashboard/listings/page.tsx',
      'src/app/(dashboard)/dashboard/listings/[id]/page.tsx',
      'src/app/(dashboard)/dashboard/listings/publish/page.tsx',
      'src/app/(dashboard)/dashboard/seller/page.tsx',
    ];
    return marketplaceFiles.map((file) => this.checkFileExistsAndNonEmpty(file));
  }

  /**
   * Validate e-commerce-specific files exist and are non-empty
   */
  private checkEcommerceFiles(): Array<{ name: string; passed: boolean; message: string }> {
    const ecommerceFiles = [
      'prisma/schema.prisma',
      'src/app/api/products/route.ts',
      'src/app/api/products/[id]/route.ts',
      'src/app/api/cart/route.ts',
      'src/app/api/orders/route.ts',
      'src/app/(dashboard)/dashboard/catalog/page.tsx',
      'src/app/(dashboard)/dashboard/catalog/[id]/page.tsx',
      'src/app/(dashboard)/dashboard/cart/page.tsx',
      'src/app/(dashboard)/dashboard/checkout/page.tsx',
    ];
    return ecommerceFiles.map((file) => this.checkFileExistsAndNonEmpty(file));
  }

  /**
   * Validate landing+blog-specific files exist and are non-empty
   */
  private checkLandingBlogFiles(): Array<{ name: string; passed: boolean; message: string }> {
    const landingBlogFiles = [
      'prisma/schema.prisma',
      'src/app/api/posts/route.ts',
      'src/app/api/posts/[id]/route.ts',
      'src/app/api/categories/route.ts',
      'src/app/api/contact/route.ts',
      'src/app/page.tsx',
      'src/app/blog/page.tsx',
      'src/app/blog/[slug]/page.tsx',
      'src/app/contacto/page.tsx',
      'src/components/SeoHead.tsx',
    ];
    return landingBlogFiles.map((file) => this.checkFileExistsAndNonEmpty(file));
  }

  /**
   * Verify that src/components/shared/ exists with required components for the template type
   */
  checkSharedComponents(): Array<{ name: string; passed: boolean; message: string }> {
    const checks: Array<{ name: string; passed: boolean; message: string }> = [];
    const sharedDir = path.join(this.buildDir, 'src/components/shared');
    const dirExists = fs.existsSync(sharedDir) && fs.statSync(sharedDir).isDirectory();

    checks.push({
      name: 'Shared components directory exists',
      passed: dirExists,
      message: dirExists
        ? '✓ src/components/shared/ found'
        : '✗ src/components/shared/ missing',
    });

    if (!dirExists) {
      return checks;
    }

    const requiredComponents = [
      'DataTable.tsx',
      'Modal.tsx',
      'FormField.tsx',
      'Toast.tsx',
      'Sidebar.tsx',
      'UtilityComponents.tsx',
      'index.ts',
    ];

    for (const component of requiredComponents) {
      const filePath = path.join(sharedDir, component);
      const exists = fs.existsSync(filePath);
      checks.push({
        name: `Shared component: ${component}`,
        passed: exists,
        message: exists
          ? `✓ src/components/shared/${component} found`
          : `✗ src/components/shared/${component} missing`,
      });
    }

    return checks;
  }

  /**
   * Verify that imports in TypeScript files reference existing files.
   * Checks relative imports (starting with './' or '../') only.
   * Skips node_modules imports and alias imports (like '@/').
   */
  checkImportValidity(): Array<{ name: string; passed: boolean; message: string }> {
    const checks: Array<{ name: string; passed: boolean; message: string }> = [];
    const tsFiles = this.findTypeScriptFiles(this.buildDir);

    for (const tsFile of tsFiles) {
      const content = fs.readFileSync(tsFile, 'utf-8');
      const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
      let match: RegExpExecArray | null;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];

        // Skip non-relative imports (node_modules, aliases like @/)
        if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
          continue;
        }

        const sourceDir = path.dirname(tsFile);
        const resolvedBase = path.resolve(sourceDir, importPath);

        // Check if the import resolves to an existing file
        const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js'];
        const fileExists = possibleExtensions.some((ext) => fs.existsSync(resolvedBase + ext));

        if (!fileExists) {
          const relativeSrc = path.relative(this.buildDir, tsFile);
          checks.push({
            name: `Import validity: ${relativeSrc}`,
            passed: false,
            message: `✗ Invalid import '${importPath}' in ${relativeSrc}`,
          });
        }
      }
    }

    // If no invalid imports found, add a passing check
    if (checks.length === 0) {
      checks.push({
        name: 'Import validity',
        passed: true,
        message: '✓ All relative imports reference existing files',
      });
    }

    return checks;
  }

  /**
   * Verify required pages for each advanced template type
   */
  checkAdvancedTemplatePages(): Array<{ name: string; passed: boolean; message: string }> {
    const checks: Array<{ name: string; passed: boolean; message: string }> = [];
    const entityNamePlural = this.entityName.toLowerCase() + 's';

    const templatePages: Record<TemplateType, Array<{ path: string; description: string }>> = {
      SAAS_BASIC: [
        { path: 'src/app/(dashboard)/dashboard/onboarding/page.tsx', description: 'Onboarding page' },
        { path: 'src/app/(dashboard)/dashboard/settings/page.tsx', description: 'Settings page' },
        { path: 'src/app/(dashboard)/dashboard/billing/page.tsx', description: 'Billing page' },
        { path: 'src/app/(dashboard)/dashboard/profile/page.tsx', description: 'Profile page' },
        { path: 'src/app/(dashboard)/dashboard/notifications/page.tsx', description: 'Notifications page' },
        { path: `src/app/(dashboard)/dashboard/${entityNamePlural}/page.tsx`, description: 'CRUD list page' },
        { path: `src/app/(dashboard)/dashboard/${entityNamePlural}/new/page.tsx`, description: 'CRUD create page' },
        { path: `src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/page.tsx`, description: 'CRUD detail page' },
        { path: `src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/edit/page.tsx`, description: 'CRUD edit page' },
      ],
      MARKETPLACE_MINI: [
        { path: 'src/app/(dashboard)/dashboard/seller/page.tsx', description: 'Seller dashboard' },
        { path: 'src/app/(dashboard)/dashboard/listings/page.tsx', description: 'Listings management' },
        { path: 'src/app/(dashboard)/dashboard/search/page.tsx', description: 'Search page' },
        { path: 'src/app/(dashboard)/dashboard/seller/profile/page.tsx', description: 'Seller profile' },
        { path: 'src/app/(dashboard)/dashboard/messages/page.tsx', description: 'Messages page' },
      ],
      ECOMMERCE_MINI: [
        { path: 'src/app/(dashboard)/dashboard/catalog/page.tsx', description: 'Catalog page' },
        { path: 'src/app/(dashboard)/dashboard/catalog/[id]/page.tsx', description: 'Product detail' },
        { path: 'src/app/(dashboard)/dashboard/cart/page.tsx', description: 'Cart page' },
        { path: 'src/app/(dashboard)/dashboard/checkout/page.tsx', description: 'Checkout page' },
        { path: 'src/app/(dashboard)/dashboard/orders/page.tsx', description: 'Orders page' },
      ],
      LANDING_BLOG: [
        { path: 'src/app/blog/page.tsx', description: 'Blog list page' },
        { path: 'src/app/blog/[slug]/page.tsx', description: 'Article page' },
        { path: 'src/app/contacto/page.tsx', description: 'Contact page' },
        { path: 'src/app/about/page.tsx', description: 'About page' },
        { path: 'src/app/newsletter/page.tsx', description: 'Newsletter page' },
      ],
    };

    const requiredPages = templatePages[this.templateType] || [];

    for (const page of requiredPages) {
      const pagePath = path.join(this.buildDir, page.path);
      const exists = fs.existsSync(pagePath);
      checks.push({
        name: `Advanced template page [${this.templateType}]: ${page.description}`,
        passed: exists,
        message: exists
          ? `✓ ${page.path} found`
          : `✗ ${page.path} missing (required by ${this.templateType}: ${page.description})`,
      });
    }

    return checks;
  }

  /**
   * Verify presence of Zod schemas in API routes that handle input (POST, PUT, PATCH)
   */
  checkZodSchemas(): Array<{ name: string; passed: boolean; message: string }> {
    const checks: Array<{ name: string; passed: boolean; message: string }> = [];
    const apiDir = path.join(this.buildDir, 'src/app/api');

    if (!fs.existsSync(apiDir)) {
      checks.push({
        name: 'Zod schema validation',
        passed: true,
        message: '✓ No API directory found (skipped)',
      });
      return checks;
    }

    const apiRouteFiles = this.findTypeScriptFiles(apiDir);

    for (const routeFile of apiRouteFiles) {
      const content = fs.readFileSync(routeFile, 'utf-8');
      const hasInputHandler =
        content.includes('export async function POST') ||
        content.includes('export async function PUT') ||
        content.includes('export async function PATCH') ||
        content.includes('export function POST') ||
        content.includes('export function PUT') ||
        content.includes('export function PATCH');

      if (!hasInputHandler) {
        continue;
      }

      const hasZodSchema =
        content.includes('z.object') ||
        content.includes('z.string') ||
        content.includes('z.number') ||
        content.includes('z.boolean') ||
        content.includes('z.array') ||
        content.includes('z.enum');

      const relativePath = path.relative(this.buildDir, routeFile);
      checks.push({
        name: `Zod schema in API route: ${relativePath}`,
        passed: hasZodSchema,
        message: hasZodSchema
          ? `✓ Zod validation found in ${relativePath}`
          : `✗ Missing Zod validation in ${relativePath} (has POST/PUT/PATCH handler)`,
      });
    }

    // If no API routes with input handlers found, add a passing check
    if (checks.length === 0) {
      checks.push({
        name: 'Zod schema validation',
        passed: true,
        message: '✓ No API routes with input handlers found (skipped)',
      });
    }

    return checks;
  }

  /**
   * Recursively find all TypeScript files in a directory
   */
  private findTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and .next directories
        if (entry.name === 'node_modules' || entry.name === '.next') {
          continue;
        }
        files.push(...this.findTypeScriptFiles(fullPath));
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
