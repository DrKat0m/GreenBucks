// Receipt upload component with OCR integration
import { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './Button';
import { receiptsAPI } from '../../lib/api';

export default function ReceiptUpload({ selectedTransactionId, onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      onUploadError?.('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      onUploadError?.('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await receiptsAPI.upload(file, selectedTransactionId);
      setResult({
        success: true,
        data: response
      });
      onUploadSuccess?.(response);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Upload failed';
      setResult({
        success: false,
        error: errorMessage
      });
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Selection */}
      <div className="space-y-2">
        <label className="text-sm text-white/70">Receipt image</label>
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
            <Upload size={16} className="mr-2" />
            <span>Choose file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <span className="text-sm text-white/60">
            {file ? file.name : 'No file chosen'}
          </span>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <label className="text-sm text-white/70">Preview</label>
          <div className="relative max-w-xs">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full h-auto max-h-48 object-contain rounded-lg border border-white/10"
            />
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <XCircle size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && !result && (
        <Button
          onClick={handleUpload}
          disabled={uploading || !selectedTransactionId}
          className="w-full max-w-md"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Processing Receipt...
            </>
          ) : (
            <>
              <FileImage size={16} className="mr-2" />
              Scan Receipt with OCR
            </>
          )}
        </Button>
      )}

      {!selectedTransactionId && file && (
        <p className="text-sm text-amber-400">
          Please select a transaction to attach this receipt to.
        </p>
      )}

      {/* Results */}
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-red-500/20 border-red-500/30'
        }`}>
          {result.success ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400 font-medium">Receipt processed successfully!</span>
              </div>
              
              {result.data.parsed_data && (
                <div className="text-sm space-y-1">
                  {result.data.parsed_data.merchant && (
                    <p><span className="text-white/60">Merchant:</span> {result.data.parsed_data.merchant}</p>
                  )}
                  {result.data.parsed_data.total && (
                    <p><span className="text-white/60">Total:</span> ${result.data.parsed_data.total}</p>
                  )}
                  {result.data.parsed_data.date && (
                    <p><span className="text-white/60">Date:</span> {result.data.parsed_data.date}</p>
                  )}
                  {result.data.parsed_data.items && result.data.parsed_data.items.length > 0 && (
                    <div>
                      <p className="text-white/60">Items:</p>
                      <ul className="ml-4 text-xs space-y-1">
                        {result.data.parsed_data.items.slice(0, 5).map((item, idx) => (
                          <li key={idx}>• {item.name} - ${item.price}</li>
                        ))}
                        {result.data.parsed_data.items.length > 5 && (
                          <li className="text-white/40">... and {result.data.parsed_data.items.length - 5} more items</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant="secondary"
                size="sm"
                onClick={resetUpload}
                className="mt-2"
              >
                Upload Another Receipt
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-400" />
                <span className="text-red-400 font-medium">Upload failed</span>
              </div>
              <p className="text-sm text-red-300">{result.error}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={resetUpload}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
