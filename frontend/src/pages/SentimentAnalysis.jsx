import React, { useState } from 'react';
import api from '../services/api';
import { Send, Smile, Frown, Meh, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SentimentAnalysis = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/ml/analyze-sentiment', { review_text: text });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentDetails = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return { icon: <Smile size={64} className="text-green-400" />, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' };
      case 'negative':
        return { icon: <Frown size={64} className="text-red-400" />, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
      default:
        return { icon: <Meh size={64} className="text-gray-400" />, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Review Sentiment Analysis</h1>
        <p className="text-gray-400 mt-1">Analyze product reviews to determine customer satisfaction.</p>
      </div>

      <div className="glass-panel p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Review Text</label>
        <textarea
          className="input-field min-h-[120px] resize-y bg-black/20"
          placeholder="Paste a customer review here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={analyze} 
            disabled={!text.trim() || loading}
            className="btn-primary flex items-center px-6 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
            Analyze Sentiment
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`glass-panel p-8 flex flex-col items-center justify-center border ${getSentimentDetails(result.sentiment).bg}`}
        >
          {getSentimentDetails(result.sentiment).icon}
          
          <h2 className={`text-3xl font-bold mt-4 capitalize ${getSentimentDetails(result.sentiment).color}`}>
            {result.sentiment}
          </h2>
          
          <div className="mt-6 w-full max-w-sm">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Confidence Score</span>
              <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${result.sentiment === 'positive' ? 'bg-green-500' : result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
