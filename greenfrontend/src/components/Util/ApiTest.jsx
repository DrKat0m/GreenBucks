// Test component to verify API connection
import { useState } from 'react';
import { healthAPI } from '../../lib/api';
import { Button } from '../UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';

export default function ApiTest() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await healthAPI.check();
      setStatus(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        {status && (
          <div className="p-3 bg-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">✅ Backend Connected!</p>
            <pre className="text-xs mt-2 text-green-300">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">❌ Connection Failed</p>
            <p className="text-xs mt-1 text-red-300">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
