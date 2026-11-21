import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "About" };

// TODO: write this in your own words: who you are, what you are good at,
// what you are looking for.
export default function AboutPage() {
  return (
    <div className="container narrow section">
      <h1>About</h1>
      <p>
        {site.name} is the name I ship under. I&apos;m {site.owner}, a {site.role.toLowerCase()}:
        I build mobile apps and AI tools, release them, and share how it went on{" "}
        <a href={site.telegram.href} rel="noopener">
          Telegram
        </a>
        .
      </p>
      <p className="muted">{site.tagline}</p>
    </div>
  );
}
