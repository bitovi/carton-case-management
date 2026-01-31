#!/bin/bash

# Component Set Test Validation Script
# Validates that test files follow component-set-testing skill requirements
# Usage: ./validate-tests.sh <test-file-path>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
TESTS_WITH_COMMENTS=0
MISSING_COMMENTS=0
ERRORS=()

echo "🔍 Component Set Test Validator"
echo "================================"
echo ""

# Check if file path provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No test file specified${NC}"
    echo "Usage: $0 <test-file-path>"
    echo ""
    echo "Example:"
    echo "  $0 packages/client/src/components/ReactionStatistics/ReactionStatistics.test.tsx"
    exit 1
fi

TEST_FILE="$1"

# Check if file exists
if [ ! -f "$TEST_FILE" ]; then
    echo -e "${RED}Error: File not found: $TEST_FILE${NC}"
    exit 1
fi

echo "📄 Validating: $TEST_FILE"
echo ""

# ============================================================================
# Check 1: Variant Comment Coverage
# ============================================================================
echo "✓ Check 1: Variant Comment Coverage"
echo "   Looking for: // Figma Variant: Property=Value"
echo ""

# Find all it() and describe() blocks
while IFS=: read -r LINE_NUM line; do
    # Check if line contains it( or describe(
    if echo "$line" | grep -qE "(it|describe)\s*\("; then
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        
        # Check if previous line (or within 2 lines above) has variant comment
        START_LINE=$((LINE_NUM - 3))
        if [ $START_LINE -lt 1 ]; then
            START_LINE=1
        fi
        
        # Extract context around the test
        CONTEXT=$(sed -n "${START_LINE},${LINE_NUM}p" "$TEST_FILE")
        
        if echo "$CONTEXT" | grep -q "// Figma Variant:"; then
            TESTS_WITH_COMMENTS=$((TESTS_WITH_COMMENTS + 1))
        else
            MISSING_COMMENTS=$((MISSING_COMMENTS + 1))
            # Extract test name
            TEST_NAME=$(echo "$line" | sed -E "s/.*['\"](.+)['\"].*/\1/" | head -n 1)
            ERRORS+=("Line $LINE_NUM: Missing variant comment - \"$TEST_NAME\"")
        fi
    fi
done < <(grep -n -E "(it|describe)\s*\(" "$TEST_FILE" || true)

if [ $MISSING_COMMENTS -eq 0 ]; then
    echo -e "   ${GREEN}✓ All tests have variant comments ($TESTS_WITH_COMMENTS/$TOTAL_TESTS)${NC}"
else
    echo -e "   ${RED}✗ Missing variant comments: $MISSING_COMMENTS/$TOTAL_TESTS${NC}"
fi
echo ""

# ============================================================================
# Check 2: Interactive State Coverage (based on variant comments)
# ============================================================================
echo "✓ Check 2: Interactive State Coverage"
echo ""

# Extract all variant values from comments to understand what the component supports
VARIANT_COMMENTS=$(grep -o "// Figma Variant:.*" "$TEST_FILE" || true)

# Check if variants mention interactive states (case-insensitive)
HAS_HOVER_VARIANT=$(echo "$VARIANT_COMMENTS" | grep -iE "(State|Type|Mode)=(Hover|Hovered)" || true)
HAS_SELECTED_VARIANT=$(echo "$VARIANT_COMMENTS" | grep -iE "(State|Type|Mode)=(Selected|Active|Pressed)" || true)
HAS_FOCUS_VARIANT=$(echo "$VARIANT_COMMENTS" | grep -iE "(State|Type|Mode)=(Focus|Focused)" || true)
HAS_DISABLED_VARIANT=$(echo "$VARIANT_COMMENTS" | grep -iE "(State|Type|Mode)=(Disabled|Inactive)" || true)

