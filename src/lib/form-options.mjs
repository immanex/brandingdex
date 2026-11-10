// Choices offered in the project brief form. Shared by the website and the form handler,
// so an option added here is shown on the form and accepted by the server.

export const SERVICES = [
  "Brand strategy & positioning",
  "Brand identity",
  "Website & digital experience",
  "Ongoing creative partnership",
  "A little of everything"
];

export const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet"
];

export const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "Flexible / just exploring"
];

// Which form option each service page pre-selects.
export const SERVICE_FOR_PAGE = {
  "brand-strategy": "Brand strategy & positioning",
  "brand-identity": "Brand identity",
  "website-design": "Website & digital experience",
  "creative-partner": "Ongoing creative partnership"
};
