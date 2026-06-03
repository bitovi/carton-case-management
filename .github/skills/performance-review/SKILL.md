---
name: performance-review
description: Perform a thorough performance review of the codebase, identifying bottlenecks, inefficiencies, and optimization opportunities across all layers.
---

# Performance Review Skill

Perform a thorough performance review of the codebase, identifying bottlenecks, inefficiencies, and optimization opportunities across all layers.

## Scope

Before starting, identify the layers present in the codebase and adjust your review accordingly:

- **Client / front-end** — rendering, bundle size, asset loading, caching, state management
- **API layer** — endpoint design, payload size, serialization, connection handling
- **Database** — query efficiency, indexing, N+1 patterns, transaction scope
- **Network** — latency, compression, HTTP caching headers, request waterfalls
- **Build & tooling** — bundle splitting, tree-shaking, build times, dependency weight

Skip sections that are not applicable to the stack.

---

## Performance Review Checklist

Work through each area. For every issue found, quote the relevant code, explain the impact, and provide a concrete remediation recommendation.

### Front-End Rendering
- Are expensive computations or derived values memoized, or are they recalculated on every render?
- Are large lists virtualized, or is the full dataset rendered into the DOM at once?
- Are components re-rendering unnecessarily due to unstable references (inline objects, functions, arrays as props)?
- Are images and media served at appropriate sizes with modern formats (WebP, AVIF)?
- Are web fonts loading in a render-blocking way?
- Is there excessive layout thrashing caused by reading and writing to the DOM in the same frame?

### Bundle & Asset Loading
- Is the application bundle split so that the initial load only delivers what is needed?
- Are heavy third-party libraries tree-shaken or replaced with lighter alternatives where possible?
- Are static assets served with long-lived cache headers and content-hashed filenames?
- Are there any unused imports or dead code paths that inflate the bundle?
- Are scripts that are not needed on initial paint deferred or loaded asynchronously?

### API Design & Payload
- Are API responses scoped to only the fields the client needs, or are large objects returned in full?
- Are related data needs batched into a single request rather than triggering multiple round trips?
- Are HTTP responses compressed (gzip or brotli)?
- Are appropriate HTTP cache headers set on read-heavy endpoints?
- Are paginated or cursor-based responses used for collections rather than returning unbounded result sets?

### Database Queries
- Are there N+1 query patterns where a query is issued inside a loop or per row of a parent result?
- Are queries fetching only the columns they need, or are full rows selected unnecessarily?
- Are indexes present on columns used in `WHERE`, `ORDER BY`, and `JOIN` conditions for frequent queries?
- Are large write operations wrapped in transactions to reduce round trips?
- Are there any synchronous or blocking database calls in a hot path that could be parallelized?
- Are database connection pools sized appropriately for the expected concurrency?

### Server & API Runtime
- Are there synchronous, CPU-bound operations running on the main thread that block the event loop?
- Are independent async operations run in parallel (e.g., `Promise.all`) rather than sequentially with `await`?
- Is response data cached at the application layer for read-heavy, infrequently changing resources?
- Are large file or stream operations handled as streams rather than loading the full payload into memory?

### Network & Infrastructure
- Are repeated identical requests within a short window deduplicated or coalesced?
- Is there a CDN or edge cache in front of static assets and cacheable API responses?
- Is HTTP/2 or HTTP/3 in use to allow request multiplexing?
- Are third-party scripts and resources loading in a way that blocks critical rendering?

---

## Chain-of-Thought Process

1. **Identify hot paths** — find the operations that run most frequently or are most user-visible (page loads, primary data fetches, form submissions).
2. **Trace data flow** — for each hot path, follow the request from the client through the API layer to the database and back, noting every transformation and round trip.
3. **Apply checklist** — work through all areas above, referencing specific files and line numbers.
4. **Score findings** — rate each finding by impact: `High | Medium | Low | Informational`.
5. **Estimate effort** — for each finding, note the implementation effort: `Trivial | Low | Medium | High`.
6. **Prioritize** — rank findings by the ratio of impact to effort; quick wins come first.

---

## Output Format

Produce a structured report with this layout:

```
## Performance Review Report

### Executive Summary
<2–4 sentence overview of overall performance posture and the most impactful areas>

### Findings

#### [IMPACT] <Short title> — <Area>
- **File:** `path/to/file` (line N)
- **Description:** What the inefficiency is and how it affects users or the system.
- **Evidence:** (quote the relevant code snippet)
- **Effort:** Trivial | Low | Medium | High
- **Remediation:** Specific code change, query fix, or configuration adjustment.

...

### Quick Wins
List findings with High or Medium impact and Trivial or Low effort — the best immediate actions.

### Passed Checks
List areas that were reviewed and found to be acceptably implemented.

### Recommendations Summary
Ordered list of the top actions to take, highest impact-to-effort ratio first.
```

---

## Constraints

- Do not flag performance concerns without evidence in the code that the pattern actually exists.
- Do not recommend premature optimizations in code paths that are not on a hot path.
- Prefer improving existing patterns and libraries already in use over introducing new dependencies.
- Distinguish between a proven bottleneck (measurable, visible in code) and a risk (pattern that *could* be slow at scale) — label each clearly.
