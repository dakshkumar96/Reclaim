import psycopg2
from typing import Optional, Tuple
from config import Config


def get_conn():
    """Open a fresh DB connection using values from Config.

    We open a connection when needed to keep things simple.
    """
    return psycopg2.connect(**Config.db_dsn())
