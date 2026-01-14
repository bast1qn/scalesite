import { SchemaFormData } from '../StructuredData';

interface SchemaFormLabels {
  fields: Record<string, string>;
  placeholders: Record<string, string>;
}

interface SchemaFormFieldsProps {
  schemaType: string;
  formData: SchemaFormData;
  labels: SchemaFormLabels;
  onChange: (field: string, value: string) => void;
}

export const SchemaFormFields: React.FC<SchemaFormFieldsProps> = ({
  schemaType,
  formData,
  labels,
  onChange
}) => {
  const getInputClassName = (hasError = false) => {
    return `w-full px-4 py-3 bg-white/5 border transition-all duration-200 ${
      hasError ? 'border-red-500' : 'border-white/10'
    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  switch (schemaType) {
    case 'Article':
    case 'NewsArticle':
    case 'BlogPosting':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {labels.fields.headline}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => onChange('headline', e.target.value)}
              placeholder={labels.placeholders.headline}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.image}</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => onChange('image', e.target.value)}
              placeholder={labels.placeholders.image}
              className={getInputClassName()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.author}</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => onChange('author', e.target.value)}
                placeholder={labels.placeholders.author}
                className={getInputClassName()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.publisher}</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => onChange('publisher', e.target.value)}
                placeholder={labels.placeholders.publisher}
                className={getInputClassName()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.datePublished}</label>
              <input
                type="date"
                value={formData.datePublished}
                onChange={(e) => onChange('datePublished', e.target.value)}
                className={getInputClassName()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.dateModified}</label>
              <input
                type="date"
                value={formData.dateModified}
                onChange={(e) => onChange('dateModified', e.target.value)}
                className={getInputClassName()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.articleSection}</label>
            <input
              type="text"
              value={formData.articleSection}
              onChange={(e) => onChange('articleSection', e.target.value)}
              placeholder="Technology"
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.description}</label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder={labels.placeholders.description}
              rows={3}
              className={getInputClassName()}
            />
          </div>
        </>
      );

    case 'LocalBusiness':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {labels.fields.name}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder={labels.placeholders.name}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.address}</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder={labels.placeholders.address}
              className={getInputClassName()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.telephone}</label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => onChange('telephone', e.target.value)}
                placeholder={labels.placeholders.telephone}
                className={getInputClassName()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.email}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder={labels.placeholders.email}
                className={getInputClassName()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.openingHours}</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => onChange('openingHours', e.target.value)}
              placeholder={labels.placeholders.openingHours}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.priceRange}</label>
            <input
              type="text"
              value={formData.priceRange}
              onChange={(e) => onChange('priceRange', e.target.value)}
              placeholder={labels.placeholders.priceRange}
              className={getInputClassName()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.geoLatitude}</label>
              <input
                type="number"
                step="any"
                value={formData.geoLatitude}
                onChange={(e) => onChange('geoLatitude', e.target.value)}
                placeholder="52.5200"
                className={getInputClassName()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.geoLongitude}</label>
              <input
                type="number"
                step="any"
                value={formData.geoLongitude}
                onChange={(e) => onChange('geoLongitude', e.target.value)}
                placeholder="13.4050"
                className={getInputClassName()}
              />
            </div>
          </div>
        </>
      );

    case 'Product':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {labels.fields.productName}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => onChange('productName', e.target.value)}
              placeholder={labels.placeholders.productName}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.productImage}</label>
            <input
              type="url"
              value={formData.productImage}
              onChange={(e) => onChange('productImage', e.target.value)}
              placeholder={labels.placeholders.image}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.productDescription}</label>
            <textarea
              value={formData.productDescription}
              onChange={(e) => onChange('productDescription', e.target.value)}
              placeholder={labels.placeholders.description}
              rows={3}
              className={getInputClassName()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.brand}</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => onChange('brand', e.target.value)}
              placeholder={labels.placeholders.brand}
              className={getInputClassName()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.offersPrice}</label>
              <input
                type="number"
                step="0.01"
                value={formData.offersPrice}
                onChange={(e) => onChange('offersPrice', e.target.value)}
                placeholder={labels.placeholders.offersPrice}
                className={getInputClassName()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.offersCurrency}</label>
              <select
                value={formData.offersCurrency}
                onChange={(e) => onChange('offersCurrency', e.target.value)}
                className={getInputClassName()}
              >
                <option value="EUR" className="bg-gray-900">EUR</option>
                <option value="USD" className="bg-gray-900">USD</option>
                <option value="GBP" className="bg-gray-900">GBP</option>
                <option value="CHF" className="bg-gray-900">CHF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.offersAvailability}</label>
              <select
                value={formData.offersAvailability}
                onChange={(e) => onChange('offersAvailability', e.target.value)}
                className={getInputClassName()}
              >
                <option value="https://schema.org/InStock" className="bg-gray-900">In Stock</option>
                <option value="https://schema.org/OutOfStock" className="bg-gray-900">Out of Stock</option>
                <option value="https://schema.org/PreOrder" className="bg-gray-900">Pre-Order</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{labels.fields.offersUrl}</label>
            <input
              type="url"
              value={formData.offersUrl}
              onChange={(e) => onChange('offersUrl', e.target.value)}
              placeholder={labels.placeholders.offersUrl}
              className={getInputClassName()}
            />
          </div>
        </>
      );

    default:
      return (
        <div className="text-center text-gray-400 py-8">
          Select a schema type to see available fields
        </div>
      );
  }
};
