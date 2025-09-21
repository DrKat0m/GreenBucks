#!/usr/bin/env python3
"""
Utility script to check transaction categories and their structure.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db.session import SessionLocal
from backend.app.models.plaid import Transaction
import json

def check_transaction_categories():
    """Check transaction categories and their structure"""
    
    db = SessionLocal()
    try:
        # Get all transactions
        transactions = db.query(Transaction).limit(20).all()
        
        print(f"Checking first 20 transactions for category structure...")
        print("=" * 80)
        
        category_types = {}
        null_categories = 0
        empty_categories = 0
        
        for i, tx in enumerate(transactions):
            category = tx.category
            category_type = type(category).__name__
            
            print(f"{i+1:2d}. {tx.merchant_name or tx.name[:30]:30} | Category: {category} | Type: {category_type}")
            
            # Count category types
            category_types[category_type] = category_types.get(category_type, 0) + 1
            
            if category is None:
                null_categories += 1
            elif category == [] or category == "[]" or (isinstance(category, list) and len(category) == 0):
                empty_categories += 1
        
        print("=" * 80)
        print(f"Category type distribution:")
        for cat_type, count in category_types.items():
            print(f"  {cat_type}: {count}")
        
        print(f"\nNull categories: {null_categories}")
        print(f"Empty categories: {empty_categories}")
        
        # Check for specific patterns
        print(f"\nLooking for transactions with problematic categories...")
        
        # Check for null categories
        null_txs = db.query(Transaction).filter(Transaction.category.is_(None)).count()
        print(f"Transactions with NULL category: {null_txs}")
        
        # Check for empty list categories
        empty_list_txs = db.query(Transaction).filter(Transaction.category == []).count()
        print(f"Transactions with empty list category: {empty_list_txs}")
        
        # Get total count
        total_txs = db.query(Transaction).count()
        print(f"Total transactions: {total_txs}")
        
        # Show some examples of different category types
        print(f"\nExamples of different category structures:")
        
        # Transactions with categories
        with_categories = db.query(Transaction).filter(
            Transaction.category.isnot(None)
        ).limit(5).all()
        
        for tx in with_categories:
            print(f"  {tx.merchant_name or tx.name}: {tx.category} (type: {type(tx.category).__name__})")
        
    except Exception as e:
        print(f"Error during check: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Checking transaction categories...")
    check_transaction_categories()
