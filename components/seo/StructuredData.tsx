import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Code, Eye, Copy, Download, FileJson, Building, Newspaper, Store } from 'lucide-react';

type SchemaType = 'Article' | 'NewsArticle' | 'BlogPosting' | 'LocalBusiness' | 'Organization' | 'Product' | 'Person' | 'WebSite';

interface StructuredDataProps {
  language?: 'de' | 'en';
  initialData?: any;
  onDataChange?: (data: any) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  language = 'de',
  initialData,
  onDataChange,
  variant = 'default'
}) => {
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [formData, setFormData] = useState<Record<string, any>>({
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

  const t = {
    de: {
      title: 'Strukturierte Daten (Schema.org)',
      description: 'Erstelle JSON-LD strukturierte Daten für Suchmaschinen',
      selectType: 'Schema-Typ auswählen',
      generate: 'Generieren',
      clear: 'Zurücksetzen',
      preview: 'Vorschau',
      hide: 'Ausblenden',
      copy: 'Kopieren',
      download: 'Herunterladen',
      generated: 'Generierte JSON-LD',
      validate: 'Validieren',
      validationSuccess: 'Valides JSON-LD',
      validationError: 'Ungültiges JSON-LD',
      required: 'Pflichtfeld',
      types: {
        Article: 'Artikel',
        NewsArticle: 'Nachrichten-Artikel',
        BlogPosting: 'Blog-Post',
        LocalBusiness: 'Lokales Geschäft',
        Organization: 'Organisation',
        Product: 'Produkt',
        Person: 'Person',
        WebSite: 'Website'
      },
      fields: {
        headline: 'Überschrift',
        image: 'Bild-URL',
        author: 'Autor',
        publisher: 'Herausgeber',
        datePublished: 'Veröffentlichungsdatum',
        dateModified: 'Änderungsdatum',
        articleSection: 'Sektion',
        description: 'Beschreibung',
        name: 'Name',
        address: 'Adresse',
        telephone: 'Telefon',
        email: 'E-Mail',
        openingHours: 'Öffnungszeiten',
        priceRange: 'Preisklasse',
        geoLatitude: 'Breitengrad',
        geoLongitude: 'Längengrad',
        legalName: 'Gesetzlicher Name',
        url: 'URL',
        logo: 'Logo-URL',
        foundingDate: 'Gründungsdatum',
        numberOfEmployees: 'Anzahl Mitarbeiter',
        productName: 'Produktname',
        productDescription: 'Produktbeschreibung',
        brand: 'Marke',
        offersPrice: 'Preis',
        offersCurrency: 'Währung',
        offersAvailability: 'Verfügbarkeit',
        offersUrl: 'Angebots-URL',
        personName: 'Name',
        personImage: 'Bild-URL',
        personJobTitle: 'Berufsbezeichnung',
        personUrl: 'Webseite',
        personWorksFor: 'Arbeitgeber',
        siteName: 'Website-Name',
        siteDescription: 'Website-Beschreibung',
        searchActionUrl: 'Such-URL',
        searchActionTarget: 'Such-Ziel'
      },
      placeholders: {
        headline: 'Deine Überschrift',
        image: 'https://example.com/image.jpg',
        author: 'Max Mustermann',
        publisher: 'ScaleSite',
        datePublished: '2024-01-13',
        dateModified: '2024-01-13',
        description: 'Beschreibe den Inhalt...',
        name: 'Name des Unternehmens/Produkts',
        address: 'Musterstraße 1, 12345 Berlin',
        telephone: '+49 30 12345678',
        email: 'info@example.com',
        openingHours: 'Mo-Fr 09:00-18:00',
        priceRange: '€€',
        url: 'https://example.com',
        productName: 'Produkt XYZ',
        brand: 'Marke ABC',
        offersPrice: '99.99',
        offersUrl: 'https://example.com/product'
      }
    },
    en: {
      title: 'Structured Data (Schema.org)',
      description: 'Create JSON-LD structured data for search engines',
      selectType: 'Select Schema Type',
      generate: 'Generate',
      clear: 'Clear',
      preview: 'Preview',
      hide: 'Hide',
      copy: 'Copy',
      download: 'Download',
      generated: 'Generated JSON-LD',
      validate: 'Validate',
      validationSuccess: 'Valid JSON-LD',
      validationError: 'Invalid JSON-LD',
      required: 'Required',
      types: {
        Article: 'Article',
        NewsArticle: 'News Article',
        BlogPosting: 'Blog Post',
        LocalBusiness: 'Local Business',
        Organization: 'Organization',
        Product: 'Product',
        Person: 'Person',
        WebSite: 'Website'
      },
      fields: {
        headline: 'Headline',
        image: 'Image URL',
        author: 'Author',
        publisher: 'Publisher',
        datePublished: 'Published Date',
        dateModified: 'Modified Date',
        articleSection: 'Section',
        description: 'Description',
        name: 'Name',
        address: 'Address',
        telephone: 'Phone',
        email: 'Email',
        openingHours: 'Opening Hours',
        priceRange: 'Price Range',
        geoLatitude: 'Latitude',
        geoLongitude: 'Longitude',
        legalName: 'Legal Name',
        url: 'URL',
        logo: 'Logo URL',
        foundingDate: 'Founding Date',
        numberOfEmployees: 'Number of Employees',
        productName: 'Product Name',
        productDescription: 'Product Description',
        brand: 'Brand',
        offersPrice: 'Price',
        offersCurrency: 'Currency',
        offersAvailability: 'Availability',
        offersUrl: 'Offer URL',
        personName: 'Name',
        personImage: 'Image URL',
        personJobTitle: 'Job Title',
        personUrl: 'Website',
        personWorksFor: 'Employer',
        siteName: 'Site Name',
        siteDescription: 'Site Description',
        searchActionUrl: 'Search URL',
        searchActionTarget: 'Search Target'
      },
      placeholders: {
        headline: 'Your headline',
        image: 'https://example.com/image.jpg',
        author: 'John Doe',
        publisher: 'ScaleSite',
        datePublished: '2024-01-13',
        dateModified: '2024-01-13',
        description: 'Describe the content...',
        name: 'Business/Product Name',
        address: '123 Main St, City, State 12345',
        telephone: '+1 234 567 890',
        email: 'info@example.com',
        openingHours: 'Mo-Fr 09:00-18:00',
        priceRange: '$$',
        url: 'https://example.com',
        productName: 'Product XYZ',
        brand: 'Brand ABC',
        offersPrice: '99.99',
        offersUrl: 'https://example.com/product'
      }
    }
  };

  const labels = t[language];

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (onDataChange) {
      onDataChange({ schemaType, data: updated });
    }
  };

  const generateSchema = (): any => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': schemaType
    };

    switch (schemaType) {
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        if (formData.headline) schema.headline = formData.headline;
        if (formData.image) schema.image = formData.image;
        if (formData.author) schema.author = { '@type': 'Person', name: formData.author };
        if (formData.publisher) schema.publisher = { '@type': 'Organization', name: formData.publisher };
        if (formData.datePublished) schema.datePublished = formData.datePublished;
        if (formData.dateModified) schema.dateModified = formData.dateModified;
        if (formData.articleSection) schema.articleSection = formData.articleSection;
        if (formData.description) schema.description = formData.description;
        break;

      case 'LocalBusiness':
        if (formData.name) schema.name = formData.name;
        schema['@type'] = 'LocalBusiness';
        if (formData.address) schema.address = { '@type': 'PostalAddress', streetAddress: formData.address };
        if (formData.telephone) schema.telephone = formData.telephone;
        if (formData.email) schema.email = formData.email;
        if (formData.openingHours) schema.openingHoursSpecification = {
          '@type': 'OpeningHoursSpecification',
          openingHours: formData.openingHours
        };
        if (formData.priceRange) schema.priceRange = formData.priceRange;
        if (formData.geoLatitude && formData.geoLongitude) {
          schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: parseFloat(formData.geoLatitude),
            longitude: parseFloat(formData.geoLongitude)
          };
        }
        break;

      case 'Organization':
        if (formData.legalName) schema.legalName = formData.legalName;
        if (formData.url) schema.url = formData.url;
        if (formData.logo) schema.logo = formData.logo;
        if (formData.foundingDate) schema.foundingDate = formData.foundingDate;
        if (formData.numberOfEmployees) schema.numberOfEmployees = parseInt(formData.numberOfEmployees);
        if (formData.addressOrg) schema.address = { '@type': 'PostalAddress', streetAddress: formData.addressOrg };
        break;

      case 'Product':
        if (formData.productName) schema.name = formData.productName;
        if (formData.productImage) schema.image = formData.productImage;
        if (formData.productDescription) schema.description = formData.productDescription;
        if (formData.brand) schema.brand = { '@type': 'Brand', name: formData.brand };
        if (formData.offersPrice) {
          schema.offers = {
            '@type': 'Offer',
            price: parseFloat(formData.offersPrice),
            priceCurrency: formData.offersCurrency || 'EUR',
            availability: formData.offersAvailability || 'https://schema.org/InStock'
          };
          if (formData.offersUrl) schema.offers.url = formData.offersUrl;
        }
        break;

      case 'Person':
        if (formData.personName) schema.name = formData.personName;
        if (formData.personImage) schema.image = formData.personImage;
        if (formData.personJobTitle) schema.jobTitle = formData.personJobTitle;
        if (formData.personUrl) schema.url = formData.personUrl;
        if (formData.personWorksFor) schema.worksFor = { '@type': 'Organization', name: formData.personWorksFor };
        if (formData.personEmail) schema.email = formData.personEmail;
        if (formData.personTelephone) schema.telephone = formData.personTelephone;
        if (formData.personAddress) schema.address = { '@type': 'PostalAddress', streetAddress: formData.personAddress };
        break;

      case 'WebSite':
        if (formData.siteName) schema.name = formData.siteName;
        if (formData.siteUrl) schema.url = formData.siteUrl;
        if (formData.siteDescription) schema.description = formData.siteDescription;
        if (formData.searchActionUrl && formData.searchActionTarget) {
          schema.potentialAction = {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: formData.searchActionTarget
            },
            'query-input': 'required name=search_term_string'
          };
        }
        break;
    }

    return schema;
  };

  const handleCopy = () => {
    const schema = generateSchema();
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    navigator.clipboard.writeText(jsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const schema = generateSchema();
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

  const validateSchema = (): boolean => {
    const schema = generateSchema();
    try {
      JSON.stringify(schema);
      return true;
    } catch {
      return false;
    }
  };

  const renderFields = () => {
    switch (schemaType) {
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {labels.fields.headline}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder={labels.placeholders.headline}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.image}</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder={labels.placeholders.image}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.author}</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder={labels.placeholders.author}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.publisher}</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleChange('publisher', e.target.value)}
                  placeholder={labels.placeholders.publisher}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.datePublished}</label>
                <input
                  type="date"
                  value={formData.datePublished}
                  onChange={(e) => handleChange('datePublished', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.dateModified}</label>
                <input
                  type="date"
                  value={formData.dateModified}
                  onChange={(e) => handleChange('dateModified', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.articleSection}</label>
              <input
                type="text"
                value={formData.articleSection}
                onChange={(e) => handleChange('articleSection', e.target.value)}
                placeholder="Technology"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.description}</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={labels.placeholders.description}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </>
        );

      case 'LocalBusiness':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {labels.fields.name}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={labels.placeholders.name}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.address}</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder={labels.placeholders.address}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.telephone}</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder={labels.placeholders.telephone}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.email}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={labels.placeholders.email}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.openingHours}</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder={labels.placeholders.openingHours}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.priceRange}</label>
              <input
                type="text"
                value={formData.priceRange}
                onChange={(e) => handleChange('priceRange', e.target.value)}
                placeholder={labels.placeholders.priceRange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.geoLatitude}</label>
                <input
                  type="number"
                  step="any"
                  value={formData.geoLatitude}
                  onChange={(e) => handleChange('geoLatitude', e.target.value)}
                  placeholder="52.5200"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.geoLongitude}</label>
                <input
                  type="number"
                  step="any"
                  value={formData.geoLongitude}
                  onChange={(e) => handleChange('geoLongitude', e.target.value)}
                  placeholder="13.4050"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );

      case 'Product':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {labels.fields.productName}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder={labels.placeholders.productName}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.productImage}</label>
              <input
                type="url"
                value={formData.productImage}
                onChange={(e) => handleChange('productImage', e.target.value)}
                placeholder={labels.placeholders.image}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.productDescription}</label>
              <textarea
                value={formData.productDescription}
                onChange={(e) => handleChange('productDescription', e.target.value)}
                placeholder={labels.placeholders.description}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.brand}</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder={labels.placeholders.brand}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.offersPrice}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.offersPrice}
                  onChange={(e) => handleChange('offersPrice', e.target.value)}
                  placeholder={labels.placeholders.offersPrice}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.offersCurrency}</label>
                <select
                  value={formData.offersCurrency}
                  onChange={(e) => handleChange('offersCurrency', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR" className="bg-gray-900">EUR</option>
                  <option value="USD" className="bg-gray-900">USD</option>
                  <option value="GBP" className="bg-gray-900">GBP</option>
                  <option value="CHF" className="bg-gray-900">CHF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.offersAvailability}</label>
                <select
                  value={formData.offersAvailability}
                  onChange={(e) => handleChange('offersAvailability', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="https://schema.org/InStock" className="bg-gray-900">In Stock</option>
                  <option value="https://schema.org/OutOfStock" className="bg-gray-900">Out of Stock</option>
                  <option value="https://schema.org/PreOrder" className="bg-gray-900">Pre-Order</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{labels.fields.offersUrl}</label>
              <input
                type="url"
                value={formData.offersUrl}
                onChange={(e) => handleChange('offersUrl', e.target.value)}
                placeholder={labels.placeholders.offersUrl}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FileJson className="w-6 h-6 text-blue-400" />
          {labels.title}
        </h3>
        <p className="text-gray-400">{labels.description}</p>
      </div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="space-y-6">
          {/* Schema Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {labels.selectType}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(labels.types) as SchemaType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSchemaType(type)}
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

          {/* Fields */}
          <div className="space-y-4">
            {renderFields()}
          </div>

          {/* Actions */}
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

      {/* Generated JSON-LD Preview */}
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
                <Code className="w-5 h-5 text-green-500" />
                {labels.generated}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? '✓' : labels.copy}
                </button>
                <button
                  onClick={handleDownload}
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
                  {JSON.stringify(generateSchema(), null, 2)}
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
        )}
      </AnimatePresence>
    </div>
  );
};
