// React imports
import { useState } from 'react';

// External imports
import { AnimatePresence, motion } from '@/lib/motion';
import { Eye } from '@/lib/icons';

// Internal imports - Components
import { SchemaFormFields } from './structured-data/SchemaFormFields';
import { SchemaPreview } from './structured-data/SchemaPreview';
import { SchemaTypeSelector } from './structured-data/SchemaTypeSelector';

// Internal imports - Utilities
import { generateSchema } from './structured-data/SchemaGenerator';

// Internal imports - Translations
import { schemaTranslations } from './structured-data/SchemaTranslations';

type SchemaType = 'Article' | 'NewsArticle' | 'BlogPosting' | 'LocalBusiness' | 'Organization' | 'Product' | 'Person' | 'WebSite';

// ✅ FIXED: Proper type definition for form data
interface SchemaFormData {
  // Article/NewsArticle/BlogPosting
  headline?: string;
  image?: string;
  author?: string;
  publisher?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  description?: string;

  // LocalBusiness
  name?: string;
  address?: string;
  telephone?: string;
  email?: string;
  openingHours?: string;
  priceRange?: string;
  geoLatitude?: string;
  geoLongitude?: string;

  // Organization
  legalName?: string;
  url?: string;
  logo?: string;
  foundingDate?: string;
  numberOfEmployees?: string;
  addressOrg?: string;

  // Product
  productName?: string;
  productImage?: string;
  productDescription?: string;
  brand?: string;
  offersPrice?: string;
  offersCurrency?: string;
  offersAvailability?: string;
  offersUrl?: string;

  // Person
  personName?: string;
  personImage?: string;
  personJobTitle?: string;
  personUrl?: string;
  personWorksFor?: string;
  personEmail?: string;
  personTelephone?: string;
  personAddress?: string;

  // WebSite
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
  searchActionUrl?: string;
  searchActionTarget?: string;
}

interface StructuredDataProps {
  language?: 'de' | 'en';
  initialData?: SchemaFormData;
  onDataChange?: (data: SchemaFormData) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [formData, setFormData] = useState<SchemaFormData>({
    // Article/NewsArticle/BlogPosting
    headline: '',
    image: '',
    author: '',
    publisher: '',
    datePublished: '',
    dateModified: '',
    articleSection: '',
    description: '',

    // LocalBusiness
    name: '',
    address: '',
    telephone: '',
    email: '',
    openingHours: '',
    priceRange: '',
    geoLatitude: '',
    geoLongitude: '',

    // Organization
    legalName: '',
    url: '',
    logo: '',
    foundingDate: '',
    numberOfEmployees: '',
    addressOrg: '',

    // Product
    productName: '',
    productImage: '',
    productDescription: '',
    brand: '',
    offersPrice: '',
    offersCurrency: 'EUR',
    offersAvailability: '',
    offersUrl: '',

    // Person
    personName: '',
    personImage: '',
    personJobTitle: '',
    personUrl: '',
    personWorksFor: '',
    personEmail: '',
    personTelephone: '',
    personAddress: '',

    // WebSite
    siteName: '',
    siteUrl: '',
    siteDescription: '',
    searchActionUrl: '',
    searchActionTarget: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState<Record<string, string>>({});

  const labels = schemaTranslations[language];

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (onDataChange) {
      onDataChange({ schemaType, data: updated });
    }
  };


  const handleCopy = () => {
    const schema = generateSchema(schemaType, formData);
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    navigator.clipboard.writeText(jsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const schema = generateSchema(schemaType, formData);
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    const blob = new Blob([jsonLd], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'structured-data.jsonld';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFormData(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
    setValidation({});
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          {labels.title}
        </h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-6">
          <SchemaTypeSelector
            schemaType={schemaType}
            labels={labels}
            onChange={setSchemaType}
          />

          <div className="space-y-4">
            <SchemaFormFields
              schemaType={schemaType}
              formData={formData}
              labels={labels}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? labels.hide : labels.preview}
            </button>

            <button
              onClick={handleClear}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              {labels.clear}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        <SchemaPreview
          showPreview={showPreview}
          schema={generateSchema(schemaType, formData)}
          labels={labels}
          onCopy={handleCopy}
          onDownload={handleDownload}
          copied={copied}
        />
      </AnimatePresence>
    </div>
  );
};
