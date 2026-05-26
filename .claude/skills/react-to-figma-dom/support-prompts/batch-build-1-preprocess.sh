#!/usr/bin/env bash
set -euo pipefail

# batch-preprocess.sh
#
# Phase 1 of the batch pipeline testing workflow.
# For each component with figma-variants stories, runs the fully-automated
# portion of the pipeline:
#   1. capture-dom.js       — captures DOM + screenshots from Storybook
#   2. diff-variants.js     — pre-computes variant diffs
#   3. dom-to-figma-ir.js   — generates Figma IR per variant
#   4. ir-to-figma-code.js  — generates build-script.js per variant
#
# Writes preprocess-status.json per component and
# batch-preprocess-results.json at the pipeline root.
#
# Usage:
#   ./batch-preprocess.sh                       # process all components with stories
#   ./batch-preprocess.sh Button Badge          # process specific components
#   ./batch-preprocess.sh --skip-capture Button # skip DOM capture (reuse existing)
#
# Prerequisite: Storybook must be running at http://localhost:6006

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../../" && pwd)"
SKILL_DIR="${PROJECT_ROOT}/.claude/skills/react-to-figma-dom"
PIPELINE_DIR="${PROJECT_ROOT}/.temp/react-to-figma"
COMPONENTS_DIR="${PIPELINE_DIR}/components"

CAPTURE_SCRIPT="${SKILL_DIR}/scripts/capture-dom.js"
DIFF_SCRIPT="${SKILL_DIR}/scripts/diff-variants.js"
IR_SCRIPT="${SKILL_DIR}/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/dom-to-figma-ir.js"
CODE_SCRIPT="${SKILL_DIR}/6-get-component-context-and-implement-in-figma/2-implement-in-figma/scripts/ir-to-figma-code.js"

VARIABLES_MAP="${PIPELINE_DIR}/figma-variables-map.json"
DESIGN_TOKENS="${PIPELINE_DIR}/design-tokens.json"
ICONS_MAP="${PIPELINE_DIR}/figma-icons-map.json"
BUILT_COMPONENTS="${PIPELINE_DIR}/built-components.json"

STORYBOOK_URL="http://localhost:6006"

SKIP_CAPTURE=false
COMPONENT_LIST=()

for arg in "$@"; do
  if [[ "$arg" == "--skip-capture" ]]; then
    SKIP_CAPTURE=true
  else
    COMPONENT_LIST+=("$arg")
  fi
done

echo ""
echo "=================================================="
echo " React → Figma DOM Pipeline: Batch Preprocess"
echo "=================================================="
echo " Project root : ${PROJECT_ROOT}"
echo " Skip capture : ${SKIP_CAPTURE}"
echo ""

# ---------------------------------------------------------------------------
# Verify global prerequisites
# ---------------------------------------------------------------------------
for f in "$VARIABLES_MAP" "$DESIGN_TOKENS" "$ICONS_MAP" "$BUILT_COMPONENTS"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: Required global map not found: $f"
    echo "Run the earlier pipeline steps (steps 1-5 of react-to-figma-dom) to generate these."
    exit 1
  fi
done

if [[ "$SKIP_CAPTURE" == false ]]; then
  if ! curl -sf "${STORYBOOK_URL}/index.json" > /dev/null 2>&1; then
    echo "ERROR: Storybook is not running at ${STORYBOOK_URL}"
    echo "Start it with: cd packages/client && npm run storybook"
    exit 1
  fi
  echo "✓ Storybook is running at ${STORYBOOK_URL}"
fi

