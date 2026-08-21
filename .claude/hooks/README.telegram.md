# Telegram bridge for Claude Code cloud sessions

There is no Telegram connector for Claude Code, but a cloud session can talk to
Telegram over plain HTTPS, and the CLI can queue messages back into a running
session. That's enough for two-way monitoring.

Before setting this up: the **Claude mobile app** already monitors cloud sessions
and lets you reply to them, and [Remote Control](https://code.claude.com/docs/en/remote-control)
does the same for local sessions. Use this bridge when you specifically want
Telegram — a shared team chat, a group that isn't on Claude, or phone
notifications without opening the app.

## How it works

```
                 outbound (hooks, in-session)
  cloud session ────────────────────────────────►  Telegram chat
   │  SessionStart / Notification / Stop hooks
   │  curl api.telegram.org/sendMessage
   │
   │             inbound, pick one:
   │  A) relay:  telegram-relay.sh on your box  ── claude -p --cloud <id> ──►
   └─ B) wait:   Stop hook long-polls getUpdates, exit 2 feeds the reply back
```

- **Outbound** is `telegram-notify.sh` wired to hooks in `.claude/settings.json`.
  It sends the end of each turn, permission/idle notifications, and the session
  link (`CLAUDE_CODE_REMOTE_SESSION_ID`, `cse_` rewritten to `session_`).
- **Inbound A (recommended)** is `telegram-relay.sh`, run on your laptop or any
  always-on box. It polls Telegram and queues each message into the session with
  `claude -p "<text>" --cloud <session-id>`. Nothing runs in the container, so it
  works whether the session is busy, idle, or between turns.
- **Inbound B** needs no external machine: set `TELEGRAM_STOP_MODE=wait` and the
  Stop hook holds the session open at the end of a turn, long-polling Telegram.
  A reply exits 2, which blocks the stop and hands the text to Claude as the next
  instruction. Costs wall-clock on every turn and can't answer permission
  prompts — the session is already stopped by then.

Both can be on at once: the relay handles anything you send at any time, `wait`
just makes the session pause and listen at the end of a turn.

## Setup

### 1. Create the bot and find your chat id

In Telegram, message `@BotFather` → `/newbot` → copy the token. Send your new bot
any message, then:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | jq '.result[].message.chat.id'
```

For a group, add the bot to the group first; group ids are negative. Consider
`/setprivacy` → Disable if the bot needs to see all group messages.

### 2. Allow the domain in the cloud environment

Cloud environments default to **Trusted** network access, which does **not**
include `api.telegram.org` — outbound requests fail with a proxy 403 until you
change this. At [claude.ai/code](https://claude.ai/code), open the environment
selector → environment settings → **Network access: Custom**, add:

```
api.telegram.org
```

and check *Also include default list of common package managers* so npm, PyPI and
friends keep working.

### 3. Set the environment variables

Same dialog, **Environment variables**, `.env` format:

```text
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=987654321
```

> Cloud environments have **no secrets store** — anyone who can use the
> environment can read these values, and they are visible in the environment
> config. Use a dedicated bot that has access to nothing but this chat, keep the
> environment personal rather than org-shared, and rotate the token via BotFather
> if it leaks. This is the main reason to prefer inbound option A: the relay keeps
> the token on your own machine and only the outbound half needs it here.

Variables are copied into the session **at startup**, so changes apply to the
next session, not this one.

### 4. Run the relay (inbound option A)

On a machine signed in with `claude auth login`:

```bash
export TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...
./.claude/hooks/telegram-relay.sh session_01ABC...
```

Get the session id from its `claude.ai/code/<id>` URL; the script takes the id or
the full URL.

## Configuration

| Variable | Default | Effect |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | — | Required. Bridge is inert without it. |
| `TELEGRAM_CHAT_ID` | — | Required. Destination chat, and the only chat replies are accepted from. |
| `TELEGRAM_STOP_MODE` | `notify` | `wait` turns on inbound option B. |
| `TELEGRAM_WAIT_SECONDS` | `240` | How long `wait` holds a turn open. Keep below the hook's 600s timeout. |
| `TELEGRAM_MAX_WAIT_ROUNDS` | `20` | Cap on consecutive `wait` continuations per session. |
| `TELEGRAM_ANNOUNCE_START` | `1` | Set `0` to skip the session-start message. |
| `TELEGRAM_SILENT` | `false` | `true` sends without a push notification. |
| `TELEGRAM_LOCAL_TOO` | `0` | `1` also runs in local sessions (default: cloud only, via `CLAUDE_CODE_REMOTE`). |
| `TELEGRAM_API_BASE` | `https://api.telegram.org` | Override for testing against a mock. |

## Limitations

- **One chat per session.** Every session pointed at the same chat sends there,
  and `wait` accepts any reply from that chat. Messages are tagged
  `[repo#session]` so you can tell them apart, but for parallel sessions use a
  separate chat (or a separate bot) per session.
- **Permission prompts can be seen, not answered.** The Notification hook tells
  you Claude is blocked; approving still needs the web or mobile UI, or an
  `auto`/`dontAsk` permission mode on the session.
- **Sessions expire.** After enough idle time the VM is reclaimed and
  `claude -p --cloud` starts failing; the relay reports that back to the chat.
- **Plain text only.** No `parse_mode`, so nothing in a message needs escaping;
  messages are truncated at ~3500 characters.
- **Hooks run everywhere.** These are project settings, so they'd fire in local
  sessions too — the `CLAUDE_CODE_REMOTE` check keeps them cloud-only unless you
  set `TELEGRAM_LOCAL_TOO=1`.
