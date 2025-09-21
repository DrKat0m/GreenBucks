from __future__ import annotations

from decimal import Decimal
from typing import Optional

MIXED_MERCHANTS = {"walmart", "target", "amazon", "costco"}


def is_mixed_merchant(merchant_name: Optional[str]) -> bool:
    if not merchant_name:
        return False
    m = merchant_name.lower()
    return any(x in m for x in MIXED_MERCHANTS)


def score_from_co2e_per_dollar(co2e_per_usd: float | None) -> int:
    """Map kgCO2e per $ to an integer eco score 0..10 with finer granularity.

    This scale is tuned to spread common spend-based footprints across more bins so
    ride share and gasoline trend to lower scores, while public transit trends higher.

    If None: neutral 5.
    """
    if co2e_per_usd is None:
        return 5
    x = max(0.0, float(co2e_per_usd))
    # Very low carbon per $ (excellent)
    if x <= 0.03:
        return 10
    if x <= 0.06:
        return 9
    if x <= 0.10:
        return 8
    if x <= 0.15:
        return 7
    if x <= 0.22:
        return 6
    if x <= 0.30:
        return 5
    if x <= 0.45:
        return 4
    if x <= 0.60:
        return 3
    if x <= 0.90:
        return 2
    if x <= 1.50:
        return 1
    return 0


def map_score_to_multiplier(score: int) -> float:
    """Map eco score 0..10 to bonus multiplier m in [0.15, 5.0].
    The base cashback (1%) is guaranteed; this returns only the bonus multiplier.
    Interpretation: total cashback = amount * (0.01 + 0.01 * bonus_m)
    For low scores, m approaches 0.15; for high, up to 5.0.
    """
    # Linear mapping with gentle curve: 0 -> 0.15, 5 -> ~1.0, 10 -> 5.0
    score = max(0, min(10, score))
    if score == 0:
        return 0.15
    # simple piecewise linear for now
    return 0.15 + (score / 10.0) * (5.0 - 0.15)


def compute_cashback(amount: Decimal | float, score: Optional[int]) -> Decimal:
    """Compute cashback USD. Base 1% guaranteed, plus eco bonus scaled by multiplier.
    If score is None: only base 1%.
    """
    amt = Decimal(str(amount))
    base = amt * Decimal("0.01")
    if score is None:
        return base.quantize(Decimal("0.01"))
    m = map_score_to_multiplier(score)
    bonus = amt * Decimal("0.01") * Decimal(str(m))
    total = base + bonus
    return total.quantize(Decimal("0.01"))


def quick_merchant_score(merchant_name: Optional[str], category: Optional[list[str]]) -> int:
    """Enhanced heuristic score using CO2-based logic for realistic eco-scoring.
    
    Uses the same CO2 per dollar factors as receipt items to ensure consistency
    across all transactions, whether they have receipts or not.
    """
    from .integrations.item_category_map import lookup_kg_co2e_per_usd
    
    # Use the same CO2 lookup logic as receipt items
    co2e_per_usd = lookup_kg_co2e_per_usd(merchant_name or "", category)
    
    # Convert CO2 per USD to eco score using the same logic as receipt items
    return score_from_co2e_per_dollar(co2e_per_usd)
