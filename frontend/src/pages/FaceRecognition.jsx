import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import api from '../services/api';
import {
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [registering, setRegistering] = useState(false);
  const [imagePayload, setImagePayload] = useState(null);

  const captureAndRecognize = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      setImagePayload(imageSrc);
      const response = await api.post('/ml/recognize-face', {
        image_base64: imageSrc
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during face recognition');
    } finally {
      setLoading(false);
    }
  }, [webcamRef]);

  const registerCustomer = async () => {
    if (!newCustomerName.trim() || !imagePayload) return;
    setRegistering(true);
    try {
      await api.post("/ml/register-face", {
          name: newCustomerName,
          image_base64: imagePayload
      });

      setResult({
          status: "success",
          message: `${newCustomerName} registered successfully!`
      });

      setNewCustomerName("");

      // Automatically recognize again
      setTimeout(() => {
          captureAndRecognize();
      }, 1000);
      setNewCustomerName('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Face Recognition</h1>
        <p className="text-gray-400 mt-1">Scan customer faces at the entrance to personalize their experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webcam Area */}
        <div className="glass-panel p-6 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 w-full max-w-sm aspect-[4/3] bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="absolute inset-0 w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
            
            {/* Scanning Overlay Animation */}
            {loading && (
              <motion.div 
                initial={{ top: 0 }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_15px_#3b82f6] z-10"
              />
            )}
          </div>
          
          <button 
            onClick={captureAndRecognize}
            disabled={loading}
            className="btn-primary mt-6 w-full flex justify-center items-center py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" />}
            {loading ? 'Processing...' : 'Capture & Identify'}
          </button>
        </div>

        {/* Results Area */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-medium border-b border-white/10 pb-3 mb-4">Identification Result</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {!result && !error && !loading && (
              <div className="text-gray-500">
                <Camera size={48} className="mx-auto mb-4 opacity-20" />
                <p>Awaiting capture...</p>
              </div>
            )}

            {loading && (
              <div className="text-primary flex flex-col items-center">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="animate-pulse">Analyzing embeddings...</p>
              </div>
            )}

            {error && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-red-400">
                <XCircle size={48} className="mx-auto mb-4" />
                <p className="font-medium text-lg">{error}</p>
              </motion.div>
            )}

            {result && result.status === 'returning_customer' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-accent w-full">
                <CheckCircle size={56} className="mx-auto mb-4 text-accent drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
                <p className="text-xl text-primary font-medium mb-6">{result.customer.name}</p>
                
                <div className="bg-white/5 rounded-xl p-4 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Customer ID:</span>
                    <span className="font-mono text-sm">{result.customer.id.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Visits:</span>
                    <span className="font-bold text-white bg-primary/20 px-2 py-0.5 rounded">{result.customer.visit_count}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {result && result.status === 'new_customer' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-blue-400">
                <UserCircle size={56} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">New Customer</h2>
                <p className="text-gray-300 mb-6">{result.message}</p>
                <div className="flex flex-col space-y-3">
                  <input 
                    type="text" 
                    placeholder="Enter customer name" 
                    className="input-field" 
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                  />
                  <button 
                    onClick={registerCustomer}
                    disabled={registering || !newCustomerName}
                    className="bg-primary hover:bg-primary_hover disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors border border-primary/20 flex justify-center items-center"
                  >
                    {registering ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                    Register Customer
                  </button>
                </div>
              </motion.div>
            )}

            {result && result.status === 'success' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-green-400">
                <CheckCircle size={56} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Success</h2>
                <p className="text-gray-300">{result.message}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
