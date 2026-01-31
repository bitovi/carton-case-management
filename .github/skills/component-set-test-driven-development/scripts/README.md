# Component Set Testing Validation Script

This script validates that test files follow the component-set-testing skill requirements.

## Usage

```bash
# Validate a single test file
.github/skills/component-set-testing/scripts/validate-tests.sh \
  packages/client/src/components/MyComponent/MyComponent.test.tsx

# Example output
🔍 Component Set Test Validator
================================

📄 Validating: packages/client/src/components/MyComponent/MyComponent.test.tsx

✓ Check 1: Variant Comment Coverage
   ✓ All tests have variant comments (15/15)

✓ Check 2: Interactive State Coverage
   ✓ Hover tests found (3 occurrences)
   ✓ Selection/active state tests found

✓ Check 3: Tooltip/Overlay Testing
   ✓ Tooltip/overlay tests found

✓ Check 4: Value Precision
   ✓ No arbitrary values detected

✅ PASSED: All critical checks passed
```

## What It Checks

### 1. Variant Comment Coverage (REQUIRED)
Every `it()` and `describe()` block must have a comment in the format:
```typescript
// Figma Variant: State=Rest, Count=True
it('renders correctly', () => { ... });
```

**This is the only check that causes failure.** The script enforces this as non-negotiable.

### 2. Interactive State Coverage (Context-Aware)
The script **reads your variant comments** to understand what states exist, then checks if appropriate tests are present:

- If it finds `State=Hover` → Looks for `userEvent.hover()` tests
- If it finds `State=Selected` or `State=Active` → Looks for selection-related tests
- If it finds `State=Focus` → Looks for focus/keyboard tests  
- If it finds `State=Disabled` → Looks for disabled state tests

**Warnings only** - Won't fail the build, just suggests improvements based on your actual variants.

Example:
```typescript
// Figma Variant: State=Hover
describe('Hover state', () => {
  // ✓ Script sees "State=Hover" and checks for hover interaction tests
  it('highlights on hover', async () => {
    await userEvent.hover(element); // ✓ Found!
  });
});
```

### 3. Value Precision
- Flags arbitrary Tailwind values like `h-[21px]` or `w-[18px]`
- These should match exact design variable values from Figma
- **Warning only** - Reminds you to verify against `get_variable_defs` results

## Exit Codes

- `0` - All checks passed (tests can be committed)
- `1` - Critical issues found (missing variant comments)

## Integration with CI

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Validate Component Set Tests
  run: |
    find packages/client/src/components -name "*.test.tsx" -type f | while read file; do
      if grep -q "Figma Variant:" "$file"; then
        .github/skills/component-set-testing/scripts/validate-tests.sh "$file"
      fi
    done
```

## Fixing Validation Errors

If you see:
```
❌ Line 42: Missing variant comment - "renders upvote button"
```

Add a variant comment above the test:
```typescript
// Figma Variant: State=Rest, Count=False
it('renders upvote button', () => {
  // test implementation
});
```

Every test must document which Figma variant combination it validates.
