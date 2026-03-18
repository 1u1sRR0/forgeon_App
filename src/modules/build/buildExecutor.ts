// Build executor - orchestrates the code generation process

import * as fs from 'fs';
import * as path from 'path';
import { BuildParameters, TemplateType } from './types';
import { CodeGenerator } from './codeGenerator';
import { AppFilesGenerator } from './templates/appFiles';
import { AuthPagesGenerator } from './templates/authPages';
import { ApiRoutesGenerator } from './templates/apiRoutes';
import { DashboardPagesGenerator } from './templates/dashboardPages';
import { MarketplaceGenerator } from './templates/marketplaceFiles';
import { EcommerceGenerator } from './templates/ecommerceFiles';
import { LandingBlogGenerator } from './templates/landingBlogFiles';
import { buildService } from './buildService';
import { QualityGates } from './qualityGates';
import { ZipPackager } from './zipPackager';
import { prisma } from '@/lib/prisma';

export class BuildExecutor {
  private buildId: string;
  private projectId: string;
  private templateType: TemplateType;
  private parameters: BuildParameters;
  private buildDir: string;
  private buildLog: string[] = [];

  constructor(
    buildId: string,
    projectId: string,
    templateType: TemplateType,
    parameters: BuildParameters
  ) {
    this.buildId = buildId;
    this.projectId = projectId;
    this.templateType = templateType;
    this.parameters = parameters;
    
    // Create build directory: builds/[projectId]/[buildId]
    const buildsRoot = path.join(process.cwd(), 'builds');
    this.buildDir = path.join(buildsRoot, projectId, buildId);
  }

  /**
   * Log a message
   */
  private log(message: string): void {
    console.log(`[Build ${this.buildId}] ${message}`);
    this.buildLog.push(`[${new Date().toISOString()}] ${message}`);
  }

  /**
   * Update build status in database
   */
  private async updateStatus(
    status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
    updates: {
      errorMessage?: string;
      zipPath?: string;
      qualityChecksPassed?: boolean;
    } = {}
  ): Promise<void> {
    await buildService.updateBuildStatus(this.buildId, status, {
      buildLog: this.buildLog,
      ...updates,
    });
  }

