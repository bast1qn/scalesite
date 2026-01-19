import { motion } from 'framer-motion';
import { Newspaper, Store, Building, FileJson } from '@/lib/icons';

type SchemaType = 'Article' | 'NewsArticle' | 'BlogPosting' | 'LocalBusiness' | 'Organization' | 'Product' | 'Person' | 'WebSite';

interface SchemaLabels {
  selectType: string;
  types: Record<SchemaType, string>;
}

interface SchemaTypeSelectorProps {
  schemaType: SchemaType;
  labels: SchemaLabels;
  onChange: (type: SchemaType) => void;
}

const getTypeIcon = (type: SchemaType) => {
  switch (type) {
    case 'Article':
    case 'NewsArticle':
    case 'BlogPosting':
      return <Newspaper className="w-5 h-5" />;
    case 'LocalBusiness':
      return <Store className="w-5 h-5" />;
    case 'Organization':
      return <Building className="w-5 h-5" />;
    default:
      return <FileJson className="w-5 h-5" />;
  }
};

export const SchemaTypeSelector: React.FC<SchemaTypeSelectorProps> = ({
  schemaType,
  labels,
  onChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-4">
        {labels.selectType}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(Object.keys(labels.types) as SchemaType[]).map((type) => (
          <motion.button
            key={type}
            onClick={() => onChange(type)}
            className={`p-4 min-h-[88px] rounded-lg border-2 text-left transition-all duration-200 ${
              schemaType === type
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            } focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon(type)}
              <span className="font-semibold text-white text-sm">{labels.types[type]}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
