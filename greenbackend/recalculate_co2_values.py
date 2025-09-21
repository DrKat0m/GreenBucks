#!/usr/bin/env python3
"""
Utility script to recalculate CO2 values for existing receipt items
to ensure they're within the 0-30 range with the new capping logic.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db.session import SessionLocal
from backend.app.models.receipt import ReceiptItem
from backend.app.services.integrations.climatiq_client import estimate_item_footprint
from backend.app.services.eco_scoring import score_from_co2e_per_dollar
from decimal import Decimal
import asyncio

async def recalculate_co2_values():
    """Recalculate CO2 values for all existing receipt items"""
    
    db = SessionLocal()
    try:
        # Get all receipt items
        items = db.query(ReceiptItem).all()
        
        print(f"Found {len(items)} receipt items to recalculate...")
        
        updated_count = 0
        
        for item in items:
            if item.name and item.price:
                try:
                    # Recalculate CO2 footprint with new capping logic
                    kg_co2e, source, factor_id = await estimate_item_footprint(
                        item.name, 
                        float(item.price), 
                        item.qty
                    )
                    
                    # Recalculate eco score
                    co2_per_dollar = kg_co2e / float(item.price) if float(item.price) > 0 else 0
                    new_score = score_from_co2e_per_dollar(co2_per_dollar)
                    
                    # Update if values changed significantly
                    old_co2e = float(item.kg_co2e) if item.kg_co2e else 0
                    
                    if abs(old_co2e - kg_co2e) > 0.1 or item.item_score != new_score:
                        print(f"Updating {item.name}: CO2 {old_co2e:.2f} -> {kg_co2e:.2f}, Score {item.item_score} -> {new_score}")
                        
                        item.kg_co2e = Decimal(str(kg_co2e))
                        item.item_score = new_score
                        updated_count += 1
                
                except Exception as e:
                    print(f"Error processing item {item.name}: {e}")
                    continue
        
        # Commit changes
        db.commit()
        print(f"Successfully updated {updated_count} receipt items")
        
        # Show some statistics
        items_after = db.query(ReceiptItem).all()
        co2_values = [float(item.kg_co2e) for item in items_after if item.kg_co2e]
        
        if co2_values:
            print(f"\nCO2 Statistics after update:")
            print(f"Min CO2: {min(co2_values):.2f} kg")
            print(f"Max CO2: {max(co2_values):.2f} kg")
            print(f"Avg CO2: {sum(co2_values)/len(co2_values):.2f} kg")
            print(f"Items over 30kg: {len([v for v in co2_values if v > 30])}")
        
    except Exception as e:
        print(f"Error during recalculation: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Recalculating CO2 values with new capping logic...")
    asyncio.run(recalculate_co2_values())
