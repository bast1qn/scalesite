import { motion } from '@/lib/motion';
import { CheckCircle2, Code, Copy, Download } from '@/lib/icons';

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
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h4 className="text-xl font-semibold leading-tight text-white flex items-center gap-3">
          <Code className="w-6 h-6 text-green-500" />
          {labels.generated}
        </h4>
        <div className="flex gap-3">
          <motion.button
            onClick={onCopy}
            className="px-5 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Copy className="w-4 h-4" />
            {copied ? '✓' : labels.copy}
          </motion.button>
          <motion.button
            onClick={onDownload}
            className="px-5 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-all duration-200 text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            {labels.download}
          </motion.button>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-6 overflow-x-auto max-h-96 overflow-y-auto border border-white/5">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
          <script type="application/ld+json">
            {JSON.stringify(schema, null, 2)}
          </script>
        </pre>
      </div>

      {validateSchema() && (
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {labels.validationSuccess}
        </div>
      )}
    </motion.div>
  );
};
