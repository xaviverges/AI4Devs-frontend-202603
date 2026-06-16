# Prompts XVM

Registro de los prompts escritos por el usuario durante el desarrollo del frontend.

---

## Sesión: Interfaz "position" (kanban de candidatos)

### Prompt 1
> Use @claude.md for this session

### Prompt 2
> read @requirements/frontend-requirements.md and ask anything you need to know before we begin creating the new page

### Decisiones tomadas (respuestas a las preguntas de aclaración)
- **Librería drag & drop:** `@hello-pangea/dnd`
- **Routing:** Conectar la navegación desde el listado de posiciones (nueva ruta `/positions/:id` + botón "Ver proceso").
- **Cliente HTTP:** `fetch` nativo (sin nueva dependencia).
- **Instalación:** `npm` falló por verificación SSL del entorno (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`); se instaló con `--strict-ssl=false` solo para ese comando y se restauró `strict-ssl=true` inmediatamente.

---

## Resultado

### Archivos creados
| Archivo | Responsabilidad |
|---------|-----------------|
| `frontend/src/services/positionService.ts` | Llamadas `fetch` tipadas: `getInterviewFlow`, `getCandidates`, `updateCandidateStage` |
| `frontend/src/hooks/usePositionBoard.ts` | Carga flujo + candidatos, construye columnas, `moveCandidate` optimista con reversión ante error |
| `frontend/src/components/kanban/CandidateCard.tsx` | Tarjeta arrastrable — nombre completo + puntuación media |
| `frontend/src/components/kanban/KanbanColumn.tsx` | Columna (fase) soltable con cabecera + contador |
| `frontend/src/components/kanban/KanbanBoard.tsx` | `DragDropContext` + layout responsive |
| `frontend/src/components/PositionDetail.tsx` | Página: flecha atrás + título + estados carga/error + tablero |

### Archivos modificados
- `frontend/src/App.js` — nueva ruta `/positions/:id` → `PositionDetail`.
- `frontend/src/components/Positions.tsx` — ids en las posiciones mock; "Ver proceso" navega al detalle.

### Cobertura de requisitos
- ✅ Título de la posición arriba, con flecha de retorno a `/positions`.
- ✅ Una columna por fase del proceso (ordenadas por `orderIndex`).
- ✅ Tarjetas en la fase correcta, mostrando nombre completo y puntuación media.
- ✅ Arrastrar tarjeta entre columnas → `PUT /candidates/:id` con el step id destino (optimista, revierte si falla).
- ✅ Responsive móvil: las fases se apilan en vertical ocupando todo el ancho.

### Notas técnicas
- Se siguió el contrato **real** del backend (no el del doc): el endpoint de candidatos devuelve `id`/`applicationId`, la actualización es `PUT /candidates/:id`, y la ruta es en minúsculas `/positions/:id/interviewflow`.
- Base URL `http://localhost:3010` (igual que `candidateService.js`).
- `tsc --noEmit` pasa sin errores.

### Prompt 3
> Write a results resume to the prompts-xvm.md file, and show me a smoke-test page to review the result

Para revisar el resultado se levantó un **mock server** local (`frontend/dev-mock-server.js`, solo desarrollo, sin dependencias) que sirve los tres endpoints con datos de ejemplo, junto con el dev server de React. URL de revisión: `http://localhost:3000/positions/1`.

### Prompt 4
> I've stopped both server and frontend apps. Now you can try to execute

### Prompt 5
> Again, write my prompts and a summary updating prompts-xvm.md

---

## Resumen del smoke-test (puesta en marcha)

### Incidencias encontradas y resueltas
- **Puerto 3010 ocupado / contrato real distinto al doc:** al arrancar el mock se detectó que ya había un backend escuchando en `3010`. Al probarlo se descubrió que el backend **monta las rutas de posición en `/position` (singular)**, no en `/positions` (plural) como dice el documento de requisitos — ver `backend/src/index.ts:47`.
  - **Decisión:** alinear el frontend al backend real (`/position/:id/interviewflow` y `/position/:id/candidates`). Documentado con comentario en `positionService.ts`. El `PUT /candidates/:id` sí coincide con el doc.
- **Conflicto de puertos en dev:** había un dev server previo ocupando el `3000`. Tras pararlo el usuario, se relanzó limpio.

### Puesta en marcha (entorno de revisión)
- **Mock backend:** `node frontend/dev-mock-server.js` → `http://localhost:3010` (rutas `/position/...` + `PUT /candidates/:id`, con CORS y persistencia en memoria).
- **Frontend:** `npm start` (CRA) → `http://localhost:3000`.
- **Resultado:** *Compiled successfully*, sin errores de TypeScript.

### Verificación visual esperada
- Título **"Senior Backend Engineer"** + flecha de retorno a `/positions`.
- Tres columnas (Initial Screening, Technical Interview, Manager Interview) con sus contadores.
- Tarjetas con nombre + puntuación media; arrastrar entre columnas persiste el cambio (`PUT`), responsive en móvil (columnas en vertical).

### Notas
- `frontend/dev-mock-server.js` es **andamiaje solo para desarrollo**; puede borrarse una vez validado.
- La instalación de `@hello-pangea/dnd` requirió `--strict-ssl=false` puntual (restaurado a `true`).
