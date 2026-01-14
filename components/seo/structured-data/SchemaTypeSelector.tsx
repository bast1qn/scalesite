import { Newspaper, Store, Building, FileJson } from 'lucide-react';

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
      <label className="block text-sm font-medium text-gray-300 mb-3">
        {labels.selectType}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(labels.types) as SchemaType[]).map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              schemaType === type
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon(type)}
              <span className="font-semibold text-white text-sm">{labels.types[type]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
