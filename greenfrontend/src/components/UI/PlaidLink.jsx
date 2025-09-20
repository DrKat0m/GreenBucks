// Bank connection component with mock bank selection
import { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';
import useStore from '../../lib/store';
import { useNavigate } from 'react-router-dom';

export default function PlaidLink({ onSuccess, onError }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bank: 'Capital One Bank',
    username: '',
    password: ''
  });
  const [status, setStatus] = useState(null);
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = () => {
    setShowForm(true);
    setFormData(prev => ({
      ...prev,
      username: user?.email || '',
      password: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Connecting to Capital One Bank...' });

    // Simulate connection delay
    setTimeout(() => {
      setStatus({ 
        type: 'success', 
        message: 'Successfully connected Capital One account XX398!' 
      });
      
      // Store connected account info
      localStorage.setItem('gb:connected-bank', JSON.stringify({
        bank: 'Capital One Bank',
        accountNumber: 'XX398',
        connectedAt: new Date().toISOString()
      }));

      onSuccess?.({ bank: 'Capital One Bank', accountNumber: 'XX398' });
      
      // Redirect to transactions after 1.5 seconds
      setTimeout(() => {
        navigate('/transactions');
      }, 1500);
      
      setLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      bank: 'Capital One Bank',
      username: '',
      password: ''
    });
    setStatus(null);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Selection */}
          <div>
            <Label>Select Bank Account</Label>
            <div className="relative">
              <select
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
                className="w-full rounded-lg bg-white/5 px-3 py-2 pr-8 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none"
              >
                <option value="Capital One Bank">Capital One Bank</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Username */}
          <div>
            <Label>Username</Label>
            <Input
              type="email"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username/email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-3 rounded-lg border text-sm ${
              status.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : status.type === 'error'
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            }`}>
              <div className="flex items-center gap-2">
                {status.type === 'success' && <CheckCircle size={16} />}
                {status.type === 'error' && <AlertCircle size={16} />}
                {status.type === 'info' && <Loader2 size={16} className="animate-spin" />}
                <span>{status.message}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CreditCard size={16} className="mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-white/60">
          <p className="text-white/40">Use the same credentials as your GreenBucks login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button
          onClick={handleConnect}
          disabled={loading || !user}
          className="flex-1"
        >
          <CreditCard size={16} className="mr-2" />
          Connect Bank Account
        </Button>

        <Button
          variant="secondary"
          onClick={handleConnect}
          disabled={loading || !user}
          className="flex-1"
        >
          <CreditCard size={16} className="mr-2" />
          Try Demo
        </Button>
      </div>

      <div className="text-xs text-white/60 space-y-1">
        <p>• <strong>Connect Bank Account:</strong> Link your Capital One account securely</p>
        <p>• <strong>Try Demo:</strong> Connect with demo credentials</p>
        <p className="text-white/40">Your banking credentials are never stored and are encrypted in transit.</p>
      </div>
    </div>
  );
}
