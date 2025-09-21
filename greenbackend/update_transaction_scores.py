#!/usr/bin/env python3
"""
Utility script to update eco-scores for all existing transactions
using the new CO2-based scoring system.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db.session import SessionLocal
from backend.app.models.plaid import Transaction
from backend.app.services.eco_scoring import quick_merchant_score, compute_cashback
from decimal import Decimal

def update_transaction_scores():
    """Update eco-scores for all existing transactions using new CO2-based logic"""
    
    db = SessionLocal()
    try:
        # Get all transactions
        transactions = db.query(Transaction).all()
        
        print(f"Found {len(transactions)} transactions to update...")
        
        updated_count = 0
        score_distribution = {}
        
        for tx in transactions:
            try:
                # Calculate new eco score using enhanced logic
                new_score = quick_merchant_score(tx.merchant_name, tx.category)
                
                # Calculate new cashback
                new_cashback = compute_cashback(tx.amount, new_score)
                
                # Update if values changed
                old_score = tx.eco_score
                old_cashback = tx.cashback_usd
                
                if old_score != new_score or (old_cashback != new_cashback if old_cashback else True):
                    print(f"Updating {tx.merchant_name or tx.name}: Score {old_score} -> {new_score}, Cashback ${old_cashback or 0:.2f} -> ${new_cashback:.2f}")
                    
                    tx.eco_score = new_score
                    tx.cashback_usd = new_cashback
                    
                    # Set needs_receipt based on merchant type
                    from backend.app.services.eco_scoring import is_mixed_merchant
                    tx.needs_receipt = is_mixed_merchant(tx.merchant_name)
                    
                    updated_count += 1
                
                # Track score distribution
                score_distribution[new_score] = score_distribution.get(new_score, 0) + 1
                
            except Exception as e:
                print(f"Error processing transaction {tx.id} ({tx.merchant_name or tx.name}): {e}")
                continue
        
        # Commit changes
        db.commit()
        print(f"Successfully updated {updated_count} transactions")
        
        # Show score distribution
        print(f"\nEco-Score Distribution:")
        for score in sorted(score_distribution.keys()):
            count = score_distribution[score]
            percentage = (count / len(transactions)) * 100
            eco_label = ""
            if score >= 9: eco_label = "Eco++"
            elif score >= 7: eco_label = "Eco+"
            elif score >= 5: eco_label = "Neutral"
            elif score >= 3: eco_label = "Less-Eco"
            else: eco_label = "Non-Eco"
            
            print(f"Score {score} ({eco_label}): {count} transactions ({percentage:.1f}%)")
        
        # Calculate total cashback
        total_cashback = sum(float(tx.cashback_usd or 0) for tx in transactions)
        print(f"\nTotal Cashback Available: ${total_cashback:.2f}")
        
    except Exception as e:
        print(f"Error during update: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Updating transaction eco-scores with new CO2-based logic...")
    update_transaction_scores()
