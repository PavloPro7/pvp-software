// Single place for brand and personal details.
export const site = {
  name: "PVP Software", // the brand
  owner: "Pavlo Protsenko", // the person behind it
  role: "Full-stack developer",
  slogan: "Build. Ship. Talk.",
  tagline:
    "Code, shipped products, and straight talk on building tech. No buzzwords, just results.",
  description:
    "PVP Software is where Pavlo Protsenko ships apps and tools and writes about how they get built.",
  // The public address of the site. The deploy workflow fills it in; on your
  // computer it is the local address.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  // TODO: your contact email. While it is empty, the site shows no email.
  email: "" as string,
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
