import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function MetaTags({ 
  title = "IronPulse | Elite Cybernetic Fitness Protocol", 
  description = "Step into the future of strength training. IronPulse merges raw iron with cyberpunk analytics to give you absolute control over your physical evolution.",
  image = "/og-image.png", // Fallback image if exists
  url = "https://ironpulse.app"
}: MetaTagsProps) {
  const fullTitle = title.includes("IronPulse") ? title : `${title} | IronPulse`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