# Only check for interaction tests if variants suggest them
if [ -n "$HAS_HOVER_VARIANT" ]; then
    if grep -qE "(userEvent\.hover|\.hover\()" "$TEST_FILE"; then
        echo -e "   ${GREEN}✓ Hover variant detected, hover tests found${NC}"
    else
        echo -e "   ${YELLOW}⚠ Hover variant detected, but no hover interaction tests found${NC}"
        echo "     Consider adding userEvent.hover() tests for hover state"
    fi
fi

if [ -n "$HAS_SELECTED_VARIANT" ]; then
    if grep -qE "(Selected|Active|Pressed)" "$TEST_FILE"; then
        echo -e "   ${GREEN}✓ Selection/active variant detected, related tests found${NC}"
    else
        echo -e "   ${YELLOW}⚠ Selection/active variant detected, but no related tests found${NC}"
        echo "     Consider testing how the component looks when selected/active"
    fi
fi

if [ -n "$HAS_FOCUS_VARIANT" ]; then
    if grep -qE "(\.focus\(\)|userEvent\.tab)" "$TEST_FILE"; then
        echo -e "   ${GREEN}✓ Focus variant detected, focus tests found${NC}"
    else
        echo -e "   ${YELLOW}⚠ Focus variant detected, but no focus tests found${NC}"
        echo "     Consider adding keyboard navigation tests"
    fi
fi

if [ -n "$HAS_DISABLED_VARIANT" ]; then
    if grep -qE "disabled" "$TEST_FILE"; then
        echo -e "   ${GREEN}✓ Disabled variant detected, disabled tests found${NC}"
    else
        echo -e "   ${YELLOW}⚠ Disabled variant detected, but no disabled state tests found${NC}"
        echo "     Consider testing disabled behavior"
    fi
fi

# If no interactive variants detected, that's fine
if [ -z "$HAS_HOVER_VARIANT" ] && [ -z "$HAS_SELECTED_VARIANT" ] && [ -z "$HAS_FOCUS_VARIANT" ] && [ -z "$HAS_DISABLED_VARIANT" ]; then
    echo -e "   ${GREEN}✓ No interactive state variants detected${NC}"
fi
echo ""

# ============================================================================
# Check 3: TODO Completion (Phase 5 Implementation Check)
# ============================================================================
echo "✓ Check 3: TODO Completion"
echo "   Checking that all test TODOs have been implemented..."
echo ""

# Count TODO comments in test file
TODO_COUNT=$(grep -c "// TODO" "$TEST_FILE" || true)

if [ $TODO_COUNT -eq 0 ]; then
    echo -e "   ${GREEN}✓ No TODOs remaining - all tests implemented${NC}"
else
    echo -e "   ${RED}✗ Found $TODO_COUNT TODO comments still in test file${NC}"
    echo "     Phase 5 implementation is incomplete. Found TODOs at:"
    grep -n "// TODO" "$TEST_FILE" | head -n 5 | while read -r line; do
        echo -e "     ${YELLOW}$line${NC}"
    done
    if [ $TODO_COUNT -gt 5 ]; then
        echo "     ... and $((TODO_COUNT - 5)) more"
    fi
    ERRORS+=("Found $TODO_COUNT unimplemented TODOs - Phase 5 incomplete")
fi
echo ""

# ============================================================================
# Check 4: Spacing Test Coverage
# ============================================================================
echo "✓ Check 4: Spacing Test Coverage"
echo "   Checking for padding, margin, gap tests..."
echo ""

HAS_SPACING_TESTS=false
if grep -qE "(toHaveClass.*['\"].*[pmg][xytblr]?-)" "$TEST_FILE"; then
    HAS_SPACING_TESTS=true
    echo -e "   ${GREEN}✓ Spacing tests found (padding/margin/gap)${NC}"
else
    echo -e "   ${YELLOW}⚠ No spacing tests detected${NC}"
    echo "     Consider testing padding (p-*), margin (m-*), and gap (gap-*)"
    echo "     These are commonly missed but critical for design fidelity"
