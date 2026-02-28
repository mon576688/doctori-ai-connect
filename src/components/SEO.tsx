import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  keywords?: string;
  article?: {
    publishedTime?: string;
    section?: string;
  };
}

export const SEO = ({
  title,
  description,
  canonicalPath,
  ogImage = '/og-image.png',
  ogType = 'website',
  noIndex = false,
  keywords,
  article
}: SEOProps) => {
  const siteUrl = 'https://doctoriai.com';
  const fullTitle = title.includes('Doctori AI') ? title : `${title} | Doctori AI`;
  const canonicalUrl = canonicalPath 
    ? `${siteUrl}${canonicalPath}` 
    : undefined;
  const imageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="Doctori AI" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@DoctoriAI" />
      
      {/* Article specific */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.section && (
        <meta property="article:section" content={article.section} />
      )}
    </Helmet>
  );
};
