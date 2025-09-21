from __future__ import annotations

from typing import Iterable, Optional

# Category keyword -> kgCO2e per USD (sector-level defaults) - Balanced for 0-30 range
CATEGORY_KG_CO2E_PER_USD: dict[str, float] = {
    # Very low (Eco++ items: 9-10 score)
    "public transit": 0.04,
    "rail": 0.05,
    "bicycle": 0.02,
    "organic": 0.05,
    # Low (Eco+ items: 7-8 score)
    "electric charging": 0.08,
    "groceries": 0.25,
    "coffee shop": 0.25,
    # Mid (Neutral items: 5-6 score)
    "restaurant": 0.35,
    "delivery": 0.45,
    "utilities": 0.35,
    "electric": 0.35,
    "fast food": 0.40,
    # High (Less-Eco items: 3-4 score)
    "ride share": 0.80,  # Reduced from 1.20
    "gas": 1.00,         # Reduced from 1.50
    # Very High (Non-Eco items: 0-2 score)
    "air": 1.50,         # Reduced from 2.50
}

# Name keyword -> kgCO2e per USD (item-level hints) - Capped for reasonable values
NAME_KG_CO2E_PER_USD = [
    # Very eco-friendly (Eco++)
    ("organic", 0.05),
    ("kale", 0.06),
    ("banana", 0.08),
    ("amtrak", 0.05),
    ("bicycle", 0.02),
    ("metro", 0.04),
    ("subway", 0.04),
    ("mta", 0.04),
    ("electric", 0.08),
    
    # Eco-friendly (Eco+)
    ("coffee", 0.25),
    ("starbucks", 0.28),
    ("whole foods", 0.20),
    ("trader joe", 0.22),
    ("farmers market", 0.15),
    ("grocery", 0.30),
    ("market", 0.30),
    
    # Neutral
    ("rice", 0.4),
    ("bread", 0.3),
    ("salad", 0.2),
    ("restaurant", 0.35),
    ("target", 0.50),
    ("walmart", 0.50),
    ("costco", 0.45),
    ("amazon", 0.50),
    
    # Less eco-friendly
    ("beef", 1.2),      # Reduced from 5.0 to 1.2
    ("chicken", 0.8),   # Reduced from 1.8 to 0.8
    ("pork", 1.0),      # Reduced from 3.0 to 1.0
    ("shell", 1.00),    # Gas stations
    ("chevron", 1.00),
    ("exxon", 1.00),
    ("bp", 1.00),
    ("uber", 0.80),     # Ride share
    ("lyft", 0.80),
    ("mcdonald", 0.40),
    ("kfc", 0.40),
    ("burger king", 0.40),
    
    # Non-eco (highest impact)
    ("united airlines", 1.50),
    ("american airlines", 1.50),
    ("delta", 1.50),
    ("southwest", 1.50),
    ("jetblue", 1.50),
]

DEFAULT_KG_CO2E_PER_USD = 0.50

# Maximum CO2 per item to prevent unrealistic values
MAX_CO2E_PER_ITEM = 30.0


def lookup_kg_co2e_per_usd(name: str, categories: Optional[Iterable[str]] = None) -> float:
    """Return a best-effort kgCO2e per USD based on categories or name keywords.

    Categories, if present, take precedence to ensure sector separation (e.g., transit vs ride share).
    """
    cats = {c.lower() for c in (categories or [])}
    for cat_key, val in CATEGORY_KG_CO2E_PER_USD.items():
        # Match exact token in categories set
        if cat_key in cats:
            return val

    # Fall back to name-based hints
    n = (name or "").lower()
    for key, val in NAME_KG_CO2E_PER_USD:
        if key in n:
            return val

    return DEFAULT_KG_CO2E_PER_USD
