from typing import Dict, List


def _score_traits(answers: Dict) -> Dict[str, int]:
    """Lightweight, rule-based scoring from quiz answers to user traits.
    Expects answers keyed by question id (number or string), values are option indices 0..3.
    """
    def get(idx: int) -> int:
        return int(answers.get(str(idx)) or answers.get(idx) or 0)

    scores = {
        "analytical": 0,
        "coding": 0,
        "creative": 0,
        "management": 0,
        "business": 0,
    }

    # Q1: numbers/data → analytical
    scores["analytical"] += get(1)
    # Q3: building apps/websites → coding
    scores["coding"] += get(3)
    # Q2: creative work → creative
    scores["creative"] += get(2)
    # Q7: manage teams/projects → management
    scores["management"] += get(7)
    # Q6: business/product → business
    scores["business"] += get(6)

    # Q5: algorithmic problems → analytical + coding
    v5 = get(5)
    scores["analytical"] += v5
    scores["coding"] += v5

    return scores


def _roles_from_traits(scores: Dict[str, int]) -> List[str]:
    analytical = scores["analytical"]
    coding = scores["coding"]
    creative = scores["creative"]
    management = scores["management"]
    business = scores["business"]

    roles: List[str] = []

    if analytical >= 2 and coding >= 2:
        roles += ["Backend Developer", "Data Analyst", "Full Stack Developer"]
    if creative >= 2 and coding >= 1:
        roles += ["Frontend Developer", "UI/UX Designer"]
    if management >= 2 or business >= 2:
        roles += ["Product Manager"]
    if analytical >= 3 and business >= 1:
        roles += ["Data Engineer"]
    if coding >= 3:
        roles += ["DevOps Engineer"]

    if not roles:
        roles = ["Frontend Developer", "Backend Developer", "QA Engineer"]

    # Deduplicate while preserving order
    seen = set()
    deduped = []
    for r in roles:
        if r not in seen:
            deduped.append(r)
            seen.add(r)
    return deduped


def _salary_for_roles(roles: List[str]) -> Dict[str, str]:
    band = {
        "Frontend Developer": "₹5–10 LPA (fresher)",
        "Backend Developer": "₹6–12 LPA (fresher)",
        "Full Stack Developer": "₹6–12 LPA (fresher)",
        "Data Analyst": "₹5–9 LPA (fresher)",
        "Data Engineer": "₹7–14 LPA (fresher)",
        "DevOps Engineer": "₹7–13 LPA (fresher)",
        "Product Manager": "₹10–18 LPA (APM)",
        "UI/UX Designer": "₹5–9 LPA (fresher)",
        "QA Engineer": "₹4–8 LPA (fresher)",
    }
    return {r: band.get(r, "₹5–12 LPA (fresher)") for r in roles}


def _companies_for_roles(roles: List[str]) -> List[str]:
    company_map = {
        "Frontend Developer": ["Zoho", "Freshworks", "Razorpay"],
        "Backend Developer": ["TCS", "Infosys", "CRED"],
        "Full Stack Developer": ["Wipro", "Accenture", "Postman"],
        "Data Analyst": ["Mu Sigma", "Fractal", "Swiggy"],
        "Data Engineer": ["Flipkart", "Razorpay", "PhonePe"],
        "DevOps Engineer": ["Freshworks", "Zoho", "CRED"],
        "Product Manager": ["Flipkart", "Paytm", "Swiggy"],
        "UI/UX Designer": ["Freshworks", "Zomato", "Byju's"],
        "QA Engineer": ["Zoho", "TCS", "Freshworks"],
    }
    collected: List[str] = []
    for r in roles[:3]:
        collected += company_map.get(r, ["Zoho", "TCS", "Freshworks"])
    # Deduplicate and cap
    out: List[str] = []
    seen = set()
    for c in collected:
        if c not in seen:
            out.append(c)
            seen.add(c)
    return out[:6]


def _action_plan(roles: List[str]) -> List[str]:
    base = [
        "Complete 1 structured course for your top role",
        "Build 2 portfolio projects and publish on GitHub",
        "Prepare a targeted resume and apply to 10 roles/week",
    ]
    if "Data Analyst" in roles:
        base.append("Practice SQL and Excel daily; complete 50 LeetSQL questions")
    if "Backend Developer" in roles:
        base.append("Implement a REST API with auth and deploy it")
    if "Frontend Developer" in roles:
        base.append("Recreate 3 UI clones; learn accessibility basics")
    if "Product Manager" in roles:
        base.append("Write 2 PRDs and run mock user interviews")
    return base[:6]


def recommend(user: dict, answers: dict):
    scores = _score_traits(answers)
    roles = _roles_from_traits(scores)
    salary = _salary_for_roles(roles)
    companies = _companies_for_roles(roles)
    plan = _action_plan(roles)

    return {
        "careerRoles": roles,
        "expectedSalary": salary,
        "targetCompanies": companies,
        "actionPlan": plan,
    }