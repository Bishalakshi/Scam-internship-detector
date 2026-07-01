from redflags import RED_FLAGS, TOTAL_WEIGHT


def calculate_risk(answers: dict) -> dict:
    """
    answers: dict of {flag_id: value}, where value matches the type
    expected by the corresponding flag definition (bool or string).
    """
    triggered = []
    score = 0

    for flag in RED_FLAGS:
        user_answer = answers.get(flag["id"])
        if user_answer is None:
            continue  # unanswered questions simply don't contribute
        if user_answer == flag["scam_answer"]:
            score += flag["weight"]
            triggered.append(
                {
                    "id": flag["id"],
                    "question": flag["question"],
                    "weight": flag["weight"],
                    "advice": flag["advice"],
                }
            )

    risk_percent = round((score / TOTAL_WEIGHT) * 100, 1) if TOTAL_WEIGHT else 0.0

    if risk_percent >= 60:
        bucket = "High Risk"
    elif risk_percent >= 30:
        bucket = "Medium Risk"
    else:
        bucket = "Low Risk"

    # Sort triggered flags by weight, highest signal first
    triggered.sort(key=lambda f: f["weight"], reverse=True)

    summary = generate_summary(bucket, triggered)

    return {
        "risk_score": risk_percent,
        "risk_bucket": bucket,
        "triggered_flags": triggered,
        "summary": summary,
    }


def generate_summary(bucket: str, triggered: list) -> str:
    if not triggered:
        return "No major red flags detected. Still, always verify the company independently before sharing personal documents or making any payment."

    if bucket == "High Risk":
        return f"This offer shows {len(triggered)} known scam pattern(s), including some of the strongest indicators we track. We strongly recommend not paying any fee and verifying the company independently before proceeding."
    if bucket == "Medium Risk":
        return f"This offer shows {len(triggered)} warning sign(s). It may still be legitimate, but proceed carefully and verify the company before paying anything or sharing sensitive documents."
    return f"This offer shows {len(triggered)} minor warning sign(s). Risk appears low, but it's still worth a quick independent check on the company."