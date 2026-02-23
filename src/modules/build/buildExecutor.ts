// Build executor - orchestrates the code generation process

import * as fs from 'fs';
import * as path from 'path';
import { BuildParameters, TemplateType } from './types';
import { CodeGenerator } from './codeGenerator';
import { AppFilesGenerator } from './templates/appFiles';
import { AuthPagesGenerator } from './templates/authPages';
import { ApiRoutesGenerator } from './templates/apiRoutes';
import { DashboardPagesGenerator } from './templates/dashboardPages';
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

      const entityNamePlural = this.parameters.entityName.toLowerCase() + 's';
      this.log(`Generating ${entityNamePlural} API routes...`);
      this.writeFile(`src/app/api/${entityNamePlural}/route.ts`, ApiRoutesGenerator.generateEntityRoute(this.parameters));
      this.writeFile(`src/app/api/${entityNamePlural}/[id]/route.ts`, ApiRoutesGenerator.generateEntityIdRoute(this.parameters));

      // Generate dashboard pages
      this.log('Generating dashboard page...');
      this.writeFile('src/app/(dashboard)/dashboard/page.tsx', DashboardPagesGenerator.generateDashboardPage(this.parameters));

      this.log(`Generating new ${this.parameters.entityName.toLowerCase()} page...`);
      this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/new/page.tsx`, DashboardPagesGenerator.generateNewEntityPage(this.parameters));

      this.log(`Generating view ${this.parameters.entityName.toLowerCase()} page...`);
      this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/page.tsx`, DashboardPagesGenerator.generateViewEntityPage(this.parameters));

      this.log(`Generating edit ${this.parameters.entityName.toLowerCase()} page...`);
      this.writeFile(`src/app/(dashboard)/dashboard/${entityNamePlural}/[id]/edit/page.tsx`, DashboardPagesGenerator.generateEditEntityPage(this.parameters));

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
      
      const qualityGates = new QualityGates(this.buildDir, this.parameters.entityName);
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
}
