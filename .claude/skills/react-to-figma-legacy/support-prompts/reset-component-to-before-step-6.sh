#!/usr/bin/env bash
set -euo pipefail

# Reset a component's output directory to its pre-step-6 state.
# Usage: ./reset-component-to-before-step-6.sh [ComponentName]
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

  echo "Removing step 6 artifacts from ${COMP_DIR}..."
  cd "$COMP_DIR"
  rm -f \
    variants.md \
    stories-manifest.md \
    figma-variants.md \
    build-plan.md \
    figma-result.md \
    verification.md \
    verification-results.json \
    variant-plans.md \
    screenshots-manifest.json \
    verify-manifest.json \
    run_all_diffs.sh \
    README.md \
    component-set-screenshot.png

  rm -rf \
    screenshots \
    variants \
    diffs \
    diffs-new \
    figma-variants \
    screenshots-cropped \
    build \
    default-variant

  cd - > /dev/null

  if [[ -f "$BUILD_ORDER" ]]; then
    if grep -q "| ✅ ${NAME}" "$BUILD_ORDER"; then
      sed -i '' "s/| ✅ ${NAME}/| ${NAME}/g" "$BUILD_ORDER"
      echo "  build-order.md: Removed ✅ marker"
    fi
    if grep -q "\- \[x\] ${NAME}" "$BUILD_ORDER"; then
      sed -i '' "s/- \[x\] ${NAME}/- [ ] ${NAME}/g" "$BUILD_ORDER"
      echo "  build-order.md: Reset [x] checkbox"
    fi
  fi

  echo "  Remaining files:"
  ls -1 "$COMP_DIR" | sed 's/^/    /'
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
  echo "Component ${NAME} reset to pre-step-6 state. Ready to rerun step 6."
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
  echo "Reset ${COUNT} components to pre-step-6 state. Ready to rerun step 6."
fi
