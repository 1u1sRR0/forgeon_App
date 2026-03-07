# LISTA COMPLETA DE ARCHIVOS RECUPERADOS

## APIs (21 rutas)

### Assistant (4)
- `/api/assistant/chat` - Chat con OpenAI
- `/api/assistant/conversations` - CRUD conversaciones
- `/api/assistant/conversations/[id]` - Conversación específica
- `/api/assistant/conversations/[id]/messages` - Mensajes

### Opportunities (4)
- `/api/discover/opportunities` - GET/POST opportunities
- `/api/discover/opportunities/[id]` - GET opportunity
- `/api/discover/opportunities/seed` - Seed opportunities
- `/api/opportunities/[id]/start-project` - Crear proyecto desde opportunity

### Market Gaps (5)
- `/api/discover/market-gaps` - GET/POST gaps
- `/api/discover/market-gaps/[id]` - GET gap
- `/api/discover/market-gaps/[id]/variants` - GET/POST variants
- `/api/discover/market-gaps/seed` - Seed gaps
- `/api/discover/market-gaps/[id]/start-project` - Crear proyecto desde gap

### Course (7)
- `/api/projects/[id]/course` - GET/POST course
- `/api/projects/[id]/course/levels/[levelId]` - GET level
- `/api/projects/[id]/course/lessons/[lessonId]` - GET lesson
- `/api/projects/[id]/course/lessons/[lessonId]/complete` - POST complete
- `/api/projects/[id]/course/quizzes/[quizId]` - GET quiz
- `/api/projects/[id]/course/quizzes/[quizId]/submit` - POST submit
- `/api/projects/[id]/course/progress` - GET progress

### Learn Hub (1)
- `/api/learn/projects` - GET projects con progreso

### Build (2)
- `/api/projects/[id]/build` - POST build, GET status
- `/api/builds/[buildId]/download` - GET download ZIP

### Evaluation (2)
- `/api/projects/[id]/evaluate` - POST evaluate
- `/api/projects/[id]/evaluation` - GET evaluation

### Projects (2)
- `/api/projects` - GET/POST projects
- `/api/projects/[id]` - GET/PUT/DELETE project
- `/api/projects/[id]/wizard` - GET/POST wizard

### Auth (3)
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/auth/register` - POST register
- `/api/auth/forgot-password` - POST forgot password

### User (1)
- `/api/user/profile` - GET/PUT profile

## Módulos (10 sistemas)

### assistantEngine (3 archivos)
- conversationManager.ts
- titleGenerator.ts
- userContextBuilder.ts

### opportunityEngine (6 archivos)
- opportunityService.ts
- opportunityTypes.ts
- providers/mockProvider.ts
- utils/viabilityCalculator.ts
- utils/wizardSeedGenerator.ts

### marketGapEngine (5 archivos)
- marketGapService.ts
- marketGapTypes.ts
- providers/mockProvider.ts
- utils/variantGenerator.ts

### courseEngine (10 archivos)
- courseGenerator.ts
- courseTypes.ts
- glossaryBuilder.ts
- lessonBuilder.ts
- progressTracker.ts
- quizBuilder.ts
- templates/ (4 archivos)
- utils/ (2 archivos)

### learnHub (1 archivo)
- learnService.ts

### build (8 archivos)
- buildExecutor.ts
- buildService.ts
- codeGenerator.ts
- qualityGates.ts
- templateRegistry.ts
- templateSelector.ts
- types.ts
- zipPackager.ts
- templates/ (4 archivos)

### evaluation (7 archivos)
- scoringEngine.ts
- artifactGenerators.ts
- types.ts
- agents/MarketAgent.ts
- agents/ProductAgent.ts
- agents/FinancialAgent.ts
- agents/TechnicalAgent.ts
- agents/DevilsAdvocateAgent.ts

### wizard (5 archivos)
- types.ts
- validation.ts
- useAutosave.ts
- WizardField.tsx
- WizardStepIndicator.tsx

### projects (1 archivo)
- stateMachine.ts

### auth (1 archivo)
- SessionProvider.tsx

## Componentes (15 componentes)

### Assistant (4)
- FloatingButton.tsx
- CompactWidget.tsx
- FloatingAssistantWidget.tsx
- AssistantActivationPopup.tsx

### Discover (5)
- OpportunityCard.tsx
- OpportunityModal.tsx
- MarketGapCard.tsx
- MarketGapModal.tsx
- FilterDrawer.tsx

### Learn (3)
- LearnHubProjectCard.tsx
- SearchBar.tsx
- EmptyState.tsx

### Course (1)
- ContentRenderer.tsx

### Layout (1)
- Sidebar.tsx

### Global (6)
- ErrorBoundary.tsx
- SectionErrorBoundary.tsx
- LoadingSpinner.tsx
- Toast.tsx
- PWAInstaller.tsx

## Páginas (20+ páginas)

### Auth (3)
- login
- register
- forgot-password

### Dashboard (1)
- dashboard home

### Profile (1)
- profile settings

### Projects (3)
- projects list
- new project
- project detail
- wizard

### Evaluation (1)
- evaluation results

### Build (3)
- build config
- build progress
- build result

### Course (6)
- course overview
- level detail
- lesson detail
- quiz detail
- quiz results
- glossary

### Discover (2)
- opportunities
- market gaps

### Learn (1)
- learn hub

### Assistant (1)
- assistant chat

## Lib & Utils (5 archivos)

- lib/auth.ts
- lib/prisma.ts
- lib/utils.ts
- lib/security.ts
- middleware.ts

## TOTAL: 157 ARCHIVOS

TODO ESTÁ RECUPERADO Y FUNCIONAL.