# ---------------------------------------------------------------------------
# Discover components
# ---------------------------------------------------------------------------
if [[ ${#COMPONENT_LIST[@]} -gt 0 ]]; then
  echo "Using provided component list: ${COMPONENT_LIST[*]}"
else
  echo "Discovering components with .figma-variants.stories.tsx files..."
  # Only search packages/client/src — Storybook only scans that directory,
  # so stories in .temp/ would be discovered here but invisible to capture-dom.js.
  COMPONENT_LIST=()
  while IFS= read -r comp_name; do
    COMPONENT_LIST+=("$comp_name")
  done < <(
    find "${PROJECT_ROOT}/packages/client/src" -name "*.figma-variants.stories.tsx" -type f \
      | xargs -I {} basename {} \
      | sed 's/\..*//' \
      | sort -u
  )
  echo "Found ${#COMPONENT_LIST[@]} components: ${COMPONENT_LIST[*]}"
fi

echo ""

# ---------------------------------------------------------------------------
# Per-component processing
# ---------------------------------------------------------------------------
RESULTS_JSON="${PIPELINE_DIR}/batch-preprocess-results.json"
echo "[" > "${RESULTS_JSON}.tmp"
FIRST_RESULT=true

TOTAL=0
TOTAL_OK=0
TOTAL_WARN=0
TOTAL_FAIL=0

process_component() {
  local COMP_NAME="$1"
  local COMP_DIR="${COMPONENTS_DIR}/${COMP_NAME}"
  local VARIANTS_DIR="${COMP_DIR}/variants"
  local STATUS_FILE="${COMP_DIR}/preprocess-status.json"

  echo "--------------------------------------------------"
  echo "Component: ${COMP_NAME}"
  echo "--------------------------------------------------"

  mkdir -p "${COMP_DIR}"

  local capture_status="skip"
  local capture_captured=0
  local capture_failed=0
  local diff_status="skip"
  local ir_status="skip"
  local ir_ok=0
  local ir_failed=0
  local code_status="skip"
  local code_ok=0
  local code_failed=0
  local overall="ok"

  # ── Step 1: Capture DOM ────────────────────────────────────────────────
  if [[ "$SKIP_CAPTURE" == true ]] && [[ -d "$VARIANTS_DIR" ]] && [[ -f "${VARIANTS_DIR}/capture-manifest.json" ]]; then
    echo "  [capture] Skipping — existing captures found"
    capture_status="skipped"
    capture_captured=$(find "$VARIANTS_DIR" -name "dom.json" | wc -l | tr -d ' ')
  else
    echo "  [capture] Running capture-dom.js..."
    if node "$CAPTURE_SCRIPT" \
        --component "$COMP_NAME" \
        --storybook-url "$STORYBOOK_URL" \
        --output-dir "$VARIANTS_DIR" 2>&1; then
      capture_status="ok"
    else
      capture_status="failed"
      overall="fail"
    fi

    if [[ -f "${VARIANTS_DIR}/capture-manifest.json" ]]; then
      capture_captured=$(node -e "const m=require('${VARIANTS_DIR}/capture-manifest.json'); console.log(m.captured ? m.captured.length : 0);")
      capture_failed=$(node -e "const m=require('${VARIANTS_DIR}/capture-manifest.json'); console.log(m.failed ? m.failed.length : 0);")
      if [[ "$capture_failed" -gt 0 ]]; then
        echo "  [capture] WARNING: ${capture_failed} variant(s) failed to capture"
        [[ "$overall" != "fail" ]] && overall="warn"
      fi
      echo "  [capture] Captured: ${capture_captured}, Failed: ${capture_failed}"
    fi
  fi

  # ── Step 2: Diff variants ──────────────────────────────────────────────
  local dom_count
  dom_count=$(find "$VARIANTS_DIR" -name "dom.json" 2>/dev/null | wc -l | tr -d ' ')
  if [[ "$dom_count" -gt 0 ]]; then
    echo "  [diff] Running diff-variants.js on ${dom_count} variant(s)..."
    if node "$DIFF_SCRIPT" --variants-dir "$VARIANTS_DIR" > /dev/null 2>&1; then
      diff_status="ok"
      echo "  [diff] Done → ${COMP_DIR}/variant-diffs.md"
    else
      diff_status="failed"
      echo "  [diff] FAILED"
      [[ "$overall" != "fail" ]] && overall="warn"
    fi
  else
    diff_status="no_variants"
    echo "  [diff] Skipping — no dom.json files found"
    overall="fail"
  fi

  # ── Step 3 & 4: IR generation + code generation per variant ───────────
  local variant_dirs=()
  while IFS= read -r dom_file; do
    variant_dirs+=("$(dirname "$dom_file")")
  done < <(find "$VARIANTS_DIR" -name "dom.json" 2>/dev/null | sort)

  if [[ ${#variant_dirs[@]} -gt 0 ]]; then
    ir_status="ok"
    code_status="ok"
    echo "  [ir+code] Processing ${#variant_dirs[@]} variant(s)..."

    for variant_dir in "${variant_dirs[@]}"; do
      local variant_name
      variant_name=$(basename "$variant_dir")
      local ir_output="${variant_dir}/figma-ir.json"
      local code_output="${variant_dir}/build-script.js"

      # dom-to-figma-ir.js
      if node "$IR_SCRIPT" \
          --dom-file "${variant_dir}/dom.json" \
          --fiber-map "${variant_dir}/fiber-dom-map.json" \
          --variables-map "$VARIABLES_MAP" \
          --design-tokens "$DESIGN_TOKENS" \
          --icons-map "$ICONS_MAP" \
          --built-components "$BUILT_COMPONENTS" \
          --component-name "$COMP_NAME" \
          --output "$ir_output" 2>&1; then
        ((ir_ok++)) || true
      else
        echo "    ERROR: IR generation failed for '${variant_name}'"
        ((ir_failed++)) || true
        ir_status="partial"
        [[ "$overall" != "fail" ]] && overall="warn"
        continue
      fi

      # ir-to-figma-code.js
      if node "$CODE_SCRIPT" \
          --ir-file "$ir_output" \
          --output "$code_output" 2>&1; then
        ((code_ok++)) || true
      else
        echo "    ERROR: Code generation failed for '${variant_name}'"
        ((code_failed++)) || true
        code_status="partial"
        [[ "$overall" != "fail" ]] && overall="warn"
      fi
    done

    [[ "$ir_failed" -gt 0 ]] && ir_status="partial"
    [[ "$code_failed" -gt 0 ]] && code_status="partial"
    echo "  [ir]   ok=${ir_ok} failed=${ir_failed}"
    echo "  [code] ok=${code_ok} failed=${code_failed}"
  fi

  # ── Write per-component status ─────────────────────────────────────────
  local build_script_count
  build_script_count=$(find "$VARIANTS_DIR" -name "build-script.js" 2>/dev/null | wc -l | tr -d ' ')

  cat > "$STATUS_FILE" <<JSON
{
  "componentName": "${COMP_NAME}",
  "componentDir": "${COMP_DIR}",
  "variantsDir": "${VARIANTS_DIR}",
  "overall": "${overall}",
  "steps": {
    "capture": {
      "status": "${capture_status}",
      "captured": ${capture_captured},
      "failed": ${capture_failed}
    },
    "diff": { "status": "${diff_status}" },
    "ir": { "status": "${ir_status}", "ok": ${ir_ok}, "failed": ${ir_failed} },
    "code": { "status": "${code_status}", "ok": ${code_ok}, "failed": ${code_failed} }
  },
  "buildScriptCount": ${build_script_count},
  "readyForFigma": $([ "${overall}" != "fail" ] && [ "${build_script_count}" -gt 0 ] && echo "true" || echo "false")
}
JSON

  echo "  Overall: ${overall} (${build_script_count} build-script.js files ready)"
  echo ""

  # Return data for aggregate JSON
  echo "${COMP_NAME}|${overall}|${build_script_count}"
}

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
declare -a RESULT_LINES

for COMP in "${COMPONENT_LIST[@]}"; do
  TOTAL=$((TOTAL + 1))
  result=$(process_component "$COMP")
  # Capture the last line which contains the summary pipe-separated string
  summary_line=$(echo "$result" | tail -1)
  RESULT_LINES+=("$summary_line")

  overall_part=$(echo "$summary_line" | cut -d'|' -f2)
  case "$overall_part" in
    ok)   TOTAL_OK=$((TOTAL_OK + 1)) ;;
    warn) TOTAL_WARN=$((TOTAL_WARN + 1)) ;;
    fail) TOTAL_FAIL=$((TOTAL_FAIL + 1)) ;;
  esac
done

# ---------------------------------------------------------------------------
# Write batch-preprocess-results.json
# ---------------------------------------------------------------------------
RESULTS_JSON="${PIPELINE_DIR}/batch-preprocess-results.json"
{
  echo "{"
  echo "  \"generatedAt\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","
  echo "  \"total\": ${TOTAL},"
  echo "  \"ok\": ${TOTAL_OK},"
  echo "  \"warn\": ${TOTAL_WARN},"
  echo "  \"fail\": ${TOTAL_FAIL},"
  echo "  \"components\": ["
  first=true
  for COMP in "${COMPONENT_LIST[@]}"; do
    STATUS_FILE="${COMPONENTS_DIR}/${COMP}/preprocess-status.json"
    if [[ -f "$STATUS_FILE" ]]; then
      [[ "$first" != true ]] && echo ","
      cat "$STATUS_FILE"
      first=false
    fi
  done
  echo ""
  echo "  ]"
  echo "}"
} > "$RESULTS_JSON"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "=================================================="
echo " Batch Preprocess Complete"
echo "=================================================="
echo " Total   : ${TOTAL}"
echo " OK      : ${TOTAL_OK}"
echo " Warnings: ${TOTAL_WARN}"
echo " Failed  : ${TOTAL_FAIL}"
echo ""
echo " Results : ${RESULTS_JSON}"
echo ""

if [[ $TOTAL_FAIL -gt 0 ]]; then
  echo "Some components failed. Check preprocess-status.json in each component dir."
  echo "Components ready for Figma MCP phase:"
fi

for COMP in "${COMPONENT_LIST[@]}"; do
  STATUS_FILE="${COMPONENTS_DIR}/${COMP}/preprocess-status.json"
  if [[ -f "$STATUS_FILE" ]]; then
    ready=$(node -e "const s=require('${STATUS_FILE}'); console.log(s.readyForFigma);")
    count=$(node -e "const s=require('${STATUS_FILE}'); console.log(s.buildScriptCount);")
    if [[ "$ready" == "true" ]]; then
      echo "  ✓ ${COMP} (${count} variants)"
    else
      echo "  ✗ ${COMP} — NOT READY"
    fi
  fi
done

echo ""
echo "Next step: Run the batch-build-2-build-and-verify.md agent prompt"
echo "  → Pass it: ${RESULTS_JSON}"
