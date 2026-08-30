#!/usr/bin/env bash
#
# Nightly PostgreSQL backup script.
#
# Usage:
#   ./backup_db.sh <PG_URL> [backup_dir]
#
# Dumps the database at PG_URL to backup_dir (default: ./backups relative
# to this script), gzip-compressed and timestamped. Deletes backups older
# than RETENTION_DAYS (default 14).
#
# Cron example (runs nightly at 2:30am):
#   30 2 * * * /path/to/backend/scripts/backup_db.sh 'postgres://user:pass@host:5432/db' >> /var/log/betriebsradar_backup.log 2>&1

set -euo pipefail

PG_URL="${1:?Usage: $0 <PG_URL> [backup_dir]}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${2:-$SCRIPT_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

if ! command -v pg_dump &>/dev/null; then
    echo "Error: pg_dump not found in PATH" >&2
    exit 1
fi

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUT_FILE="$BACKUP_DIR/betriebsradar_${TIMESTAMP}.sql.gz"
TMP_FILE="${OUT_FILE}.tmp"

echo "[$(date -Iseconds)] Starting backup to $OUT_FILE"

if pg_dump "$PG_URL" | gzip > "$TMP_FILE"; then
    mv "$TMP_FILE" "$OUT_FILE"
    echo "[$(date -Iseconds)] Backup completed: $OUT_FILE ($(du -h "$OUT_FILE" | cut -f1))"
else
    rm -f "$TMP_FILE"
    echo "[$(date -Iseconds)] Backup failed" >&2
    exit 1
fi

echo "[$(date -Iseconds)] Pruning backups older than ${RETENTION_DAYS} days"
find "$BACKUP_DIR" -name 'betriebsradar_*.sql.gz' -mtime "+${RETENTION_DAYS}" -print -delete
