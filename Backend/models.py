import psycopg2
from typing import Optional, Tuple
from config import Config


def get_conn():
    """Open a fresh DB connection using values from Config.

    We open a connection when needed to keep things simple.
    """
    return psycopg2.connect(**Config.db_dsn())


def user_by_username(username: str) -> Optional[Tuple[int, str, str]]:
    """Return (id, username, password_hash) for a username, or None."""
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT id, username, password FROM users WHERE username = %s;",
            (username,),
        )
        return cur.fetchone()


def username_exists(username: str) -> bool:
    """Check if a username is already taken."""
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT 1 FROM users WHERE username = %s;", (username,))
        return cur.fetchone() is not None
