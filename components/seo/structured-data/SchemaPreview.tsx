import { motion } from 'framer-motion';
import { CheckCircle2, Code, Copy, Download } from 'lucide-react';

interface SchemaPreviewLabels {
  generated: string;
  copy: string;
  download: string;
  validationSuccess: string;
}

interface SchemaPreviewProps {
  showPreview: boolean;
  schema: Record<string, unknown>;
  labels: SchemaPreviewLabels;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

export const SchemaPreview: React.FC<SchemaPreviewProps> = ({
  showPreview,
  schema,
  labels,
  onCopy,
  onDownload,
  copied
}) => {
  if (!showPreview) return null;

  const validateSchema = (): boolean => {
    try {
      JSON.stringify(schema);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-green-500" />
          {labels.generated}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? '✓' : labels.copy}
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {labels.download}
          </button>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
          <script type="application/ld+json">
            {JSON.stringify(schema, null, 2)}
          </script>
        </pre>
      </div>

      {validateSchema() && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          {labels.validationSuccess}
        </div>
      )}
    </motion.div>
  );
};
