#!/usr/bin/env python3
"""
Utility script to delete transactions that have no category.
This will clean up the database by removing transactions without proper categorization.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db.session import SessionLocal
from backend.app.models.plaid import Transaction
from backend.app.models.receipt import ReceiptItem

def delete_no_category_transactions():
    """Delete transactions that have no category"""
    
    db = SessionLocal()
    try:
        # Find transactions with no category (null or empty)
        no_category_transactions = db.query(Transaction).filter(
            (Transaction.category.is_(None)) | 
            (Transaction.category == []) |
            (Transaction.category == "[]")
        ).all()
        
        print(f"Found {len(no_category_transactions)} transactions with no category...")
        
        if len(no_category_transactions) == 0:
            print("No transactions to delete.")
            return
        
        # Show some examples before deletion
        print("\nExamples of transactions to be deleted:")
        for i, tx in enumerate(no_category_transactions[:5]):
            print(f"  {i+1}. {tx.merchant_name or tx.name} - ${abs(float(tx.amount)):.2f} - {tx.date}")
        
        if len(no_category_transactions) > 5:
            print(f"  ... and {len(no_category_transactions) - 5} more")
        
        # Ask for confirmation
        response = input(f"\nDo you want to delete these {len(no_category_transactions)} transactions? (y/N): ")
        if response.lower() != 'y':
            print("Deletion cancelled.")
            return
        
        deleted_count = 0
        receipt_items_deleted = 0
        
        for tx in no_category_transactions:
            try:
                # First delete any associated receipt items
                receipt_items = db.query(ReceiptItem).filter(ReceiptItem.transaction_id == tx.id).all()
                for item in receipt_items:
                    db.delete(item)
                    receipt_items_deleted += 1
                
                # Then delete the transaction
                db.delete(tx)
                deleted_count += 1
                
                if deleted_count % 100 == 0:
                    print(f"Deleted {deleted_count} transactions so far...")
                
            except Exception as e:
                print(f"Error deleting transaction {tx.id}: {e}")
                continue
        
        # Commit all deletions
        db.commit()
        
        print(f"\nSuccessfully deleted:")
        print(f"  - {deleted_count} transactions")
        print(f"  - {receipt_items_deleted} associated receipt items")
        
        # Show remaining transaction count
        remaining_transactions = db.query(Transaction).count()
        print(f"\nRemaining transactions in database: {remaining_transactions}")
        
        # Show category distribution of remaining transactions
        transactions_with_categories = db.query(Transaction).filter(
            Transaction.category.isnot(None),
            Transaction.category != [],
            Transaction.category != "[]"
        ).all()
        
        print(f"Transactions with categories: {len(transactions_with_categories)}")
        
        # Show some category examples
        category_counts = {}
        for tx in transactions_with_categories[:100]:  # Sample first 100
            if tx.category and len(tx.category) > 0:
                main_category = tx.category[0] if isinstance(tx.category, list) else str(tx.category)
                category_counts[main_category] = category_counts.get(main_category, 0) + 1
        
        if category_counts:
            print(f"\nTop categories in remaining transactions:")
            for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"  - {category}: {count} transactions")
        
    except Exception as e:
        print(f"Error during deletion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Deleting transactions with no category...")
    delete_no_category_transactions()
