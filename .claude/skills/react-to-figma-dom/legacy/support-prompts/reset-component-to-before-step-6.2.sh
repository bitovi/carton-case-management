#!/usr/bin/env bash
set -euo pipefail

# Reset a component's DOM pipeline output to its pre-step-6.2 state.
# Removes build artifacts (figma-ir.json, build-script.js, figma-result.md,
# variant-diffs.md) while preserving the DOM captures (dom.json,
# fiber-dom-map.json, screenshot.png) and component context files.
#
# Usage: ./reset-component-to-before-step-6.2.sh [ComponentName]
#        With no argument, resets ALL component directories.
# Run from the project root.

COMPONENTS_DIR=".temp/react-to-figma/components"
BUILD_ORDER=".temp/react-to-figma/component-hierarchy/build-order.md"

reset_component() {
  local NAME="$1"
  local COMP_DIR="${COMPONENTS_DIR}/${NAME}"

  if [[ ! -d "$COMP_DIR" ]]; then
    echo "SKIP: Directory not found for ${NAME}"
    return
  fi

  echo "Removing step 6.2 artifacts from ${COMP_DIR}..."

  # Remove component-level build outputs
  rm -f \
    "${COMP_DIR}/figma-result.md" \
    "${COMP_DIR}/figma-result.json" \
    "${COMP_DIR}/variant-diffs.md" \
    "${COMP_DIR}/component-set-screenshot.png"

  # Remove per-variant build artifacts (preserve dom.json, fiber-dom-map.json, screenshot.png)
  if [[ -d "${COMP_DIR}/variants" ]]; then
    find "${COMP_DIR}/variants" -name "figma-ir.json" -delete
    find "${COMP_DIR}/variants" -name "build-script.js" -delete
    find "${COMP_DIR}/variants" -name "build-script.chunk*.js" -delete
    echo "  Cleaned per-variant figma-ir.json and build-script.js files"
  fi

  # Update build-order.md if it exists
  if [[ -f "$BUILD_ORDER" ]]; then
    if grep -q "| ✅ ${NAME}" "$BUILD_ORDER"; then
      sed -i '' "s/| ✅ ${NAME}/| ${NAME}/g" "$BUILD_ORDER"
      echo "  build-order.md: Removed ✅ marker"
    fi
  fi

  echo "  Remaining top-level files:"
  ls -1 "${COMP_DIR}" | sed 's/^/    /'
  echo ""
}

NAME="${1:-}"

if [[ -n "$NAME" ]]; then
  if [[ ! -f "$BUILD_ORDER" ]]; then
    echo "ERROR: build-order.md not found at $BUILD_ORDER"
    exit 1
  fi
  if ! grep -q "${NAME}" "$BUILD_ORDER"; then
    echo "ERROR: Component \"${NAME}\" not found in build-order.md."
    exit 1
  fi
  reset_component "$NAME"
  echo "Component ${NAME} reset to pre-step-6.2 state. DOM captures preserved. Ready to rerun build-all."
else
  if [[ ! -d "$COMPONENTS_DIR" ]]; then
    echo "ERROR: Components directory not found at $COMPONENTS_DIR"
    exit 1
  fi
  COUNT=0
  for DIR in "${COMPONENTS_DIR}"/*/; do
    [[ -d "$DIR" ]] || continue
    COMP_NAME=$(basename "$DIR")
    reset_component "$COMP_NAME"
    ((COUNT++))
  done
  echo "Reset ${COUNT} components to pre-step-6.2 state. DOM captures preserved. Ready to rerun build-all."
fi
