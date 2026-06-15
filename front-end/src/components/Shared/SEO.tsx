import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  image,
  url,
  noIndex = false,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {image && <meta property="og:image" content={image} />}

      {url && (
        <>
          <meta property="og:url" content={url} />
          <link rel="canonical" href={url} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
