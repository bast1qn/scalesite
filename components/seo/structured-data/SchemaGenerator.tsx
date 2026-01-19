import type { SchemaFormData, SchemaType } from '../types';

export const generateSchema = (schemaType: SchemaType, formData: SchemaFormData): Record<string, unknown> => {
  const schema: Record<string, unknown> = {
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
        if (formData.offersUrl) (schema.offers as Record<string, unknown>).url = formData.offersUrl;
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