  /**
   * Execute the build
   */
  async execute(): Promise<void> {
    try {
      this.log('Starting build process...');
      await this.updateStatus('IN_PROGRESS');

      // Create build directory
      this.log(`Creating build directory: ${this.buildDir}`);
      if (!fs.existsSync(this.buildDir)) {
        fs.mkdirSync(this.buildDir, { recursive: true });
      }

      // Initialize code generator
      const generator = new CodeGenerator(this.buildDir);

      // Generate base files
      this.log('Generating package.json...');
      generator.generatePackageJson(this.parameters);

      this.log('Generating next.config.ts...');
      generator.generateNextConfig(this.parameters);

      this.log('Generating tsconfig.json...');
      generator.generateTsConfig();

      this.log('Generating tailwind.config.ts...');
      generator.generateTailwindConfig(this.parameters);

      this.log('Generating postcss.config.mjs...');
      generator.generatePostcssConfig();

      this.log('Generating .env.example...');
      generator.generateEnvExample();

      this.log('Generating .gitignore...');
      generator.generateGitignore();

      // Generate Prisma files
      this.log('Generating Prisma schema...');
      generator.generatePrismaSchema(this.parameters);

      this.log('Generating prisma.config.ts...');
      generator.generatePrismaConfig();

      this.log('Generating seed script...');
      generator.generateSeedScript(this.parameters);

      // Generate README
      this.log('Generating README.md...');
      generator.generateReadme(this.parameters);

      // Generate app files
      this.log('Generating app layout...');
      this.writeFile('src/app/layout.tsx', AppFilesGenerator.generateRootLayout(this.parameters));

      this.log('Generating globals.css...');
      this.writeFile('src/app/globals.css', AppFilesGenerator.generateGlobalsCss());

      this.log('Generating landing page...');
      this.writeFile('src/app/page.tsx', AppFilesGenerator.generateLandingPage(this.parameters));

      this.log('Generating error pages...');
      this.writeFile('src/app/not-found.tsx', AppFilesGenerator.generateNotFound());
      this.writeFile('src/app/error.tsx', AppFilesGenerator.generateError());

      // Generate auth pages
      this.log('Generating login page...');
      this.writeFile('src/app/(auth)/login/page.tsx', AuthPagesGenerator.generateLoginPage(this.parameters));

      this.log('Generating register page...');
      this.writeFile('src/app/(auth)/register/page.tsx', AuthPagesGenerator.generateRegisterPage(this.parameters));

      // Generate lib files
      this.log('Generating Prisma client lib...');
      this.writeFile('src/lib/prisma.ts', ApiRoutesGenerator.generatePrismaLib());

      this.log('Generating auth lib...');
      this.writeFile('src/lib/auth.ts', ApiRoutesGenerator.generateAuthLib());

      // Generate middleware
      this.log('Generating middleware...');
      this.writeFile('src/middleware.ts', ApiRoutesGenerator.generateMiddleware());

      // Generate API routes
      this.log('Generating NextAuth API route...');
      this.writeFile('src/app/api/auth/[...nextauth]/route.ts', ApiRoutesGenerator.generateNextAuthRoute());

      this.log('Generating register API route...');
      this.writeFile('src/app/api/auth/register/route.ts', ApiRoutesGenerator.generateRegisterRoute());

      // Generate template-specific files
      switch (this.templateType) {
        case 'MARKETPLACE_MINI':
          this.log('Generating marketplace Prisma schema...');
          this.writeFile('prisma/schema.prisma', MarketplaceGenerator.generatePrismaSchema(this.parameters));

          this.log('Generating marketplace API routes...');
          this.writeFile('src/app/api/listings/route.ts', MarketplaceGenerator.generateListingsRoute(this.parameters));
          this.writeFile('src/app/api/listings/[id]/route.ts', MarketplaceGenerator.generateListingIdRoute(this.parameters));
          this.writeFile('src/app/api/listings/search/route.ts', MarketplaceGenerator.generateSearchRoute(this.parameters));
          this.writeFile('src/app/api/transactions/route.ts', MarketplaceGenerator.generateTransactionsRoute(this.parameters));

          this.log('Generating marketplace UI pages...');
          this.writeFile('src/app/(dashboard)/dashboard/listings/page.tsx', MarketplaceGenerator.generateListingsPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/listings/[id]/page.tsx', MarketplaceGenerator.generateListingDetailPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/listings/publish/page.tsx', MarketplaceGenerator.generatePublishListingPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/seller/page.tsx', MarketplaceGenerator.generateSellerDashboardPage(this.parameters));

          this.log('Generating marketplace dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;

        case 'ECOMMERCE_MINI':
          this.log('Generating e-commerce Prisma schema...');
          this.writeFile('prisma/schema.prisma', EcommerceGenerator.generatePrismaSchema(this.parameters));

          this.log('Generating e-commerce API routes...');
          this.writeFile('src/app/api/products/route.ts', EcommerceGenerator.generateProductsRoute(this.parameters));
          this.writeFile('src/app/api/products/[id]/route.ts', EcommerceGenerator.generateProductIdRoute(this.parameters));
          this.writeFile('src/app/api/cart/route.ts', EcommerceGenerator.generateCartRoute(this.parameters));
          this.writeFile('src/app/api/orders/route.ts', EcommerceGenerator.generateOrdersRoute(this.parameters));

          this.log('Generating e-commerce UI pages...');
          this.writeFile('src/app/(dashboard)/dashboard/catalog/page.tsx', EcommerceGenerator.generateCatalogPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/catalog/[id]/page.tsx', EcommerceGenerator.generateProductDetailPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/cart/page.tsx', EcommerceGenerator.generateCartPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/checkout/page.tsx', EcommerceGenerator.generateCheckoutPage(this.parameters));

          this.log('Generating e-commerce dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;

        case 'LANDING_BLOG':
          this.log('Generating landing+blog Prisma schema...');
          this.writeFile('prisma/schema.prisma', LandingBlogGenerator.generatePrismaSchema(this.parameters));

          this.log('Generating landing+blog API routes...');
          this.writeFile('src/app/api/posts/route.ts', LandingBlogGenerator.generatePostsRoute(this.parameters));
          this.writeFile('src/app/api/posts/[id]/route.ts', LandingBlogGenerator.generatePostIdRoute(this.parameters));
          this.writeFile('src/app/api/categories/route.ts', LandingBlogGenerator.generateCategoriesRoute(this.parameters));
          this.writeFile('src/app/api/contact/route.ts', LandingBlogGenerator.generateContactRoute(this.parameters));

          this.log('Generating landing+blog UI pages...');
          this.writeFile('src/app/page.tsx', LandingBlogGenerator.generateLandingPage(this.parameters));
          this.writeFile('src/app/blog/page.tsx', LandingBlogGenerator.generateBlogListPage(this.parameters));
          this.writeFile('src/app/blog/[slug]/page.tsx', LandingBlogGenerator.generateBlogPostPage(this.parameters));
          this.writeFile('src/app/contacto/page.tsx', LandingBlogGenerator.generateContactPage(this.parameters));

          this.log('Generating SEO components...');
          this.writeFile('src/components/SeoHead.tsx', LandingBlogGenerator.generateSeoComponents(this.parameters));

          this.log('Generating landing+blog dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;

        default: {
          // SAAS_BASIC - existing behavior
          const entityNamePlural = this.parameters.entityName.toLowerCase() + 's';
          this.log(`Generating ${entityNamePlural} API routes...`);
          this.writeFile(`src/app/api/${entityNamePlural}/route.ts`, ApiRoutesGenerator.generateEntityRoute(this.parameters));
          this.writeFile(`src/app/api/${entityNamePlural}/[id]/route.ts`, ApiRoutesGenerator.generateEntityIdRoute(this.parameters));

          this.log('Generating dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));

          this.log(`Generating new ${this.parameters.entityName.toLowerCase()} page...`);
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/new/page.tsx`, DashboardPagesGenerator.generateNewEntityPage(this.parameters));

          this.log(`Generating view ${this.parameters.entityName.toLowerCase()} page...`);
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/page.tsx`, DashboardPagesGenerator.generateViewEntityPage(this.parameters));

          this.log(`Generating edit ${this.parameters.entityName.toLowerCase()} page...`);
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/edit/page.tsx`, DashboardPagesGenerator.generateEditEntityPage(this.parameters));
          break;
        }
      }

      // Generate SessionProvider wrapper
      this.log('Generating SessionProvider...');
      this.writeFile('src/components/SessionProvider.tsx', this.generateSessionProvider());

      // Update root layout to include SessionProvider
      this.log('Updating root layout with SessionProvider...');
      this.writeFile('src/app/layout.tsx', this.generateRootLayoutWithSession());

      this.log('Code generation completed successfully!');
      this.log(`Build output: ${this.buildDir}`);

      // Run quality gates
      this.log('Running quality gates...');
      await this.updateStatus('IN_PROGRESS');
      
      const qualityGates = new QualityGates(this.buildDir, this.parameters.entityName, this.templateType);
      const qualityResult = await qualityGates.runChecks();

      // Log quality check results
      for (const check of qualityResult.checks) {
        this.log(check.message);
      }

      if (!qualityResult.passed) {
        this.log('Quality gates FAILED!');
        const failedChecks = qualityResult.checks.filter((c) => !c.passed);
        const errorMessage = `Quality gates failed:\n${failedChecks.map((c) => c.message).join('\n')}`;
        
        await this.updateStatus('FAILED', {
          errorMessage,
          qualityChecksPassed: false,
        });
        
        throw new Error(errorMessage);
      }

      this.log('Quality gates PASSED!');

      // Create ZIP package
      this.log('Creating ZIP package...');
      await this.updateStatus('IN_PROGRESS');
      
      const zipPath = `${this.buildDir}.zip`;
      await ZipPackager.createZip(this.buildDir, zipPath);
      
      const zipSize = ZipPackager.getZipSize(zipPath);
      this.log(`ZIP created: ${ZipPackager.formatBytes(zipSize)}`);

      // Update status to completed
      this.log('Build completed successfully!');
      await this.updateStatus('COMPLETED', {
        zipPath,
        qualityChecksPassed: true,
      });

      // Transition project state to MVP_GENERATED
      this.log('Transitioning project state to MVP_GENERATED...');
      await prisma.project.update({
        where: { id: this.projectId },
        data: { state: 'MVP_GENERATED' },
      });
      
      this.log('Project state updated to MVP_GENERATED');

      // Trigger course generation (non-blocking)
      this.log('Triggering course generation...');
      this.generateCourseAsync(this.projectId).catch((err) => {
        console.error('Course generation failed (non-blocking):', err);
      });
    } catch (error: any) {
      this.log(`Build failed: ${error.message}`);
      console.error('Build error:', error);
      
      await this.updateStatus('FAILED', {
        errorMessage: error.message,
      });
      
      throw error;
    }
  }

  /**
   * Write file to build directory
   */
  private writeFile(relativePath: string, content: string): void {
    const fullPath = path.join(this.buildDir, relativePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  /**
   * Generate SessionProvider component
   */
  private generateSessionProvider(): string {
    return `'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
`;
  }

  /**
   * Generate root layout with SessionProvider
   */
  private generateRootLayoutWithSession(): string {
    return `import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "${this.parameters.appName}",
  description: "Generated by MVP Incubator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
`;
  }

  /**
   * Generate course asynchronously (non-blocking)
   */
  private async generateCourseAsync(projectId: string): Promise<void> {
    try {
      const { generateCourse } = await import('@/modules/courseEngine/courseGenerator');
      
      this.log('Generating course...');
      await generateCourse(projectId);
      
      this.log('Course generation completed successfully');
    } catch (error: any) {
      // Log error but don't fail the build
      this.log(`Course generation failed: ${error.message}`);
      console.error('Course generation error:', error);
    }
  }
}
