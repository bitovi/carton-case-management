---
name: security-review
description: Perform a thorough security review of the codebase using the OWASP Top 10 (2021) as the primary framework.
---

# Security Review Skill

Perform a thorough security review of the codebase using the **OWASP Top 10 (2021)** as the primary framework.

## Scope

Before starting, identify and document the layers present in the codebase:

- **API / server** — route handlers, controllers, middleware
- **Authentication & sessions** — login flows, token/cookie handling, session management
- **Database access** — queries, ORM usage, raw SQL
- **Client / front-end** — data rendering, forms, user-supplied input handling
- **Input validation** — schema validation, sanitisation layers
- **Configuration & secrets** — environment variables, config files, hardcoded values

Adjust your review to the layers that actually exist; skip sections that are not applicable.

---

## OWASP Top 10 (2021) Checklist

Work through each category. For every category, search the codebase for relevant patterns, quote the offending code, and provide a severity rating and remediation recommendation.

### A01 — Broken Access Control
- Are protected routes or endpoints enforcing authentication before executing business logic?
- Can a user read or mutate another user's data by supplying a different resource ID?
- Are ownership or role checks present on all sensitive queries and mutations?
- Are there any operations that should be restricted to privileged users but are not?

### A02 — Cryptographic Failures
- Are secrets, tokens, or sensitive values stored or transmitted in plaintext?
- Are passwords hashed with a strong, modern algorithm (bcrypt, argon2, scrypt)?
- Are cookies set with `Secure`, `HttpOnly`, and `SameSite` attributes?
- Is TLS enforced for all external communication?

### A03 — Injection
- Are all database queries using parameterised statements or a safe ORM API — never string interpolation?
- Is user input ever passed to `eval`, `Function()`, shell commands, file paths, or template engines without sanitisation?
- Does input validation enforce strict types, formats, and maximum lengths on all user-supplied data?

### A04 — Insecure Design
- Are development-only helpers, backdoors, or mock authentication mechanisms gated so they cannot run in production?
- Is there rate-limiting or brute-force protection on authentication and other sensitive endpoints?
- Are trust boundaries clearly defined — does the server re-validate data it receives from the client?

### A05 — Security Misconfiguration
- Are debug modes, verbose error responses, or stack traces disabled in production?
- Is CORS restricted to known, explicit origins rather than a wildcard?
- Are unused routes, endpoints, or features disabled or removed?
- Are dependency installation scripts (`postinstall`, etc.) reviewed for unexpected behaviour?

### A06 — Vulnerable and Outdated Components
- Run the appropriate package audit tool (e.g., `npm audit`, `pip audit`) and list any high or critical advisories.
- Are any dependencies pinned to versions with known CVEs?

### A07 — Identification and Authentication Failures
- Are session tokens or cookies signed and verified server-side so they cannot be forged by the client?
- Is there session invalidation on logout?
- Are there protections against session fixation, credential stuffing, or cookie theft?

### A08 — Software and Data Integrity Failures
- Are CI/CD pipelines and build scripts fetching resources only from trusted, pinned sources?
- Is seed or fixture data safe to run in a production environment?
- Are dependency lock files committed and verified?

### A09 — Security Logging and Monitoring Failures
- Are authentication failures, access-control violations, and validation errors logged?
- Are logs sanitised to avoid capturing sensitive user data (PII, tokens, passwords)?
- Is there structured logging in place that would support alerting or incident response?

### A10 — Server-Side Request Forgery (SSRF)
- Does any server-side code make HTTP requests using URLs supplied or influenced by user input?
- Are external service URLs hardcoded or validated against an explicit allowlist?

---

## Chain-of-Thought Process

1. **Enumerate entry points** — list all API endpoints or server-side entry points and classify each as public or authenticated.
2. **Trace data flow** — for each entry point, follow user input from validation through business logic to persistence and back to the response.
3. **Apply checklist** — work through all 10 OWASP categories above, referencing specific files and line numbers.
4. **Score findings** — rate each finding: `Critical | High | Medium | Low | Informational`.
5. **Deduplicate** — consolidate findings that share the same root cause.
6. **Recommend** — for each finding provide a concrete, minimal code change to remediate it.

---

## Output Format

Produce a structured report with this layout:

```
## Security Review Report

### Executive Summary
<2–4 sentence overview of overall security posture>

### Findings

#### [SEVERITY] <Short title> — <OWASP Category>
- **File:** `path/to/file` (line N)
- **Description:** What the vulnerability is and why it is exploitable.
- **Evidence:** (quote the relevant code snippet)
- **Remediation:** Specific code change or configuration fix.

...

### Passed Checks
List OWASP categories or specific patterns that were reviewed and found to be acceptably implemented.

### Recommendations Summary
Ordered list of the top actions to take, highest severity first.
```

---

## Constraints

- Do not invent findings. Every issue must reference actual code in the workspace.
- Do not suggest architectural rewrites unless the current design is fundamentally broken; prefer minimal, targeted fixes.
- Use the existing libraries and validation patterns already present in the codebase in any remediation examples; do not propose new dependencies.
