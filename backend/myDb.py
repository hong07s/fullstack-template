import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "database.db"

# 允许通过 db_update_application 修改的字段（白名单，防 SQL 注入）
APP_UPDATE_FIELDS = {"status", "approved_cents", "actual_cents", "title", "amount_cents"}


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Member'
        )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            budget_cents INTEGER NOT NULL,
            owner TEXT NOT NULL
        )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS application (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            applicant TEXT NOT NULL,
            title TEXT NOT NULL,
            amount_cents INTEGER NOT NULL,
            approved_cents INTEGER,
            actual_cents INTEGER,
            status TEXT NOT NULL DEFAULT 'DRAFT',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES project(id)
        )
        """)

        # 兼容旧库：缺 role 列时补上
        cols = [row[1] for row in conn.execute("PRAGMA table_info(user)")]
        if "role" not in cols:
            conn.execute(
                "ALTER TABLE user ADD COLUMN role TEXT NOT NULL DEFAULT 'Member'"
            )

        conn.commit()


# ---------- user ----------

def dbfind(username):
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM user WHERE username = ?", (username,)
        ).fetchone()


def dbadd(username, password, role="Member"):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO user (username, password, role) VALUES (?, ?, ?)",
            (username, password, role)
        )
        conn.commit()


# ---------- project ----------

def db_add_project(name, budget_cents, owner):
    """新建项目，返回新项目的 id。"""
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO project (name, budget_cents, owner) VALUES (?, ?, ?)",
            (name, budget_cents, owner)
        )
        conn.commit()
        return cur.lastrowid


def db_list_projects():
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM project ORDER BY id"
        ).fetchall()


def db_get_project(project_id):
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM project WHERE id = ?", (project_id,)
        ).fetchone()


def db_list_projects_by_owner(owner):
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM project WHERE owner = ? ORDER BY id", (owner,)
        ).fetchall()


# ---------- application ----------

def db_add_application(project_id, applicant, title, amount_cents, status="DRAFT"):
    """新建申请单，返回新申请的 id。"""
    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO application (project_id, applicant, title, amount_cents, status)
            VALUES (?, ?, ?, ?, ?)
            """,
            (project_id, applicant, title, amount_cents, status)
        )
        conn.commit()
        return cur.lastrowid


def db_get_application(app_id):
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM application WHERE id = ?", (app_id,)
        ).fetchone()


def db_list_applications(applicant=None, status=None, project_ids=None):
    """
    按条件查询申请单，条件都可省略。
    - applicant：只查某人提交的
    - status：只查某个状态，如 PENDING_L1
    - project_ids：只查这些项目里的（老师/财务按项目范围查看）
    """
    sql = "SELECT * FROM application WHERE 1 = 1"
    params = []

    if applicant is not None:
        sql += " AND applicant = ?"
        params.append(applicant)

    if status is not None:
        sql += " AND status = ?"
        params.append(status)

    if project_ids:
        placeholders = ", ".join("?" * len(project_ids))
        sql += f" AND project_id IN ({placeholders})"
        params.extend(project_ids)

    sql += " ORDER BY id DESC"

    with get_conn() as conn:
        return conn.execute(sql, params).fetchall()


def db_update_application(app_id, **fields):
    """
    修改申请单的部分字段，只接受 APP_UPDATE_FIELDS 里的字段。
    返回是否真的改到了行。
    """
    updates = {k: v for k, v in fields.items() if k in APP_UPDATE_FIELDS}
    if not updates:
        return False

    sets = ", ".join(f"{k} = ?" for k in updates)
    params = list(updates.values()) + [app_id]

    with get_conn() as conn:
        cur = conn.execute(
            f"UPDATE application SET {sets} WHERE id = ?", params
        )
        conn.commit()
        return cur.rowcount > 0
