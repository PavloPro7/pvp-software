// On GitHub Pages the site lives under a sub-path (see next.config.ts).
// Links made with next/link get that path automatically. Image paths do not,
// so every image from the public folder goes through asset().
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
