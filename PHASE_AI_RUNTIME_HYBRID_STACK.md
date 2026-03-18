# Phase: Hybrid AI Runtime Stack

## Overview

The Hybrid AI Runtime is a unified AI gateway module (`src/modules/aiRuntime/`) that replaces fragmented provider implementations. It provides a single entry point for all AI calls in Forgeon, abstracting provider selection, model routing, telemetry, context aggregation, and fallback logic.

## Architecture

```
src/modules/aiRuntime/
├── index.ts                    # Public API: execute(), executeStructured(), getRuntimeDiagnostics()
├── aiTypes.ts                  # All TypeScript types, interfaces, enums
├── providerRegistry.ts         # Provider discovery, registration, health management
├── modelRouter.ts              # Task-based routing with 5 policy modes
├── runtimeConfig.ts            # Environment variable parsing with defaults
├── aiTelemetry.ts              # Async telemetry logger (Prisma AIRequestLog)
├── projectContextBuilder.ts    # Project-level context aggregation
├── artifactContextBuilder.ts   # Artifact-level context aggregation
├── healthChecks.ts             # Provider-specific health check implementations
├── buildRepairTypes.ts         # Build/Repair loop interfaces (groundwork)
└── providers/
    ├── geminiProvider.ts       # Gemini adapter (@google/generative-ai)
    ├── claudeProvider.ts       # Claude adapter (openai SDK → Anthropic API)
    ├── ollamaProvider.ts       # Ollama adapter (ollama SDK)
    └── lmStudioProvider.ts     # LM Studio adapter (openai SDK → local endpoint)
```

## Providers

| Provider | SDK | Local | Default Model |
|----------|-----|-------|---------------|
| Gemini | @google/generative-ai | No | gemini-2.5-flash |
| Claude | openai (→ Anthropic API) | No | claude-sonnet-4-20250514 |
| Ollama | ollama | Yes | llama3.1 |
| LM Studio | openai (→ local endpoint) | Yes | Configured via env |

## Request Flow

```
Consuming Module → execute(task, prompt) → ModelRouter.route(task)
  → ProviderRegistry.getHealthyProviders() → Provider.chatCompletion()
  → aiTelemetry.logAIRequest() (async, fire-and-forget)
  → NormalizedResponse returned to caller
```

On primary failure, the runtime automatically tries the fallback provider if available.

## Routing Modes

| Mode | Behavior |
|------|----------|
| `local-first` | Prefer local providers (LM Studio, Ollama), cloud as fallback |
| `cloud-first` | Prefer cloud providers (Gemini, Claude), local as fallback |
| `balanced` | High-quality tasks → cloud, low-quality → local, medium → round-robin |
| `quality-first` | Always pick highest capability: Claude > Gemini > LM Studio > Ollama |
| `cheap` | Always pick lowest cost: LM Studio > Ollama > Gemini > Claude |

## AIModelTask Types (16)

| Task | Cloud-Only | Quality Tier | Temperature | Max Tokens |
|------|:----------:|:------------:|:-----------:|:----------:|
| PROMPT_ARCHITECT | ✓ | high | 0.7 | 4096 |
| PROMPT_OPTIMIZATION | | medium | 0.6 | 2048 |
| OPPORTUNITY_GENERATION | | medium | 0.8 | 4096 |
| MARKET_GAP_GENERATION | | medium | 0.8 | 4096 |
| MARKET_INTELLIGENCE_SUMMARY | | medium | 0.5 | 2048 |
| LEARN_COURSE_GENERATION | | medium | 0.7 | 8192 |
| GLOSSARY_GENERATION | | low | 0.3 | 2048 |
| QUIZ_GENERATION | | low | 0.5 | 2048 |
| STRATEGY_DRAFT | | medium | 0.7 | 4096 |
| GROWTH_DRAFT | | medium | 0.7 | 4096 |
| ASSISTANT_CHAT | | medium | 0.7 | 2048 |
| CODE_ARCHITECTURE | ✓ | high | 0.4 | 8192 |
| BUILD_REPAIR | ✓ | high | 0.3 | 8192 |
| UX_WRITING | | low | 0.8 | 1024 |
| CLASSIFICATION | | low | 0.2 | 512 |
| SUMMARIZATION | | low | 0.3 | 2048 |

## Health Checks

| Provider | Method |
|----------|--------|
| Gemini | `generateContent('ping')` with 1 max token |
| Claude | `chat.completions.create` with 1 max token |
| Ollama | `GET /api/tags` — verify host + model |
| LM Studio | `GET /models` — verify endpoint + model |

## Telemetry

Every AI call is logged to `AIRequestLog` (PostgreSQL via Prisma):
- userId, projectId, taskType, provider, model
- inputTokens, outputTokens, estimatedCostUsd
- latencyMs, success, errorMessage, routingReason

Telemetry is fire-and-forget — failures never block AI calls.

### Cost Estimation

| Model | Input (per 1K) | Output (per 1K) |
|-------|:--------------:|:---------------:|
| gemini-2.5-flash | $0.00015 | $0.0006 |
| gemini-2.0-flash | $0.0001 | $0.0004 |
| claude-sonnet-4-20250514 | $0.003 | $0.015 |
| Local models | $0 | $0 |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | — | Google Gemini API key |
| `ANTHROPIC_API_KEY` | — | Anthropic Claude API key |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `LM_STUDIO_BASE_URL` | `http://127.0.0.1:1234/v1` | LM Studio endpoint |
| `LM_STUDIO_MODEL` | — | LM Studio model name |
| `DEFAULT_LOCAL_MODEL` | `llama3.1` | Default local model |
| `DEFAULT_CLOUD_MODEL` | `gemini-2.5-flash` | Default cloud model |
| `ENABLE_LOCAL_MODELS` | `true` | Enable local providers |
| `ENABLE_CLOUD_MODELS` | `true` | Enable cloud providers |
| `AI_ROUTING_MODE` | `local-first` | Routing policy |

## Usage

```typescript
import { execute, executeStructured, AIModelTask } from '@/modules/aiRuntime';

// Text generation
const response = await execute(
  AIModelTask.ASSISTANT_CHAT,
  'You are a helpful assistant.',
  'What is Forgeon?',
  { userId: 'user-123', projectId: 'proj-456' }
);
console.log(response.content);

// Structured generation
const result = await executeStructured<MyType>(
  AIModelTask.PROMPT_ARCHITECT,
  'Generate a business model.',
  'SaaS for developers',
  myJsonSchema
);
console.log(result.parsed);

// Diagnostics
const diagnostics = await getRuntimeDiagnostics();
// GET /api/internal/ai-diagnostics
```

## Integration

Existing modules (`multiAgentProvider.ts`, `assistantProvider.ts`) now delegate to the AI Runtime via thin wrappers with legacy fallback chains. No breaking changes — the transition is additive.

## Context Builders

- `buildProjectContext(projectId)` — Aggregates wizard answers, viability scores, findings, build status, course progress, opportunities, market gaps, market intelligence, and conversation summary.
- `buildArtifactContext(projectId, artifactType)` — Fetches a specific generated artifact with related findings and build status.
