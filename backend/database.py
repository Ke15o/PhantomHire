import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

from config import DATABASE_PATH, SEED_DATA_PATH


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / DATABASE_PATH
SEED_PATH = BASE_DIR / SEED_DATA_PATH


CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    company TEXT,
    description TEXT NOT NULL,
    date_posted TEXT,
    created_at TEXT NOT NULL
);
"""


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.execute(CREATE_TABLE_SQL)
        conn.commit()
    seed_if_empty()


def seed_if_empty() -> None:
    with get_connection() as conn:
        row = conn.execute("SELECT COUNT(*) AS count FROM jobs").fetchone()
        count = row["count"] if row else 0
        if count > 0:
            return

        if not SEED_PATH.exists():
            return

        try:
            jobs = json.loads(SEED_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return

        now = datetime.now(timezone.utc).isoformat()
        records = [
            (
                job.get("title"),
                job.get("company"),
                job["description"],
                job.get("date_posted"),
                now,
            )
            for job in jobs
            if job.get("description")
        ]
        if not records:
            return

        conn.executemany(
            """
            INSERT INTO jobs (title, company, description, date_posted, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            records,
        )
        conn.commit()


def fetch_historical_jobs() -> List[Dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT title, company, description, date_posted, created_at FROM jobs"
        ).fetchall()
    return [dict(row) for row in rows]


def insert_job(job: Dict) -> None:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO jobs (title, company, description, date_posted, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                job.get("title"),
                job.get("company"),
                job["description"],
                job.get("date_posted"),
                created_at,
            ),
        )
        conn.commit()
