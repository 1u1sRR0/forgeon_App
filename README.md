# MVP Incubator SaaS

A professional, scalable SaaS Web App + installable PWA that functions as a conservative digital incubator and quality gate system. The platform enables users to structure digital business ideas, validate them using realistic criteria, generate complete strategic artifacts, and automatically produce functional MVPs based on parameterized templates.

## 🎯 Core Features

- **Structured Wizard**: 10-step progressive wizard to capture business idea details
- **Conservative Evaluation**: Multi-agent simulation with deterministic viability scoring
- **Quality Gates**: Hard blocks prevent MVP generation unless minimum standards are met
- **Artifact Generation**: Automatic generation of business, product, and technical documents
- **Risk Management**: Quantified risk matrix with impact and probability scoring
- **Template-Based MVP Generation**: 4 production-ready templates (SaaS, Marketplace, E-commerce, Landing+Blog)
- **Deterministic Versioning**: Complete project history with version comparison
- **PWA Support**: Installable progressive web app with offline capabilities

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 19**

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**

### Authentication
- **NextAuth.js**
- **JWT Sessions**
- **bcrypt** for password hashing

### PWA
- **Service Worker**
- **Web App Manifest**
- **Offline Asset Caching**

## 📁 Project Structure

```
mvp-incubator-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes group
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API route handlers
│   │   ├── layout.tsx         # Root layout
│   │   ├── error.tsx          # Error boundary
│   │   ├── global-error.tsx   # Global error boundary
│   │   └── not-found.tsx      # 404 page
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── projects/          # Project management module
│   │   ├── wizard/            # Wizard input module
│   │   ├── evaluation/        # Evaluation engine module
│   │   ├── artifacts/         # Artifact generation module
│   │   ├── risks/             # Risk management module
│   │   ├── build/             # Build engine module
│   │   ├── versioning/        # Versioning module
│   │   ├── export/            # Export/download module
│   │   └── shared/            # Shared utilities
│   ├── lib/                   # Core libraries
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config (Phase 1)
│   │   └── utils.ts           # Shared utilities
│   └── types/                 # TypeScript types
│       └── index.ts           # Core type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment variables template
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** 14.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-incubator-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mvp_incubator?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   BUILD_STORAGE_PATH="./storage/builds"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed database with demo data
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma client

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **User** - User accounts and authentication
- **Project** - Business idea projects with state machine
- **WizardAnswer** - Structured wizard inputs
- **ViabilityScore** - Evaluation scores and breakdowns
- **EvaluationFinding** - Warnings and critical issues
- **RiskMatrix** - Quantified risks with mitigation
- **GeneratedArtifact** - Business and technical documents
- **TemplateMapping** - Recommended MVP templates
- **BuildArtifact** - Generated MVP builds
- **ProjectVersion** - Version history snapshots

## 🔐 Authentication

The application uses NextAuth.js with JWT sessions:

- Email/password authentication
- Secure password hashing with bcrypt
- Protected routes with middleware
- Session persistence

## 🎨 UI/UX Design

- Clean, professional interface with TailwindCSS
- Responsive design (mobile, tablet, desktop)
- Accessible UI with ARIA attributes
- Loading states and error handling
- Contextual help and tooltips

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration
- CSRF protection on forms
- SQL injection prevention via Prisma
- XSS prevention via React
- Rate limiting on API endpoints
- Input validation and sanitization

## 📊 State Machine

Projects follow a strict state machine:

1. **IDEA** - Initial state, wizard incomplete
2. **STRUCTURED** - Wizard complete, ready for evaluation
3. **VALIDATED** - Evaluation complete, scored
4. **BUILD_READY** - Score ≥ 60, no critical issues, ready for MVP generation
5. **MVP_GENERATED** - MVP successfully built and downloadable
6. **BLOCKED** - Score < 60 or critical issues, MVP generation blocked

## 🏗️ Development Phases

The project is built in 7 phases:

- ✅ **Phase 0**: Base Setup (COMPLETED)
- ⏳ **Phase 1**: Auth
- ⏳ **Phase 2**: Projects + State Machine + Versioning
- ⏳ **Phase 3**: Wizard + Validations + Autosave
- ⏳ **Phase 4**: Multi-Agent + Artifacts + Viability Score
- ⏳ **Phase 5**: Build Engine + Templates + ZIP
- ⏳ **Phase 6**: PWA
- ⏳ **Phase 7**: Hardening

## 🤝 Contributing

This is a structured development project following a strict specification. Please refer to the design document in `.kiro/specs/mvp-incubator-saas/` for detailed requirements and architecture.

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built with Next.js, Prisma, and modern web technologies.
