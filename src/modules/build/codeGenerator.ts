// Code generation engine for MVP templates

import * as fs from 'fs';
import * as path from 'path';
import { BuildParameters, TemplateType } from './types';

export interface GeneratedFile {
  path: string;
  content: string;
}

export class CodeGenerator {
  private buildDir: string;

  constructor(buildDir: string) {
    this.buildDir = buildDir;
  }

  /**
   * Replace template variables in content
   */
  private replaceVariables(content: string, params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's'; // Simple pluralization
    const entityNamePluralUpper = entityNameUpper + 's';
    
    return content
      .replace(/\{\{APP_NAME\}\}/g, params.appName)
      .replace(/\{\{ENTITY_NAME\}\}/g, entityNameUpper)
      .replace(/\{\{ENTITY_NAME_LOWER\}\}/g, entityNameLower)
      .replace(/\{\{ENTITY_NAME_PLURAL\}\}/g, entityNamePlural)
      .replace(/\{\{ENTITY_NAME_PLURAL_UPPER\}\}/g, entityNamePluralUpper)
      .replace(/\{\{PRIMARY_COLOR\}\}/g, params.brandingColors?.primary || '#3B82F6')
      .replace(/\{\{SECONDARY_COLOR\}\}/g, params.brandingColors?.secondary || '#10B981');
  }

  /**
   * Write file to build directory
   */
  private writeFile(relativePath: string, content: string): void {
    const fullPath = path.join(this.buildDir, relativePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  /**
   * Generate package.json
   */
  generatePackageJson(params: BuildParameters): void {
    const content = `{
  "name": "${params.appName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^7.4.1",
    "@prisma/adapter-pg": "^7.4.1",
    "pg": "^8.13.1",
    "next-auth": "^4.24.11",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/bcrypt": "^5.0.2",
    "@types/pg": "^8.11.10",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "15.1.6",
    "prisma": "^7.4.1"
  }
}
`;
    this.writeFile('package.json', content);
  }

  /**
   * Generate next.config.ts
   */
  generateNextConfig(params: BuildParameters): void {
    const content = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
`;
    this.writeFile('next.config.ts', content);
  }

  /**
   * Generate tsconfig.json
   */
  generateTsConfig(): void {
    const content = `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
    this.writeFile('tsconfig.json', content);
  }

  /**
   * Generate tailwind.config.ts
   */
  generateTailwindConfig(params: BuildParameters): void {
    const content = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${params.brandingColors?.primary || '#3B82F6'}",
        secondary: "${params.brandingColors?.secondary || '#10B981'}",
      },
    },
  },
  plugins: [],
};
export default config;
`;
    this.writeFile('tailwind.config.ts', content);
  }

  /**
   * Generate postcss.config.mjs
   */
  generatePostcssConfig(): void {
    const content = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`;
    this.writeFile('postcss.config.mjs', content);
  }

  /**
   * Generate .env.example
   */
  generateEnvExample(): void {
    const content = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
`;
    this.writeFile('.env.example', content);
  }

  /**
   * Generate .gitignore
   */
  generateGitignore(): void {
    const content = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
    this.writeFile('.gitignore', content);
  }

  /**
   * Generate Prisma schema
   */
  generatePrismaSchema(params: BuildParameters): void {
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    
    const content = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Auth models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  ${params.entityName.toLowerCase()}s ${entityNameUpper}[]

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Main entity model
model ${entityNameUpper} {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}
`;
    this.writeFile('prisma/schema.prisma', content);
  }

  /**
   * Generate prisma.config.ts
   */
  generatePrismaConfig(): void {
    const content = `import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
`;
    this.writeFile('prisma.config.ts', content);
  }

  /**
   * Generate seed script
   */
  generateSeedScript(params: BuildParameters): void {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    
    const content = `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user.email);

  // Create demo ${entityNameLower}s
  const ${entityNameLower}1 = await prisma.${entityNameLower}.create({
    data: {
      title: 'First ${entityNameUpper}',
      description: 'This is the first demo ${entityNameLower}',
      userId: user.id,
    },
  });

  const ${entityNameLower}2 = await prisma.${entityNameLower}.create({
    data: {
      title: 'Second ${entityNameUpper}',
      description: 'This is the second demo ${entityNameLower}',
      userId: user.id,
    },
  });

  console.log('Created ${entityNameLower}s:', ${entityNameLower}1.title, ${entityNameLower}2.title);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
    this.writeFile('prisma/seed.ts', content);
  }

  /**
   * Generate README
   */
  generateReadme(params: BuildParameters): void {
    const content = `# ${params.appName}

This is a Next.js application generated by MVP Incubator.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and add your database connection string:

\`\`\`
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

3. Generate Prisma client:

\`\`\`bash
npx prisma generate
\`\`\`

4. Run database migrations:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

5. (Optional) Seed the database:

\`\`\`bash
npx prisma db seed
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Demo Credentials

If you ran the seed script, you can log in with:

- Email: demo@example.com
- Password: demo123

## Features

- 🔐 Authentication with NextAuth
- 📊 Dashboard
- ✨ ${params.entityName} CRUD operations
- 🎨 TailwindCSS styling
- 🗄️ Prisma + PostgreSQL

## Project Structure

\`\`\`
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   └── api/            # API routes
│   └── lib/                # Utilities
├── package.json
└── README.md
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)

## Deployment

Deploy on [Vercel](https://vercel.com) or any Node.js hosting platform.

Make sure to set environment variables in your deployment platform.
`;
    this.writeFile('README.md', content);
  }
}
