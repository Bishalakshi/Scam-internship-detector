import sqlite3
from contextlib import contextmanager
from datetime import datetime
from typing import Optional, Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from redflags import RED_FLAGS
from scoring import calculate_risk

DB_PATH = "reports.db"

app = FastAPI(title="Scam Internship Risk Checker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT NOT NULL,
                risk_score REAL NOT NULL,
                risk_bucket TEXT NOT NULL,
                verdict TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


init_db()


@app.get("/questions")
def get_questions():
    # Strip internal scoring details (scam_answer, weight) that shouldn't
    # leak to the frontend quiz UI, since exposing them would let someone
    # game the score.
    return [
        {"id": f["id"], "question": f["question"], "type": f["type"], "options": f.get("options")}
        for f in RED_FLAGS
    ]


class AssessRequest(BaseModel):
    answers: dict[str, Union[bool, str]]
    company_name: Optional[str] = None


@app.post("/assess")
def assess(req: AssessRequest):
    result = calculate_risk(req.answers)

    # Optionally log this as a crowdsourced report if a company name was given
    if req.company_name:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO reports (company_name, risk_score, risk_bucket, verdict, created_at) VALUES (?, ?, ?, ?, ?)",
                (
                    req.company_name.strip().lower(),
                    result["risk_score"],
                    result["risk_bucket"],
                    result["risk_bucket"],
                    datetime.utcnow().isoformat(),
                ),
            )
            conn.commit()

    return result


@app.get("/company/{name}")
def get_company_reports(name: str):
    with get_db() as conn:
        cursor = conn.execute(
            "SELECT risk_score, risk_bucket, created_at FROM reports WHERE company_name = ? ORDER BY created_at DESC",
            (name.strip().lower(),),
        )
        rows = cursor.fetchall()

    if not rows:
        return {"company_name": name, "report_count": 0, "reports": []}

    avg_score = round(sum(r[0] for r in rows) / len(rows), 1)
    return {
        "company_name": name,
        "report_count": len(rows),
        "average_risk_score": avg_score,
        "reports": [{"risk_score": r[0], "risk_bucket": r[1], "created_at": r[2]} for r in rows],
    }


@app.get("/")
def root():
    return {"status": "ok", "service": "scam-internship-risk-checker"}