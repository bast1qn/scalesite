import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Send, Filter, Search, TrendingUp, Bug, Lightbulb } from 'lucide-react';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  type: 'bug' | 'feature' | 'improvement' | 'compliment';
  rating?: number;
  title: string;
  message: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'completed';
  createdAt: Date;
  category?: string;
}

const FeedbackCollection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'in-progress' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Feedback['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFeedbackModal, setShowNewFeedbackModal] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const savedFeedbacks = localStorage.getItem('userFeedbacks');
      if (savedFeedbacks) {
        const parsed = JSON.parse(savedFeedbacks) as Omit<Feedback, 'createdAt'>[];
        setFeedbacks(parsed.map((f) => ({
          ...f,
          createdAt: new Date(f.createdAt as string)
        })));
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackIcon = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return <Bug className="w-5 h-5" />;
      case 'feature': return <Lightbulb className="w-5 h-5" />;
      case 'improvement': return <TrendingUp className="w-5 h-5" />;
      case 'compliment': return <ThumbsUp className="w-5 h-5" />;
    }
  };

  const getFeedbackColor = (type: Feedback['type']) => {
    switch (type) {
      case 'bug': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'improvement': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'compliment': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'reviewed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesStatus = filter === 'all' || feedback.status === filter;
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    const matchesSearch = searchQuery === '' ||
      feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(f => f.status === 'new').length,
    inProgress: feedbacks.filter(f => f.status === 'in-progress').length,
    completed: feedbacks.filter(f => f.status === 'completed').length,
    avgRating: feedbacks.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / (feedbacks.filter(f => f.rating).length || 1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Feedback Collection</h1>
          <p className="text-gray-400">Collect and manage user feedback</p>
        </div>
        <button
          onClick={() => setShowNewFeedbackModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          <MessageSquare className="w-5 h-5" />
          Add Feedback
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
          <p className="text-blue-400 text-sm font-medium">New</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.new}</p>
        </div>
        <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30">
          <p className="text-amber-400 text-sm font-medium">In Progress</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
          <p className="text-green-400 text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.completed}</p>
        </div>
        <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-400 text-sm font-medium">Avg Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <p className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'new' | 'reviewed' | 'in-progress' | 'completed')}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | Feedback['type'])}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="improvement">Improvement</option>
            <option value="compliment">Compliment</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading feedback...</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No feedback found</p>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFeedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getFeedbackIcon(feedback.type)}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{feedback.title}</h3>
                        <p className="text-sm text-gray-400">By {feedback.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFeedbackColor(feedback.type)}`}>
                        {feedback.type.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                        {feedback.status.toUpperCase().replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{feedback.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {feedback.rating && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= feedback.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{feedback.createdAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{feedback.createdAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Feedback Modal */}
      <AnimatePresence>
        {showNewFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Add Feedback</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle feedback submission
                  setShowNewFeedbackModal(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement</option>
                    <option value="compliment">Compliment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Brief description of your feedback"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    placeholder="Detailed description..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating (Optional)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Star className="w-6 h-6 text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewFeedbackModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackCollection;
