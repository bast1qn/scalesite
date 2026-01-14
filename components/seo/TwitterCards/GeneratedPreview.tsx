// ============================================
// TWITTER CARDS - GENERATED PREVIEW
// ============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Download } from 'lucide-react';
import { copyTagsToClipboard, downloadTagsAsHtml } from '../utils';

interface GeneratedPreviewProps {
  generateTags: () => string[];
  showPreview: boolean;
  labels: {
    generated: string;
    copyBtn: string;
    downloadBtn: string;
  };
}

export const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({
  generateTags,
  showPreview,
  labels,
}) => {
  const [copied, setCopied] = useState(false);

  // MEMORY LEAK FIX: Proper cleanup for setTimeout
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    const tags = generateTags();
    copyTagsToClipboard(tags);
    setCopied(true);
  };

  const handleDownload = () => {
    const tags = generateTags();
    downloadTagsAsHtml(tags, 'twitter-cards.html');
  };

  return (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {labels.generated}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? '✓' : labels.copyBtn}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {labels.downloadBtn}
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {generateTags().map((tag, index) => (
                <div key={index} className="mb-1">
                  {tag}
                </div>
              ))}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
