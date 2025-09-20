// src/routes/Transactions.jsx
import useStore from "../lib/store";
import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/UI/Card";
import { Button } from "../components/UI/Button";
import { Badge } from "../components/UI/Badge";
import ReceiptUpload from "../components/UI/ReceiptUpload";
import { Upload, CreditCard } from "lucide-react";

export default function Transactions() {
  const tx = useStore((s) => s.transactions) ?? [];
  const transactionsLoading = useStore((s) => s.transactionsLoading);
  const fetchTransactions = useStore((s) => s.fetchTransactions);
  const user = useStore((s) => s.user);
  const [selectedId, setSelectedId] = useState(tx[0]?.id);
  const [uploadMessage, setUploadMessage] = useState("");
  const [connectedBank, setConnectedBank] = useState(null);
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);

  // Fetch transactions when component mounts
  useEffect(() => {
    if (user && tx.length === 0 && !transactionsLoading) {
      fetchTransactions();
    }
  }, [user, fetchTransactions, tx.length, transactionsLoading]);

  // Update selected transaction when transactions load
  useEffect(() => {
    if (tx.length > 0 && !selectedId) {
      setSelectedId(tx[0].id);
    }
  }, [tx, selectedId]);

  // Check for connected bank account
  useEffect(() => {
    const bankInfo = localStorage.getItem('gb:connected-bank');
    if (bankInfo) {
      setConnectedBank(JSON.parse(bankInfo));
    }
  }, []);

  const selected = useMemo(
    () => tx.find((t) => t.id === selectedId),
    [tx, selectedId]
  );

  const handleUploadSuccess = (result) => {
    setUploadMessage("Receipt processed successfully! Transaction updated with OCR data.");
    // Refresh transactions to get updated data
    setTimeout(() => {
      fetchTransactions();
      setUploadMessage("");
    }, 2000);
  };

  const handleUploadError = (error) => {
    setUploadMessage(`Upload failed: ${error}`);
    setTimeout(() => setUploadMessage(""), 5000);
  };

  const handleTransactionClick = (transactionId) => {
    // Toggle expanded state - if clicking the same transaction, collapse it
    setExpandedTransactionId(expandedTransactionId === transactionId ? null : transactionId);
    // Also set as selected for receipt upload
    setSelectedId(transactionId);
  };

  return (
    <section
      id="transactions"
      className="scroll-mt-24 mx-auto w-full max-w-7xl px-6 pt-10 pb-16 lg:px-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="mt-1 text-white/60">
          Your recent purchases and eco tags.
        </p>
        
        {/* Connected Bank Account Display */}
        {connectedBank && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-green-400" />
              <span className="text-green-400 font-medium">
                Connected: {connectedBank.bank} account {connectedBank.accountNumber}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Transaction Table */}
      <div className="space-y-6">
        {/* Transaction Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-white/60">Total Transactions</div>
              <div className="text-2xl font-semibold">{tx.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-white/60">Total Spent</div>
              <div className="text-2xl font-semibold">
                ${tx.reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-white/60">Total Cashback</div>
              <div className="text-2xl font-semibold text-green-400">
                ${tx.reduce((sum, t) => sum + (t.cashback || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-white/60">Avg Eco Score</div>
              <div className="text-2xl font-semibold">
                {tx.length > 0 ? (tx.reduce((sum, t) => sum + (t.ecoScore || 0), 0) / tx.length).toFixed(1) : '0.0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Transaction Table */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <CardDescription>Detailed view of all your transactions with eco scoring</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-sm font-medium text-white/80">
              <div className="col-span-2">Date</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Eco Rating</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Cashback</div>
            </div>
            
            {/* Transaction Rows */}
            <div className="divide-y divide-white/10">
              {tx.map((t) => (
                <TransactionRow 
                  key={t.id} 
                  transaction={t} 
                  isSelected={selectedId === t.id}
                  isExpanded={expandedTransactionId === t.id}
                  onClick={() => handleTransactionClick(t.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Receipt Upload Section */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div></div> {/* Spacer */}

          {/* Right: uploader (constrained width, not full-bleed) */}
          <Card className="h-fit lg:sticky lg:top-24">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upload receipt</CardTitle>
              <CardDescription>
                JPG/PNG previewed here. OCR attaches the result to your selection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <label className="text-sm text-white/70">
                  Attach to transaction
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {tx.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.merchant} — {t.date} — ${Math.abs(t.amount).toFixed(2)}
                      {t.eco === null ? " (needs receipt)" : ""}
                    </option>
                  ))}
                </select>
                {selected && (
                  <p className="text-xs text-white/60">
                    Selected: <b>{selected.merchant}</b> ({selected.date})
                  </p>
                )}
              </div>

              {uploadMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  uploadMessage.includes('successfully') 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {uploadMessage}
                </div>
              )}

              <ReceiptUpload
                selectedTransactionId={selectedId}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Transaction Row Component
function TransactionRow({ transaction, isSelected, isExpanded, onClick }) {
  const getEcoLabel = (ecoScore, hasCategory) => {
    if (!ecoScore) {
      // If no eco score and no category, return null to omit the transaction
      if (!hasCategory) return null;
      // If has category but no eco score, show "receipt needed"
      return { label: 'Receipt needed for scoring', color: 'bg-amber-500/20 text-amber-400', icon: '📄' };
    }
    if (ecoScore >= 9) return { label: 'Eco++', color: 'bg-emerald-500/20 text-emerald-400', icon: '🌟' };
    if (ecoScore >= 7) return { label: 'Eco+', color: 'bg-green-500/20 text-green-400', icon: '🌱' };
    if (ecoScore >= 5) return { label: 'Neutral', color: 'bg-yellow-500/20 text-yellow-400', icon: '⚖️' };
    if (ecoScore >= 3) return { label: 'Less-Eco', color: 'bg-orange-500/20 text-orange-400', icon: '⚠️' };
    return { label: 'Non-Eco', color: 'bg-red-500/20 text-red-400', icon: '❌' };
  };

  const hasCategory = transaction.category && transaction.category.length > 0;
  const ecoInfo = getEcoLabel(transaction.ecoScore, hasCategory);
  
  // If ecoInfo is null, don't render this transaction (omit it)
  if (!ecoInfo) return null;
  
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div>
      <div 
        className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors ${
          isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
        }`}
        onClick={onClick}
      >
        {/* Date */}
        <div className="col-span-2 text-sm">
          <div className="font-medium">{formattedDate}</div>
        </div>

        {/* Description */}
        <div className="col-span-4">
          <div className="font-medium truncate">{transaction.merchant}</div>
          <div className="text-xs text-white/60 truncate">
            {transaction.category?.join(' • ') || 'No category'}
          </div>
        </div>

        {/* Eco Rating */}
        <div className="col-span-2">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ecoInfo.color}`}>
            <span>{ecoInfo.icon}</span>
            <span>{ecoInfo.label}</span>
          </div>
          {transaction.ecoScore && (
            <div className="text-xs text-white/60 mt-1">
              Score: {transaction.ecoScore}/10
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="col-span-2 text-right">
          <div className="font-semibold text-white">
            ${Math.abs(transaction.amount).toFixed(2)}
          </div>
        </div>

        {/* Cashback */}
        <div className="col-span-2 text-right">
          <div className="font-semibold text-green-400">
            +${(transaction.cashback || 0).toFixed(2)}
          </div>
          <div className="text-xs text-white/60 mt-1">
            {transaction.cashback > 0 ? (
              <>
                {((transaction.cashback / Math.abs(transaction.amount)) * 100).toFixed(1)}% rate
                <br />
                <span className="text-white/40">
                  {transaction.ecoScore >= 7 ? 'Eco bonus' : transaction.ecoScore >= 5 ? 'Base rate' : 'Low eco'}
                </span>
              </>
            ) : (
              transaction.needsReceipt ? (
                <span className="text-amber-400">Receipt needed</span>
              ) : (
                <span className="text-white/40">No cashback</span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Expanded Transaction Details */}
      {isExpanded && (
        <TransactionDetails transaction={transaction} />
      )}
    </div>
  );
}

// Calculate CO₂ footprint based on eco score and transaction amount
function calculateCO2Footprint(ecoScore, amount, items = []) {
  if (!ecoScore || !amount) return 0;
  
  // Base CO₂ calculation with proper boundaries aligned to eco rating tiers
  let co2PerDollar;
  
  if (ecoScore >= 9) {
    // Eco++ (9-10): Very low CO₂ footprint
    co2PerDollar = 0.05 + (10 - ecoScore) * 0.05; // 0.05-0.10 kg CO₂ per $
  } else if (ecoScore >= 7) {
    // Eco+ (7-8): Low CO₂ footprint  
    co2PerDollar = 0.15 + (8 - ecoScore) * 0.10; // 0.15-0.25 kg CO₂ per $
  } else if (ecoScore >= 5) {
    // Neutral (5-6): Medium CO₂ footprint
    co2PerDollar = 0.40 + (6 - ecoScore) * 0.15; // 0.40-0.55 kg CO₂ per $
  } else if (ecoScore >= 3) {
    // Less-Eco (3-4): High CO₂ footprint
    co2PerDollar = 0.80 + (4 - ecoScore) * 0.30; // 0.80-1.10 kg CO₂ per $
  } else {
    // Non-Eco (1-2): Very high CO₂ footprint
    co2PerDollar = 1.50 + (2 - ecoScore) * 0.50; // 1.50-2.00 kg CO₂ per $
  }
  
  const baseCO2 = Math.abs(amount) * co2PerDollar;
  
  // Add item-specific CO₂ if we have detailed items
  let itemCO2 = 0;
  if (items && items.length > 0) {
    itemCO2 = items.reduce((total, item) => {
      // Different item types have different CO₂ intensities
      const itemName = item.name.toLowerCase();
      let itemMultiplier = 1.0;
      
      // High CO₂ items
      if (/beef|steak|lamb|meat|burger/.test(itemName)) itemMultiplier = 2.5;
      else if (/chicken|pork|fish|seafood/.test(itemName)) itemMultiplier = 1.8;
      else if (/dairy|milk|cheese|yogurt/.test(itemName)) itemMultiplier = 1.4;
      // Low CO₂ items
      else if (/vegetable|fruit|bean|lentil|grain|rice/.test(itemName)) itemMultiplier = 0.3;
      else if (/organic|local|sustainable/.test(itemName)) itemMultiplier = 0.4;
      // Medium CO₂ items
      else if (/processed|packaged|frozen/.test(itemName)) itemMultiplier = 1.2;
      
      return total + (parseFloat(item.price) || 0) * co2PerDollar * itemMultiplier;
    }, 0);
    
    // Use item-specific calculation if available, otherwise use base
    return itemCO2 > 0 ? itemCO2 : baseCO2;
  }
  
  return baseCO2;
}

// Transaction Details Component
function TransactionDetails({ transaction }) {
  const co2Footprint = calculateCO2Footprint(
    transaction.ecoScore, 
    transaction.amount, 
    transaction.items
  );
  return (
    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white/90 border-b border-white/10 pb-2">Transaction Details</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Transaction ID:</span>
              <span className="font-mono text-white/90">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Date & Time:</span>
              <span className="text-white/90">
                {new Date(transaction.date).toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Merchant:</span>
              <span className="text-white/90">{transaction.merchant}</span>
            </div>
            
            {transaction.category && transaction.category.length > 0 && (
              <div className="flex justify-between">
                <span className="text-white/60">Category:</span>
                <span className="text-white/90">{transaction.category.join(' → ')}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-white/60">Amount:</span>
              <span className="text-white/90 font-semibold">${Math.abs(transaction.amount).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Cashback Earned:</span>
              <span className="text-green-400 font-semibold">+${(transaction.cashback || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Eco Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white/90 border-b border-white/10 pb-2">Environmental Impact</h4>
          
          <div className="space-y-3 text-sm">
            {transaction.ecoScore && (
              <>
                <div className="flex justify-between">
                  <span className="text-white/60">Eco Score:</span>
                  <span className="text-white/90 font-semibold">{transaction.ecoScore}/10</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">CO₂ Footprint:</span>
                  <span className={`font-semibold ${
                    co2Footprint > 15 ? 'text-red-400' : // Non-Eco/Less-Eco range
                    co2Footprint > 8 ? 'text-yellow-400' : // Neutral range  
                    'text-green-400' // Eco+/Eco++ range
                  }`}>
                    {co2Footprint.toFixed(2)} kg CO₂e
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Cashback Rate:</span>
                  <span className="text-white/90">{((transaction.cashback / Math.abs(transaction.amount)) * 100).toFixed(2)}%</span>
                </div>
                
                <div className="mt-2 p-2 bg-white/5 rounded text-xs">
                  <div className="text-white/70 font-medium mb-1">Cashback calculation:</div>
                  <div className="text-white/60 space-y-1">
                    <div>• Amount: ${Math.abs(transaction.amount).toFixed(2)}</div>
                    <div>• Eco Score: {transaction.ecoScore}/10 ({
                      transaction.ecoScore >= 9 ? 'Eco++' :
                      transaction.ecoScore >= 7 ? 'Eco+' :
                      transaction.ecoScore >= 5 ? 'Neutral' :
                      transaction.ecoScore >= 3 ? 'Less-eco' :
                      'Non-eco'
                    })</div>
                    <div>• Cashback earned: ${(transaction.cashback || 0).toFixed(2)}</div>
                    <div className="text-green-400 font-medium">
                      = {((transaction.cashback / Math.abs(transaction.amount)) * 100).toFixed(2)}% effective rate
                    </div>
                    <div className="text-white/50 text-xs mt-1">
                      Higher eco scores earn better rates
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {transaction.items && transaction.items.length > 0 && (
              <div>
                <span className="text-white/60 block mb-2">Items ({transaction.items.length}) with CO₂:</span>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {transaction.items.slice(0, 10).map((item, idx) => {
                    const itemName = item.name.toLowerCase();
                    let itemMultiplier = 1.0;
                    
                    // Same logic as in calculateCO2Footprint
                    if (/beef|steak|lamb|meat|burger/.test(itemName)) itemMultiplier = 2.5;
                    else if (/chicken|pork|fish|seafood/.test(itemName)) itemMultiplier = 1.8;
                    else if (/dairy|milk|cheese|yogurt/.test(itemName)) itemMultiplier = 1.4;
                    else if (/vegetable|fruit|bean|lentil|grain|rice/.test(itemName)) itemMultiplier = 0.3;
                    else if (/organic|local|sustainable/.test(itemName)) itemMultiplier = 0.4;
                    else if (/processed|packaged|frozen/.test(itemName)) itemMultiplier = 1.2;
                    
                    // Use the same tiered CO₂ calculation as the main function
                    const ecoScore = transaction.ecoScore || 5;
                    let co2PerDollar;
                    
                    if (ecoScore >= 9) {
                      co2PerDollar = 0.05 + (10 - ecoScore) * 0.05;
                    } else if (ecoScore >= 7) {
                      co2PerDollar = 0.15 + (8 - ecoScore) * 0.10;
                    } else if (ecoScore >= 5) {
                      co2PerDollar = 0.40 + (6 - ecoScore) * 0.15;
                    } else if (ecoScore >= 3) {
                      co2PerDollar = 0.80 + (4 - ecoScore) * 0.30;
                    } else {
                      co2PerDollar = 1.50 + (2 - ecoScore) * 0.50;
                    }
                    
                    const itemCO2 = (parseFloat(item.price) || 0) * co2PerDollar * itemMultiplier;
                    
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs bg-white/5 px-2 py-1 rounded">
                        <span className="text-white/80 truncate flex-1">{item.name}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-white/60">${item.price}</span>
                          <span className={`text-xs px-1 rounded ${
                            itemCO2 > 1 ? 'bg-red-500/20 text-red-400' : 
                            itemCO2 > 0.5 ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {itemCO2.toFixed(2)}kg
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {transaction.items.length > 10 && (
                    <div className="text-xs text-white/40 text-center py-1">
                      ... and {transaction.items.length - 10} more items
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {transaction.receipt && (
              <div>
                <span className="text-white/60 block mb-2">Receipt Info:</span>
                <div className="text-xs bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  <div className="text-green-400">✓ Receipt processed</div>
                  <div className="text-white/60 mt-1">
                    Uploaded: {new Date(transaction.receipt.attachedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      {(transaction.description || transaction.notes) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="font-semibold text-white/90 mb-2">Additional Information</h4>
          {transaction.description && (
            <p className="text-sm text-white/70 mb-2">{transaction.description}</p>
          )}
          {transaction.notes && (
            <p className="text-xs text-white/60 italic">{transaction.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