fi
echo ""

# ============================================================================
# Check 5: Pseudo-Class Test Coverage
# ============================================================================
echo "✓ Check 5: Pseudo-Class Test Coverage"
echo "   Checking for hover:, focus:, active: style tests..."
echo ""

HAS_PSEUDO_TESTS=false
if grep -qE "toHaveClass.*['\"].*((hover|focus|active|disabled):)" "$TEST_FILE"; then
    HAS_PSEUDO_TESTS=true
    echo -e "   ${GREEN}✓ Pseudo-class style tests found${NC}"
else
    # Check if interactive variants exist
    if [ -n "$HAS_HOVER_VARIANT" ] || [ -n "$HAS_FOCUS_VARIANT" ] || [ -n "$HAS_DISABLED_VARIANT" ]; then
        echo -e "   ${YELLOW}⚠ Interactive variants detected but no pseudo-class tests found${NC}"
        echo "     Consider testing hover:, focus:, active:, disabled: utility classes"
        echo "     Example: expect(element).toHaveClass('hover:text-primary-600')"
    else
        echo -e "   ${GREEN}✓ No interactive variants - pseudo-class tests not required${NC}"
    fi
fi
echo ""

# ============================================================================
# Check 6: Value Precision (Design Variables)
# ============================================================================
echo "✓ Check 6: Value Precision"
echo ""

HAS_ARBITRARY_VALUES=false
if grep -qE "\[((\d+px)|(\d+rem))\]" "$TEST_FILE"; then
    HAS_ARBITRARY_VALUES=true
    echo -e "   ${YELLOW}⚠ Arbitrary Tailwind values found (e.g., h-[21px])${NC}"
    echo "     Verify these match exact design variable values"
else
    echo -e "   ${GREEN}✓ No arbitrary values detected${NC}"
fi
echo ""

# ============================================================================
# Summary Report
# ============================================================================
echo "================================"
echo "📊 Validation Summary"
echo "================================"
echo ""
echo "Test Coverage:"
echo "  Total tests/describes: $TOTAL_TESTS"
echo "  With variant comments: $TESTS_WITH_COMMENTS"
echo "  Missing comments: $MISSING_COMMENTS"
echo "  Remaining TODOs: $TODO_COUNT"
echo ""

# Print errors
if [ ${#ERRORS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Validation Errors:${NC}"
    echo ""
    for error in "${ERRORS[@]}"; do
        echo -e "  ${RED}•${NC} $error"
    done
    echo ""
fi

# Final verdict
if [ $MISSING_COMMENTS -eq 0 ] && [ $TODO_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ PASSED: All critical checks passed${NC}"
    echo ""
    echo "Summary:"
    echo "  ✓ All tests have Figma Variant comments"
    echo "  ✓ No TODOs remaining - implementation complete"
    if [ "$HAS_SPACING_TESTS" = true ]; then
        echo "  ✓ Spacing tests present"
    fi
    if [ "$HAS_PSEUDO_TESTS" = true ] || [ -z "$HAS_HOVER_VARIANT$HAS_FOCUS_VARIANT$HAS_DISABLED_VARIANT" ]; then
        echo "  ✓ Interactive state tests appropriate"
    fi
    echo ""
    exit 0
else
    echo -e "${RED}❌ FAILED: Fix errors before proceeding to Phase 6 (component implementation)${NC}"
    echo ""
    if [ $MISSING_COMMENTS -gt 0 ]; then
        echo "Required variant comment format:"
        echo "  // Figma Variant: State=Rest, Count=True"
        echo "  it('test name', () => { ... });"
        echo ""
    fi
    if [ $TODO_COUNT -gt 0 ]; then
        echo "All TODOs must be replaced with actual test implementations."
        echo "Review Phase 3 tracking table and implement remaining tests."
        echo ""
    fi
    exit 1
fi
