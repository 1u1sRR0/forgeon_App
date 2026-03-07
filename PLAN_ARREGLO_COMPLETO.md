# PLAN DE ARREGLO COMPLETO - TODO LO QUE FALTA

## ESTADO ACTUAL
- ✅ 157 archivos en src/
- ❌ 47 errores de TypeScript
- ❌ Código no compila

## ERRORES A ARREGLAR (EN ORDEN)

### 1. courseGenerator.ts (15 errores)
- Línea 49: `selectTemplate(context, template)` → debe ser `selectTemplate(context)`
- Línea 110: `buildLessons(levelId, topics, context, template)` → verificar firma correcta
- Línea 115: `lesson.quizId` → NO EXISTE, eliminar
- Línea 115: `buildQuizzes(lesson, context)` → verificar firma correcta
- Línea 125: `learningObjectives` → cambiar a `objectives`
- Línea 126: `estimatedMinutes` → NO EXISTE en CourseLevel, eliminar
- Línea 240: `learningObjectives` → cambiar a `objectives`
- Línea 241: `estimatedMinutes` → eliminar
- Línea 256: `quizId` → eliminar
- Línea 257: `prerequisites` → eliminar
- Línea 262-263: `quizId` → eliminar
- Línea 268: `lessonId` → cambiar a `levelId`
- Línea 291: `example` → eliminar

### 2. progressTracker.ts (5 errores)
- Línea 44: `quiz` → eliminar (Quiz está en level, no en lesson)
- Línea 66: `levels` → verificar que course incluya levels
- Línea 69, 76: tipos implícitos → agregar tipos explícitos
- `attemptedAt` → cambiar a `completedAt`
- `timeSpentMinutes` → cambiar a `timeSpent`

### 3. glossaryBuilder.ts, lessonBuilder.ts, quizBuilder.ts
- Verificar firmas de funciones
- Ajustar a ProjectContext actualizado

## ARCHIVOS QUE PUEDEN FALTAR

Según las fases completadas, deberían existir:

### Phase 0-1: Auth & Landing
- ✅ Landing page
- ✅ Auth pages
- ✅ Auth module

### Phase 2-3: Projects & Wizard
- ✅ Projects pages
- ✅ Wizard module

### Phase 4: Evaluation
- ✅ Evaluation module
- ✅ Agents

### Phase 5: Build
- ✅ Build module
- ✅ Templates

### Phase 6: PWA
- ✅ PWA components

### Phase 7: Hardening
- ✅ Error boundaries
- ✅ Security utils
- ✅ Toast system

### Phase 10A: Refactor (Opportunities, Market Gaps, Assistant)
- ✅ Opportunities system
- ✅ Market Gaps system
- ✅ Assistant system

### Phase 10D: Learn 2.0
- ✅ Course system (CON ERRORES)

### ¿QUÉ FALTA?
- ❓ Market Intelligence system (¿existía?)
- ❓ Otros sistemas mencionados en specs

## PLAN DE ACCIÓN

### PASO 1: Arreglar errores de TypeScript (30 min)
1. Arreglar courseGenerator.ts
2. Arreglar progressTracker.ts
3. Arreglar builders (glossary, lesson, quiz)
4. Verificar que compile sin errores

### PASO 2: Verificar archivos faltantes (15 min)
1. Comparar con git history
2. Listar archivos que existían antes
3. Crear los que falten

### PASO 3: Probar la aplicación (15 min)
1. `npm run build`
2. `npm run dev`
3. Probar cada feature
4. Verificar que TODO funcione

## TIEMPO TOTAL ESTIMADO: 1 hora

¿PROCEDER CON EL ARREGLO?
