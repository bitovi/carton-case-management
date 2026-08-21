#!/usr/bin/env bash
# Bridges a Claude Code cloud session to a Telegram chat.
#
#   init    Baseline the getUpdates offset, announce the session.
#   notify  Send a one-way message (Notification / Stop events).
#   wait    Send a message, then long-poll Telegram for a reply. A reply is
#           written to stderr with exit 2, which blocks the Stop event and
#           feeds the text back to Claude as the next instruction.
#
# No-ops unless TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set, and always
# exits 0 on failure so a broken bridge can never wedge a session.
set -uo pipefail

MODE="${1:-notify}"
INPUT="$(cat 2>/dev/null || true)"

[[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]] || exit 0
if [[ "${TELEGRAM_LOCAL_TOO:-0}" != "1" && "${CLAUDE_CODE_REMOTE:-}" != "true" ]]; then
  exit 0
fi

API="${TELEGRAM_API_BASE:-https://api.telegram.org}/bot${TELEGRAM_BOT_TOKEN}"
STATE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/claude-telegram"
OFFSET_FILE="$STATE_DIR/offset"
ROUNDS_FILE="$STATE_DIR/rounds"
mkdir -p "$STATE_DIR"

WAIT_SECONDS="${TELEGRAM_WAIT_SECONDS:-240}"
MAX_ROUNDS="${TELEGRAM_MAX_WAIT_ROUNDS:-20}"

field() { printf '%s' "$INPUT" | jq -r "$1" 2>/dev/null || true; }

session_url() {
  local id="${CLAUDE_CODE_REMOTE_SESSION_ID:-}"
  [[ -n "$id" ]] || return 0
  printf 'https://claude.ai/code/%s' "${id/#cse_/session_}"
}

tag() {
  local repo id
  repo="$(basename "${CLAUDE_PROJECT_DIR:-$PWD}")"
  id="$(field '.session_id')"
  printf '[%s#%s]' "$repo" "${id:0:8}"
}

send() {
  local text="$1" url
  url="$(session_url)"
  [[ -n "$url" ]] && text="$text"$'\n\n'"$url"
  curl -sS --max-time 30 -o /dev/null \
    -X POST "$API/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=$(printf '%s' "$text" | head -c 3500)" \
    --data-urlencode "disable_notification=${TELEGRAM_SILENT:-false}" || true
}

# 25s is the longest Telegram will hold a getUpdates call open here.
poll_once() {
  curl -sS --max-time 40 -G "$API/getUpdates" \
    --data-urlencode "offset=$(cat "$OFFSET_FILE" 2>/dev/null || echo 0)" \
    --data-urlencode "timeout=25" \
    --data-urlencode "allowed_updates=[\"message\"]" 2>/dev/null || true
}

# Advance past everything currently queued so a fresh session ignores history.
baseline_offset() {
  local last
  last="$(curl -sS --max-time 30 -G "$API/getUpdates" \
    --data-urlencode "offset=-1" --data-urlencode "timeout=0" 2>/dev/null \
    | jq -r '(.result // []) | last | .update_id // empty' 2>/dev/null)"
  [[ -n "$last" ]] && printf '%s' "$((last + 1))" > "$OFFSET_FILE"
}

event="$(field '.hook_event_name')"

case "$MODE" in
  init)
    baseline_offset
    printf '0' > "$ROUNDS_FILE"
    if [[ "${TELEGRAM_ANNOUNCE_START:-1}" == "1" ]]; then
      send "$(tag) session started on $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
    fi
    exit 0
    ;;

  notify)
    case "$event" in
      Notification)
        body="$(field '.message // .notification_type // "waiting for input"')"
        send "$(tag) $body"
        ;;
      Stop)
        body="$(field '.last_assistant_message // ""')"
        send "$(tag) turn finished"$'\n\n'"${body:-(no message)}"
        ;;
      *)
        body="$(field '.message // ""')"
        send "$(tag) ${event:-event} ${body}"
        ;;
    esac
    exit 0
    ;;

  wait)
    rounds="$(cat "$ROUNDS_FILE" 2>/dev/null || echo 0)"
    if (( rounds >= MAX_ROUNDS )); then
      send "$(tag) reply limit reached ($MAX_ROUNDS), letting the session stop"
      exit 0
    fi

    body="$(field '.last_assistant_message // ""')"
    send "$(tag) turn finished — reply within ${WAIT_SECONDS}s to continue"$'\n\n'"${body:-(no message)}"

    deadline=$(( $(date +%s) + WAIT_SECONDS ))
    while (( $(date +%s) < deadline )); do
      updates="$(poll_once)"
      # Guard against hot-spinning if getUpdates errors or returns instantly.
      [[ -n "$updates" ]] || { sleep 2; continue; }

      last_id="$(printf '%s' "$updates" | jq -r '(.result // []) | last | .update_id // empty')"
      [[ -n "$last_id" ]] && printf '%s' "$((last_id + 1))" > "$OFFSET_FILE"

      reply="$(printf '%s' "$updates" | jq -r --arg chat "$TELEGRAM_CHAT_ID" '
        [ (.result // [])[]
          | select((.message.chat.id | tostring) == $chat)
          | .message.text // empty ]
        | join("\n")')"

      if [[ -n "$reply" ]]; then
        printf '%s' "$((rounds + 1))" > "$ROUNDS_FILE"
        printf 'Reply from Telegram (treat this as the user speaking): %s\n' "$reply" >&2
        exit 2
      fi
      sleep 1
    done
    exit 0
    ;;

  *)
    exit 0
    ;;
esac
