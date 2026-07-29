import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Smile, Frown, Meh, Loader2 } from 'lucide-react';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/dashboard/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const getSentimentBadge = (sentiment) => {
    switch(sentiment) {
      case 'positive': return <span className="flex items-center text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs"><Smile size={14} className="mr-1"/> Positive</span>;
      case 'negative': return <span className="flex items-center text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs"><Frown size={14} className="mr-1"/> Negative</span>;
      default: return <span className="flex items-center text-gray-400 bg-gray-400/10 px-2 py-1 rounded text-xs"><Meh size={14} className="mr-1"/> Neutral</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Sentiments</h1>
        <p className="text-gray-400">View customer feedback and AI-analyzed sentiment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
           <div className="col-span-full flex justify-center py-10"><Loader2 size={40} className="animate-spin text-primary" /></div>
        ) : reviews.length > 0 ? reviews.map(r => (
          <div key={r.id} className="glass-panel p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                {getSentimentBadge(r.sentiment)}
                <span className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-200 line-clamp-4 leading-relaxed text-sm">"{r.text}"</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
              <span>Confidence: {(r.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-8 text-center text-gray-500 glass-panel">No reviews recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
