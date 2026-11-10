// Structured data (JSON-LD) that helps search engines understand the business and its pages.

export function organization(site) {
  const address = { "@type": "PostalAddress" };
  if (site.location.countryCode) address.addressCountry = site.location.countryCode;
  if (site.location.city) address.addressLocality = site.location.city;
  if (site.location.region) address.addressRegion = site.location.region;
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": site.url + "/#organization",
    name: site.name,
    url: site.url + "/",
    logo: site.url + "/assets/icons/icon-512.png",
    image: site.url + "/assets/og/default.png",
    description: site.description,
    slogan: site.tagline
  };
  if (Object.keys(address).length > 1) data.address = address;
  if (site.contact.email) data.email = site.contact.email;
  if (site.contact.phone) data.telephone = site.contact.phone;
  const profiles = Object.values(site.social).filter(Boolean);
  if (profiles.length) data.sameAs = profiles;
  return data;
}

export const website = site => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": site.url + "/#website",
  name: site.name,
  url: site.url + "/",
  publisher: { "@id": site.url + "/#organization" }
});

export const breadcrumbs = (site, trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: site.url + item.path
  }))
});

export const faqPage = items => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a }
  }))
});

export const service = (site, item) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: item.name,
  serviceType: item.name,
  description: item.metaDescription,
  url: site.url + "/services/" + item.slug + "/",
  provider: { "@id": site.url + "/#organization" }
});

export const article = (site, post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.updated || post.date,
  mainEntityOfPage: site.url + "/insights/" + post.slug + "/",
  image: /^https:\/\//i.test(post.cover || "") ? post.cover : site.url + (post.cover || "/assets/og/default.png"),
  author: { "@type": "Organization", name: site.name, url: site.url + "/" },
  publisher: { "@id": site.url + "/#organization" }
});

export const creativeWork = (site, project, image) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.name + " — " + project.type,
  headline: project.headline,
  description: project.challenge,
  url: site.url + "/work/" + project.slug + "/",
  image: site.url + image,
  creator: { "@id": site.url + "/#organization" }
});
