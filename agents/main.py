import os
import asyncio
import logging
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from crew import run_verification_crew

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Verified News Agent Sidecar", version="1.0.0")

SIDECAR_SECRET = os.getenv("PYTHON_SIDECAR_SECRET", "")


class VerificationRequest(BaseModel):
    claim_id: str
    claim_text: str
    track_context: str = "consumer"


@app.get("/health")
def health():
    return {"status": "ok", "model": os.getenv("AIMLAPI_MODEL_ID")}


@app.post("/verify")
async def verify(
    req: VerificationRequest,
    x_sidecar_secret: str = Header(None)
):
    if x_sidecar_secret != SIDECAR_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorised")

    logger.info(f"Starting verification for claim {req.claim_id}")

    asyncio.create_task(
        asyncio.to_thread(run_verification_crew, req.claim_id, req.claim_text, req.track_context)
    )

    return {"status": "accepted", "claim_id": req.claim_id}
