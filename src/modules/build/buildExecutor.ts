// Build executor - orchestrates the code generation process

import * as fs from 'fs';
import * as path from 'path';
import { BuildParameters, TemplateType } from './types';
import { CodeGenerator } from './codeGenerator';
import { AppFilesGenerator } from './templates/appFiles';
import { AuthPagesGenerator } from './templates/authPages';
import { ApiRoutesGenerator } from './templates/apiRoutes';
import { DashboardPagesGenerator } from './templates/dashboardPages';
import { SaasAdvancedTemplate } from './templates/saasAdvanced';
import { MarketplaceAdvancedTemplate } from './templates/marketplaceAdvanced';
import { EcommerceAdvancedTemplate } from './templates/ecommerceAdvanced';
import { LandingBlogAdvancedTemplate } from './templates/landingBlogAdvanced';
import { SharedComponentsGenerator } from './generators/sharedComponentsGenerator';
import { buildService } from './buildService';
import { QualityGates } from './qualityGates';
import { ZipPackager } from './zipPackager';
import { prisma } from '@/lib/prisma';
import { parseUxBlueprint } from '@/modules/premiumEngine/designTokens/designTokenParser';
import { PremiumBuildIntegration } from '@/modules/premiumEngine/buildIntegration';

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

      // ═══ SHARED COMPONENTS GENERATION ═══
      // Generate shared components BEFORE template-specific files so pages can import them
      this.log('Generating shared components...');
      this.writeFile('src/components/shared/DataTable.tsx', SharedComponentsGenerator.generateDataTable());
      this.writeFile('src/components/shared/Modal.tsx', SharedComponentsGenerator.generateModal());
      this.writeFile('src/components/shared/FormField.tsx', SharedComponentsGenerator.generateFormField());
      this.writeFile('src/components/shared/Toast.tsx', SharedComponentsGenerator.generateToast());
      this.writeFile('src/components/shared/Sidebar.tsx', SharedComponentsGenerator.generateSidebar());
      this.writeFile('src/components/shared/UtilityComponents.tsx', SharedComponentsGenerator.generateUtilityComponents());
      this.writeFile('src/components/shared/index.ts', SharedComponentsGenerator.generateIndex([
        'DataTable',
        'Modal',
        'FormField',
        'Toast',
        'Sidebar',
        'UtilityComponents',
      ]));
      this.log('Shared components generated successfully');

      // Generate template-specific files
      switch (this.templateType) {
        case 'MARKETPLACE_MINI': {
          this.log('Generating marketplace advanced Prisma schema...');
          this.writeFile('prisma/schema.prisma', MarketplaceAdvancedTemplate.generateAdvancedPrismaSchema(this.parameters));

          this.log('Generating marketplace advanced API routes...');
          const marketplaceApiRoutes = MarketplaceAdvancedTemplate.generateApiRoutes(this.parameters);
          for (const route of marketplaceApiRoutes) {
            this.log(`  API route: ${route.path}`);
            this.writeFile(route.path, route.content);
          }

          this.log('Generating marketplace advanced UI pages...');
          this.writeFile('src/app/(dashboard)/dashboard/seller/page.tsx', MarketplaceAdvancedTemplate.generateSellerDashboard(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/listings/page.tsx', MarketplaceAdvancedTemplate.generateListingManagement(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/listings/[id]/page.tsx', MarketplaceAdvancedTemplate.generateListingDetail(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/search/page.tsx', MarketplaceAdvancedTemplate.generateSearchPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/sellers/[id]/page.tsx', MarketplaceAdvancedTemplate.generateSellerProfile(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/messages/page.tsx', MarketplaceAdvancedTemplate.generateMessaging(this.parameters));

          this.log('Generating marketplace specific components...');
          this.writeFile('src/components/marketplace/ListingCard.tsx', MarketplaceAdvancedTemplate.generateListingCard());
          this.writeFile('src/components/marketplace/SearchFilters.tsx', MarketplaceAdvancedTemplate.generateSearchFilters());
          this.writeFile('src/components/marketplace/ReviewStars.tsx', MarketplaceAdvancedTemplate.generateReviewStars());
          this.writeFile('src/components/marketplace/SellerBadge.tsx', MarketplaceAdvancedTemplate.generateSellerBadge());

          this.log('Generating marketplace dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;
        }

        case 'ECOMMERCE_MINI': {
          this.log('Generating e-commerce advanced Prisma schema...');
          this.writeFile('prisma/schema.prisma', EcommerceAdvancedTemplate.generateAdvancedPrismaSchema(this.parameters));

          this.log('Generating e-commerce advanced API routes...');
          const ecommerceApiRoutes = EcommerceAdvancedTemplate.generateApiRoutes(this.parameters);
          for (const route of ecommerceApiRoutes) {
            this.log(`  API route: ${route.path}`);
            this.writeFile(route.path, route.content);
          }

          this.log('Generating e-commerce advanced UI pages...');
          this.writeFile('src/app/(dashboard)/dashboard/catalog/page.tsx', EcommerceAdvancedTemplate.generateCatalogPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/catalog/[id]/page.tsx', EcommerceAdvancedTemplate.generateProductDetailPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/cart/page.tsx', EcommerceAdvancedTemplate.generateCartPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/checkout/page.tsx', EcommerceAdvancedTemplate.generateCheckoutPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/orders/page.tsx', EcommerceAdvancedTemplate.generateOrderHistoryPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/orders/[id]/page.tsx', EcommerceAdvancedTemplate.generateOrderDetailPage(this.parameters));

          this.log('Generating e-commerce specific components...');
          this.writeFile('src/components/ecommerce/ProductCard.tsx', EcommerceAdvancedTemplate.generateProductCard());
          this.writeFile('src/components/ecommerce/CartSummary.tsx', EcommerceAdvancedTemplate.generateCartSummary());
          this.writeFile('src/components/ecommerce/QuantitySelector.tsx', EcommerceAdvancedTemplate.generateQuantitySelector());
          this.writeFile('src/components/ecommerce/CheckoutStepper.tsx', EcommerceAdvancedTemplate.generateCheckoutStepper());
          this.writeFile('src/components/ecommerce/OrderStatusBadge.tsx', EcommerceAdvancedTemplate.generateOrderStatusBadge());

          this.log('Generating e-commerce dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;
        }

        case 'LANDING_BLOG': {
          this.log('Generating landing+blog advanced Prisma schema...');
          this.writeFile('prisma/schema.prisma', LandingBlogAdvancedTemplate.generateAdvancedPrismaSchema(this.parameters));

          this.log('Generating landing+blog advanced API routes...');
          const blogApiRoutes = LandingBlogAdvancedTemplate.generateApiRoutes(this.parameters);
          for (const route of blogApiRoutes) {
            this.log(`  API route: ${route.path}`);
            this.writeFile(route.path, route.content);
          }

          this.log('Generating landing+blog advanced UI pages...');
          this.writeFile('src/app/page.tsx', LandingBlogAdvancedTemplate.generateBlogListPage(this.parameters));
          this.writeFile('src/app/blog/page.tsx', LandingBlogAdvancedTemplate.generateBlogListPage(this.parameters));
          this.writeFile('src/app/blog/[slug]/page.tsx', LandingBlogAdvancedTemplate.generateArticlePage(this.parameters));
          this.writeFile('src/app/contacto/page.tsx', LandingBlogAdvancedTemplate.generateContactPage(this.parameters));
          this.writeFile('src/app/acerca/page.tsx', LandingBlogAdvancedTemplate.generateAboutPage(this.parameters));
          this.writeFile('src/app/newsletter/page.tsx', LandingBlogAdvancedTemplate.generateNewsletterPage(this.parameters));

          this.log('Generating landing+blog specific components...');
          this.writeFile('src/components/blog/ArticleCard.tsx', LandingBlogAdvancedTemplate.generateArticleCard());
          this.writeFile('src/components/blog/CategoryBadge.tsx', LandingBlogAdvancedTemplate.generateCategoryBadge());
          this.writeFile('src/components/blog/TableOfContents.tsx', LandingBlogAdvancedTemplate.generateTableOfContents());
          this.writeFile('src/components/blog/NewsletterForm.tsx', LandingBlogAdvancedTemplate.generateNewsletterForm());
          this.writeFile('src/components/blog/ShareButtons.tsx', LandingBlogAdvancedTemplate.generateShareButtons());

          this.log('Generating landing+blog dashboard page...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          break;
        }

        default: {
          // SAAS_BASIC — Advanced template with full CRUD, onboarding, settings, billing, etc.
          const entityNameLower = this.parameters.entityName.toLowerCase();
          const entityNamePlural = entityNameLower + 's';

          this.log('Generating SaaS advanced Prisma schema...');
          this.writeFile('prisma/schema.prisma', SaasAdvancedTemplate.generateAdvancedPrismaSchema(this.parameters));

          this.log('Generating SaaS advanced API routes...');
          const saasApiRoutes = SaasAdvancedTemplate.generateApiRoutes(this.parameters);
          for (const route of saasApiRoutes) {
            this.log(`  API route: ${route.path}`);
            this.writeFile(route.path, route.content);
          }

          this.log('Generating SaaS advanced dashboard layout...');
          this.writeFile('src/app/(dashboard)/dashboard/layout.tsx', SaasAdvancedTemplate.generateDashboardLayout(this.parameters));

          this.log('Generating SaaS advanced UI pages...');
          this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/onboarding/page.tsx', SaasAdvancedTemplate.generateOnboardingPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/settings/page.tsx', SaasAdvancedTemplate.generateSettingsPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/billing/page.tsx', SaasAdvancedTemplate.generateBillingPage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/profile/page.tsx', SaasAdvancedTemplate.generateProfilePage(this.parameters));
          this.writeFile('src/app/(dashboard)/dashboard/notifications/page.tsx', SaasAdvancedTemplate.generateNotificationsPage(this.parameters));

          this.log('Generating SaaS CRUD pages with React components...');
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/page.tsx`, SaasAdvancedTemplate.generateCrudListPage(this.parameters));
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/new/page.tsx`, SaasAdvancedTemplate.generateCrudCreatePage(this.parameters));
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/page.tsx`, SaasAdvancedTemplate.generateCrudDetailPage(this.parameters));
          this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/edit/page.tsx`, SaasAdvancedTemplate.generateCrudEditPage(this.parameters));
          break;
        }
      }

      // Generate SessionProvider wrapper
      this.log('Generating SessionProvider...');
      this.writeFile('src/components/SessionProvider.tsx', this.generateSessionProvider());

      // Update root layout to include SessionProvider
      this.log('Updating root layout with SessionProvider...');
      this.writeFile('src/app/layout.tsx', this.generateRootLayoutWithSession());

      // ═══ PREMIUM ENGINE INTEGRATION ═══
      this.log('Applying premium design system...');
      await this.applyPremiumOverrides();

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
   * Apply premium design overrides using the Premium Engine.
   * Fetches UX/UI blueprint from the generation session and generates premium files.
   */
  private async applyPremiumOverrides(): Promise<void> {
    try {
      // Try to fetch UX/UI blueprint from the generation session
      const session = await prisma.generationSession.findFirst({
        where: { projectId: this.projectId },
        orderBy: { createdAt: 'desc' },
        include: {
          AgentArtifact: {
            where: { agentType: 'UX_UI_AGENT' },
          },
        },
      });

      let blueprint: Record<string, unknown> = {};
      if (session?.AgentArtifact?.[0]?.content) {
        const raw = session.AgentArtifact[0].content;
        blueprint = typeof raw === 'string' ? JSON.parse(raw) : (raw as Record<string, unknown>);
        this.log('Found UX/UI blueprint, parsing design tokens...');
      } else {
        this.log('No UX/UI blueprint found, using default design tokens...');
      }

      const tokens = parseUxBlueprint(blueprint);
      this.log(`Design tokens: ${tokens.colorMode} mode, hero=${tokens.heroVariant}, gradient=${tokens.accentGradient.from}→${tokens.accentGradient.to}`);

      const premiumFiles = PremiumBuildIntegration.generatePremiumFiles(
        this.templateType,
        {
          appName: this.parameters.appName,
          entityName: this.parameters.entityName,
        },
        tokens
      );

      for (const file of premiumFiles) {
        this.log(`Premium override: ${file.path}`);
        this.writeFile(file.path, file.content);
      }

      this.log(`Applied ${premiumFiles.length} premium file overrides`);
    } catch (error: any) {
      // Non-fatal: if premium fails, basic files are already in place
      this.log(`Premium override warning (non-fatal): ${error.message}`);
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
