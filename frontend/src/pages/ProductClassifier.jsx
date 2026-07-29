import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductClassifier = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setResult(null); // reset
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!preview) return;
    
    setLoading(true);
    try {
      const response = await api.post('/ml/classify-product', {
        image_base64: preview
      });
      setResult(response.data);
    } catch (error) {
      console.error("Classification failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Product Image Classification</h1>
        <p className="text-gray-400 mt-1">Upload a product image to classify it using MobileNetV2.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium mb-4">Upload Image</h3>
          
          <div 
            className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors h-64"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {preview ? (
              <img src={preview} alt="Preview" className="h-full object-contain" />
            ) : (
              <>
                <Upload size={40} className="text-gray-500 mb-4" />
                <p className="text-gray-300 font-medium">Click to upload or drag & drop</p>
                <p className="text-gray-500 text-sm mt-1">JPG, PNG up to 5MB</p>
              </>
            )}
          </div>
          
          <button 
            onClick={classifyImage}
            disabled={!preview || loading}
            className="btn-primary w-full mt-6 py-3 disabled:opacity-50 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Classify Product'}
          </button>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium mb-4 border-b border-white/10 pb-3">Prediction Results</h3>
          
          {!result && !loading && (
             <div className="h-48 flex items-center justify-center text-gray-500 flex-col">
               <ImageIcon size={40} className="mb-2 opacity-30" />
               <p>Upload an image to see predictions</p>
             </div>
          )}

          {loading && (
             <div className="h-48 flex items-center justify-center text-primary">
               <Loader2 size={40} className="animate-spin" />
             </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-sm text-primary mb-1">Top Prediction</p>
                <h2 className="text-3xl font-bold text-white">{result.category}</h2>
                <p className="text-gray-400 text-sm mt-2">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-3">Top 3 Candidates</p>
                <div className="space-y-3">
                  {result.top_3.map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span>{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.confidence * 100}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full ${idx === 0 ? 'bg-primary' : 'bg-gray-400'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductClassifier;
