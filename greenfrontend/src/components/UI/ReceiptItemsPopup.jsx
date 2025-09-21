// Receipt Items Popup - Shows parsed receipt items with eco-scores
import { useState } from 'react';
import { X, CheckCircle, Leaf, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export default function ReceiptItemsPopup({ 
  isOpen, 
  onClose, 
  receiptData, 
  selectedTransaction,
  onConfirmAttachment 
}) {
  const [isAttaching, setIsAttaching] = useState(false);

  if (!isOpen || !receiptData) return null;

  // Backend returns items_detailed with eco scores, not parsed_data
  const items = receiptData?.items_detailed || [];
  
  const transactionEcoScore = receiptData?.eco_score || 0;
  const cashbackAmount = receiptData?.cashback_usd || '0.00';
  const parsedItems = receiptData?.parsed_items || [];
  
  // Extract merchant and total from selected transaction since backend doesn't return this
  const merchant = selectedTransaction?.merchant || 'Unknown Merchant';
  const total = selectedTransaction ? Math.abs(selectedTransaction.amount).toFixed(2) : '0.00';
  const date = selectedTransaction ? new Date(selectedTransaction.date).toLocaleDateString() : 'Unknown Date';

  // Use transaction eco score from backend instead of calculating
  const overallEcoScore = transactionEcoScore.toFixed(1);

  // Use actual cashback from backend
  const estimatedCashback = parseFloat(cashbackAmount) || 0;

  const getEcoLabel = (ecoScore) => {
    if (!ecoScore) return { label: 'No Score', color: 'bg-gray-500/20 text-gray-400', icon: '❓' };
    if (ecoScore >= 9) return { label: 'Eco++', color: 'bg-emerald-500/20 text-emerald-400', icon: '🌟' };
    if (ecoScore >= 7) return { label: 'Eco+', color: 'bg-green-500/20 text-green-400', icon: '🌱' };
    if (ecoScore >= 5) return { label: 'Neutral', color: 'bg-yellow-500/20 text-yellow-400', icon: '⚖️' };
    if (ecoScore >= 3) return { label: 'Less-Eco', color: 'bg-orange-500/20 text-orange-400', icon: '⚠️' };
    return { label: 'Non-Eco', color: 'bg-red-500/20 text-red-400', icon: '❌' };
  };

  const handleConfirmAttachment = async () => {
    setIsAttaching(true);
    try {
      await onConfirmAttachment(receiptData, selectedTransaction);
      onClose();
    } catch (error) {
      console.error('Error attaching receipt:', error);
    } finally {
      setIsAttaching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Receipt Processed Successfully!</h2>
              <p className="text-sm text-white/60">Review parsed items and eco-scores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Receipt Summary */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{merchant}</div>
              <div className="text-sm text-white/60">Merchant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${total}</div>
              <div className="text-sm text-white/60">Total Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{overallEcoScore}/10</div>
              <div className="text-sm text-white/60">Avg Eco Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+${estimatedCashback.toFixed(2)}</div>
              <div className="text-sm text-white/60">Est. Cashback</div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Parsed Items ({items.length})
          </h3>
          
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => {
                const ecoInfo = getEcoLabel(item.item_score);
                const itemPrice = parseFloat(item.price) || 0;
                const itemCashback = itemPrice * (
                  item.item_score >= 9 ? 0.05 :
                  item.item_score >= 7 ? 0.03 :
                  item.item_score >= 5 ? 0.015 :
                  item.item_score >= 3 ? 0.01 : 0.005
                );

                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ecoInfo.color}`}>
                          <span>{ecoInfo.icon}</span>
                          <span>{ecoInfo.label}</span>
                        </span>
                        {item.item_score && (
                          <span className="text-xs text-white/60">
                            Score: {item.item_score}/10
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="font-semibold text-white">${itemPrice.toFixed(2)}</div>
                      <div className="text-xs text-green-400">+${itemCashback.toFixed(3)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items were parsed from this receipt</p>
            </div>
          )}
        </div>

        {/* Selected Transaction Info */}
        {selectedTransaction && (
          <div className="p-6 border-t border-white/10 bg-white/5">
            <h4 className="text-sm font-medium text-white/80 mb-2">Attached to Transaction:</h4>
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div>
                <div className="font-medium text-white">{selectedTransaction.merchant}</div>
                <div className="text-sm text-white/60">
                  {new Date(selectedTransaction.date).toLocaleDateString()} • ${Math.abs(selectedTransaction.amount).toFixed(2)}
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <div className="text-sm text-white/60">
            {items.length} items • ${total} total • {overallEcoScore}/10 avg eco score
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isAttaching}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAttachment}
              disabled={isAttaching || !selectedTransaction}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isAttaching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm & Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
