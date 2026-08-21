#!/usr/bin/env bash
# Telegram -> cloud session relay. Runs on YOUR machine (or any always-on box),
# not inside the session: it polls Telegram and queues each message into a
# running cloud session with `claude -p --cloud`.
#
#   TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... \
#     ./.claude/hooks/telegram-relay.sh session_01ABC...
#
# Requires the Claude Code CLI signed in with `claude auth login`, plus jq and
# curl. Outbound messages come from the in-session hook; this only handles the
# inbound direction, so it works whether or not the hook is waiting.
set -euo pipefail

SESSION_ID="${1:-${CLAUDE_SESSION_ID:-}}"
if [[ -z "$SESSION_ID" ]]; then
  echo "usage: telegram-relay.sh <session-id|claude.ai/code URL>" >&2
  exit 64
fi

: "${TELEGRAM_BOT_TOKEN:?set TELEGRAM_BOT_TOKEN}"
: "${TELEGRAM_CHAT_ID:?set TELEGRAM_CHAT_ID}"

API="${TELEGRAM_API_BASE:-https://api.telegram.org}/bot${TELEGRAM_BOT_TOKEN}"
STATE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/claude-telegram-relay"
mkdir -p "$STATE_DIR"
OFFSET_FILE="$STATE_DIR/$(printf '%s' "$SESSION_ID" | tr -c 'A-Za-z0-9_' '_')"

if [[ ! -f "$OFFSET_FILE" ]]; then
  last="$(curl -sS --max-time 30 -G "$API/getUpdates" \
    --data-urlencode 'offset=-1' --data-urlencode 'timeout=0' \
    | jq -r '(.result // []) | last | .update_id // empty')"
  printf '%s' "$(( ${last:-0} + 1 ))" > "$OFFSET_FILE"
fi

notify() {
  curl -sS --max-time 30 -o /dev/null -X POST "$API/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=$1" || true
}

echo "relaying Telegram chat ${TELEGRAM_CHAT_ID} -> ${SESSION_ID}" >&2
notify "relay attached to ${SESSION_ID}"

while true; do
  updates="$(curl -sS --max-time 60 -G "$API/getUpdates" \
    --data-urlencode "offset=$(cat "$OFFSET_FILE")" \
    --data-urlencode 'timeout=50' \
    --data-urlencode 'allowed_updates=["message"]' || true)"

  [[ -n "$updates" ]] || { sleep 2; continue; }

  last_id="$(printf '%s' "$updates" | jq -r '(.result // []) | last | .update_id // empty')"
  [[ -n "$last_id" ]] && printf '%s' "$(( last_id + 1 ))" > "$OFFSET_FILE"

  while IFS= read -r text; do
    [[ -n "$text" ]] || continue
    if claude -p "$text" --cloud "$SESSION_ID" >/dev/null 2>&1; then
      echo "sent: $text" >&2
    else
      notify "could not deliver to ${SESSION_ID} (archived or expired?)"
    fi
  done < <(printf '%s' "$updates" | jq -r --arg chat "$TELEGRAM_CHAT_ID" '
    (.result // [])[]
    | select((.message.chat.id | tostring) == $chat)
    | .message.text // empty')
done
