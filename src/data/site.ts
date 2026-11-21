// Single place for brand and personal details. TODO: replace the placeholders.
export const site = {
  name: "PVP Software", // the brand
  owner: "Pavlo Protsenko", // the person behind it
  role: "Full-stack developer",
  slogan: "Build. Ship. Talk.",
  tagline:
    "Code, shipped products, and straight talk on building tech. No buzzwords, just results.",
  description:
    "PVP Software is where Pavlo Protsenko ships apps and tools and writes about how they get built.",
  url: "https://example.com", // TODO: real domain
  email: "hello@example.com", // TODO: real email
  telegram: { handle: "@pvp_software", href: "https://t.me/pvp_software" },
  links: [
    { label: "Telegram", href: "https://t.me/pvp_software" },
    { label: "GitHub", href: "https://github.com/PavloPro7" },
  ],
  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
