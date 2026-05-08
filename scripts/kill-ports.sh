#!/bin/sh
kill_port() {
  port=$1

  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti:"$port" 2>/dev/null)
    if [ -n "$pids" ]; then
      echo "$pids" | xargs kill -9 2>/dev/null && echo "Killed PID(s) $pids on port $port" || true
    fi
    return 0
  fi

  hex=$(printf "%04X" "$port")
  inode=$(awk -v p=":${hex}$" '$2 ~ p {print $10; exit}' /proc/net/tcp /proc/net/tcp6 2>/dev/null)
  [ -z "$inode" ] && return 0
  for fddir in /proc/[0-9]*/fd; do
    for fd in "$fddir"/*; do
      [ "$(readlink "$fd" 2>/dev/null)" = "socket:[${inode}]" ] || continue
      pid="${fddir%/fd}"
      pid="${pid##*/}"
      kill -9 "$pid" 2>/dev/null && echo "Killed PID $pid on port $port" || true
      return 0
    done
  done
}

kill_port 3001
kill_port 5173
echo 'ports cleared'
